import type { IprojectSchema, IScrapingSchema } from "@repo/common/type";
import { prisma } from "@repo/db";
import { randomUUIDv7 } from "bun";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer"; // Added for JavaScript-rendered content

// Interfaces remain unchanged
export interface StructuredContent {
  headings: string[];
  content: string[];
  codeSnippets: string[];
}

export interface VectorChunk {
  url: string;
  pageTitle: string;
  timestamp: string;
  chunkType: 'heading_content_code' | 'heading_content' | 'content' | 'code';
  content: string;
  _id: string;
}

export interface ScrapedPage {
  url: string;
  title: string;
  structuredContent: StructuredContent;
  links: string[];
  timestamp: Date;
  wordCount: number;
}

export interface ScrapeResult {
  baseUrl: string;
  pages: ScrapedPage[];
  totalPages: number;
  errors: string[];
}

export interface ScraperConfig {
  maxPages?: number;
  maxDepth?: number;
  delay?: number;
  timeout?: number;
  userAgent?: string;
  excludePatterns?: RegExp[];
  includePatterns?: RegExp[];
  minContentLength?: number;
  useHeadlessBrowser?: boolean; // New: Option to use Puppeteer for dynamic content
  maxRetries?: number; // New: Retry failed requests
  keywords?: string[]; // New: Filter content by keywords
  concurrency?: number; // New: Control parallel processing
}

const DEFAULT_CONFIG: Required<ScraperConfig> = {
  maxPages: 50,
  maxDepth: 8,
  delay: 1000,
  timeout: 10000,
  userAgent: 'Mozilla/5.0 (compatible; AdvancedWebScraper/2.0)',
  excludePatterns: [
    /\.(pdf|jpg|jpeg|png|gif|svg|css|js|ico|woff|woff2|ttf|eot)$/i,
    /#/,
    /\/(login|register|cart|checkout|account|signup)\//i, // Relaxed: Removed privacy/terms
  ],
  includePatterns: [],
  minContentLength: 8, // Reduced to capture shorter meaningful content
  useHeadlessBrowser: false, // Default to fetch for performance
  maxRetries: 3, // Retry failed requests
  keywords: [], // Optional keywords for content relevance
  concurrency: 3, // Process 3 pages concurrently
};

/**
 * Normalize and validate URL
 */
function normalizeUrl(baseUrl: string, href: string): string | null {
  try {
    const parsedBase = new URL(baseUrl);
    const resolvedUrl = new URL(href, baseUrl);
    
    if (resolvedUrl.hostname !== parsedBase.hostname) {
      return null;
    }
    
    resolvedUrl.hash = '';
    return resolvedUrl.toString();
  } catch {
    return null;
  }
}

/**
 * Check if URL should be excluded
 */
function shouldExcludeUrl(url: string, config: Required<ScraperConfig>): boolean {
  for (const pattern of config.excludePatterns) {
    if (pattern.test(url)) {
      return true;
    }
  }
  
  if (config.includePatterns.length > 0) {
    return !config.includePatterns.some(pattern => pattern.test(url));
  }
  
  return false;
}

/**
 * Check if content is relevant based on keywords and boilerplate detection
 */
function isRelevantContent(text: string, config: Required<ScraperConfig>): boolean {
  if (text.length < config.minContentLength) return false;
  
  // More comprehensive boilerplate patterns
  const boilerplatePatterns = [
    /^(click here|read more|learn more|see more|view all|show all)$/i,
    /^(home|about|contact|privacy|terms|login|register|sign up|sign in)$/i,
    /^(menu|navigation|nav|search|submit|cancel|close|ok|yes|no)$/i,
    /^(loading|error|success|warning|info|notice)$/i,
    /^(copyright|all rights reserved|\(c\)).*$/i,
    /^(lorem ipsum|placeholder|sample text).*$/i,
    /^[\d\s\-\.\(\)\+]+$/, // Only numbers, spaces, and punctuation
    /^[^a-zA-Z]*$/, // No letters
  ];
  
  if (boilerplatePatterns.some(pattern => pattern.test(text.trim()))) {
    return false;
  }
  
  // Check for minimum word count
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  if (wordCount < 3) return false;
  
  // Check for keyword relevance if provided
  if (config.keywords.length > 0) {
    return config.keywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  
  return true;
}

/**
 * Fetch HTML content with retry logic
 */
async function fetchHtml(url: string, config: Required<ScraperConfig>): Promise<string> {
  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);
    
    try {
      if (config.useHeadlessBrowser) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setUserAgent(config.userAgent);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: config.timeout });
        const html = await page.content();
        await browser.close();
        return html;
      } else {
        const response = await fetch(url, {
          headers: {
            'User-Agent': config.userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
          },
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('text/html')) {
          throw new Error('Not an HTML page');
        }
        
        return await response.text();
      }
    } catch (error) {
      if (attempt === config.maxRetries) {
        throw error;
      }
      console.warn(`Retry ${attempt}/${config.maxRetries} for ${url}: ${error}`);
      await new Promise(resolve => setTimeout(resolve, config.delay * attempt));
    } finally {
      clearTimeout(timeoutId);
    }
  }
  throw new Error(`Failed to fetch ${url} after ${config.maxRetries} attempts`);
}

/**
 * Extract structured content from HTML with comprehensive content capture
 */
function extractTextContent(html: string, config: Required<ScraperConfig>): { title: string; structuredContent: StructuredContent; wordCount: number } {
  const $ = cheerio.load(html);
  
  // Only remove truly unwanted elements - be less aggressive
  $('script, style, noscript').remove();
  $.root().contents().filter((_, node) => node.type === 'comment').remove();
  
  // Extract title with multiple fallbacks
  const title = $('title').text().trim() || 
                $('meta[property="og:title"]').attr('content')?.trim() || 
                $('meta[name="title"]').attr('content')?.trim() ||
                $('h1').first().text().trim() || 
                'Untitled';
  
  const headings: string[] = [];
  const content: string[] = [];
  const codeSnippets: string[] = [];
  
  // Strategy 1: Extract all headings first
  $('h1, h2, h3, h4, h5, h6').each((_, element) => {
    const headingText = $(element).text().trim();
    if (headingText && headingText.length >= config.minContentLength) {
      headings.push(headingText.replace(/\s+/g, ' '));
    }
  });
  
  // Strategy 2: Extract all code blocks
  $('pre, code, .code, .highlight, .language-, [class*="language"], [class*="code"]').each((_, element) => {
    const codeText = $(element).text().trim();
    if (codeText && codeText.length >= config.minContentLength && !codeSnippets.includes(codeText)) {
      codeSnippets.push(codeText);
    }
  });
  
  // Strategy 3: Comprehensive content extraction with multiple approaches
  
  // Approach 3A: Try main content containers first
  const mainContentSelectors = [
    'main',
    'article', 
    '.content',
    '.post',
    '.entry',
    '.article',
    '#main',
    '#content',
    '.main-content',
    '.post-content',
    '.entry-content',
    '.article-content',
    '.page-content',
    '.single-content',
    '.blog-content',
    '[role="main"]',
    '.container .row .col', // Bootstrap layouts
    '.documentation', // Documentation sites
    '.docs', // Docs sites
    '.wiki', // Wiki content
    '.readme', // README content
  ];
  
  let foundMainContent = false;
  
  for (const selector of mainContentSelectors) {
    const container = $(selector).first();
    if (container.length > 0) {
      container.find('p, div, section, article, li, td, span, .text, .description').each((_, element) => {
        // Skip if it's mainly code (already extracted)
        if ($(element).find('pre, code').length > 0 && $(element).text().trim().length < 100) {
          return;
        }
        
        const text = $(element).text().trim();
        if (text && 
            text.length >= config.minContentLength && 
            !content.includes(text) &&
            !headings.includes(text) &&
            isRelevantContent(text, config)) {
          content.push(text.replace(/\s+/g, ' '));
        }
      });
      
      if (content.length > 0) {
        foundMainContent = true;
        break;
      }
    }
  }
  
  // Approach 3B: If no main content found, extract from common content elements
  if (!foundMainContent) {
    $('p, div, section, article, li, td, blockquote, .text, .description, .summary').each((_, element) => {
      const $el = $(element);
      
      // Skip navigation, header, footer, sidebar elements
      if ($el.closest('nav, header, footer, .nav, .navigation, .sidebar, .menu, .breadcrumb').length > 0) {
        return;
      }
      
      // Skip if it's mainly code (already extracted)
      if ($el.find('pre, code').length > 0 && $el.text().trim().length < 100) {
        return;
      }
      
      const text = $el.text().trim();
      if (text && 
          text.length >= config.minContentLength && 
          !content.includes(text) &&
          !headings.includes(text) &&
          isRelevantContent(text, config)) {
        content.push(text.replace(/\s+/g, ' '));
      }
    });
  }
  
  // Approach 3C: Extract from specific content types if still low content
  if (content.length < 5) {
    // Try to extract from lists, tables, and other structured content
    $('ul li, ol li, dl dd, table td, table th').each((_, element) => {
      const text = $(element).text().trim();
      if (text && 
          text.length >= config.minContentLength && 
          !content.includes(text) &&
          !headings.includes(text)) {
        content.push(text.replace(/\s+/g, ' '));
      }
    });
    
    // Try to extract from divs with meaningful classes
    $('div[class*="content"], div[class*="text"], div[class*="description"], div[class*="body"], div[class*="post"], div[class*="article"]').each((_, element) => {
      const text = $(element).text().trim();
      if (text && 
          text.length >= config.minContentLength && 
          !content.includes(text) &&
          !headings.includes(text)) {
        content.push(text.replace(/\s+/g, ' '));
      }
    });
  }
  
  // Approach 3D: Last resort - extract any meaningful text
  if (content.length < 3) {
    $('body *').each((_, element) => {
      const $el = $(element);
      
      // Skip elements that typically don't have meaningful content
      if ($el.is('script, style, noscript, meta, link, head, title, nav, header, footer')) {
        return;
      }
      
      // Skip if it has children (we want leaf nodes)
      if ($el.children().length > 0) {
        return;
      }
      
      const text = $el.text().trim();
      if (text && 
          text.length >= config.minContentLength && 
          text.length <= 1000 && // Avoid extremely long text blocks
          !content.includes(text) &&
          !headings.includes(text) &&
          isRelevantContent(text, config)) {
        content.push(text.replace(/\s+/g, ' '));
      }
    });
  }
  
  // Remove duplicates and very similar content
  const uniqueContent = content.filter((item, index) => {
    // Check if this content is substantially different from previous items
    for (let i = 0; i < index; i++) {
      if(item && content[i]){
        const similarity = calculateSimilarity(item, content[i] || '');
        if(similarity > 0.8){
          return false;
        }
      }
    }
    return true;
  });
  
  // Calculate total word count
  const allText = [...headings, ...uniqueContent, ...codeSnippets].join(' ');
  const wordCount = allText.split(/\s+/).filter(word => word.length > 0).length;
  
  console.log(`Extracted from ${title}: ${headings.length} headings, ${uniqueContent.length} content blocks, ${codeSnippets.length} code snippets, ${wordCount} total words`);
  
  return {
    title,
    structuredContent: { 
      headings, 
      content: uniqueContent, 
      codeSnippets 
    },
    wordCount
  };
}

/**
 * Calculate similarity between two strings (simple implementation)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(word => set2.has(word)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * More aggressive link finding to discover more pages
 */
function findInternalLinks(html: string, baseUrl: string): string[] {
  const $ = cheerio.load(html);
  const links = new Set<string>();
  
  // Standard href links
  $('a[href]').each((_, element) => {
    const href = $(element).attr('href');
    if (href) {
      const normalizedUrl = normalizeUrl(baseUrl, href);
      if (normalizedUrl && normalizedUrl !== baseUrl && !links.has(normalizedUrl)) {
        links.add(normalizedUrl);
      }
    }
  });
  
  // Links in onclick, data attributes, and other places
  $('[onclick], [data-url], [data-href], [data-link]').each((_, element) => {
    const onclick = $(element).attr('onclick');
    const dataUrl = $(element).attr('data-url') || 
                   $(element).attr('data-href') || 
                   $(element).attr('data-link');
    
    if (dataUrl) {
      const normalizedUrl = normalizeUrl(baseUrl, dataUrl);
      if (normalizedUrl && normalizedUrl !== baseUrl && !links.has(normalizedUrl)) {
        links.add(normalizedUrl);
      }
    }
    
    if (onclick) {
      // Extract URLs from onclick handlers
      const urlMatches = onclick.match(/(?:location\.href|window\.open|navigate|goto)\s*=?\s*['"]([^'"]+)['"]/g);
      if (urlMatches) {
        urlMatches.forEach(match => {
          const urlMatch = match.match(/['"]([^'"]+)['"]/);
          if (urlMatch && urlMatch[1]) {
            const normalizedUrl = normalizeUrl(baseUrl, urlMatch[1]);
            if (normalizedUrl && normalizedUrl !== baseUrl && !links.has(normalizedUrl)) {
              links.add(normalizedUrl);
            }
          }
        });
      }
    }
  });
  
  // Links in meta tags (like canonical, alternate)
  $('link[href], meta[content*="http"]').each((_, element) => {
    const href = $(element).attr('href') || $(element).attr('content');
    if (href) {
      const normalizedUrl = normalizeUrl(baseUrl, href);
      if (normalizedUrl && normalizedUrl !== baseUrl && !links.has(normalizedUrl)) {
        links.add(normalizedUrl);
      }
    }
  });
  
  return Array.from(links);
}

/**
 * Scrape a single page
 */
async function scrapePage(url: string, config: Required<ScraperConfig>): Promise<ScrapedPage> {
  const html = await fetchHtml(url, config);
  const { title, structuredContent, wordCount } = extractTextContent(html, config);
  const links = findInternalLinks(html, url); // Now synchronous
  
  return {
    url,
    title,
    structuredContent,
    links: links.filter(link => !shouldExcludeUrl(link, config)),
    timestamp: new Date(),
    wordCount
  };
}

/**
 * Main scraper function with parallel processing
 */
export async function scrapeWebsite(
  project: IScrapingSchema, 
  startUrl: string,
  userConfig: ScraperConfig = {}
): Promise<ScrapeResult> {
  const config = { ...DEFAULT_CONFIG, ...userConfig };
  const visited = new Set<string>();
  const toVisit = new Set<string>([startUrl]);
  const pages: ScrapedPage[] = [];
  const errors: string[] = [];
  const baseUrl = new URL(startUrl).origin;
  
  console.log(`Starting to scrape: ${startUrl}`);
  console.log(`Max pages: ${config.maxPages}, Max depth: ${config.maxDepth}, Concurrency: ${config.concurrency}`);
  
  await prisma.scrappedStatus.update({
    where: { id: project.id },
    data: { success: 'working' }
  });
  
  let depth = 0;
  
  while (toVisit.size > 0 && pages.length < config.maxPages && depth < config.maxDepth) {
    const currentBatch = Array.from(toVisit).slice(0, config.concurrency);
    toVisit.clear();
    
    console.log(`Depth ${depth + 1}: Processing ${currentBatch.length} URLs`);
    
    // Process pages in parallel
    const pagePromises = currentBatch.map(async url => {
      if (visited.has(url) || pages.length >= config.maxPages) {
        return null;
      }
      
      visited.add(url);
      let isSuccess = false;
      
      try {
        console.log(`Scraping: ${url}`);
        const pageData = await scrapePage(url, config);
        isSuccess = true;
        
        // Add new links to queue
        for (const link of pageData.links) {
          if (!visited.has(link) && !shouldExcludeUrl(link, config)) {
            toVisit.add(link);
          }
        }
        
        console.log(`✓ Scraped: ${pageData.title} (${pageData.wordCount} words)`);
        return pageData;
      } catch (error) {
        const errorMsg = `Failed to scrape ${url}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`✗ ${errorMsg}`);
        errors.push(errorMsg);
        return null;
      }
    });
    
    // Wait for batch to complete
    const batchResults = (await Promise.all(pagePromises)).filter((page): page is ScrapedPage => page !== null);
    pages.push(...batchResults);
    
    // Save batch to database
    for (const page of batchResults) {
      try {
        await prisma.scrappedLinks.create({
          data: {
            urls: page.url,
            status: true,
            scrappedId: project.id
          }
        });
      } catch (dbError) {
        console.error(`Failed to save link to database: ${page.url}`, dbError);
        errors.push(`Database error for ${page.url}: ${dbError}`);
      }
    }
    
    // Delay between batches
    if (config.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, config.delay));
    }
    
    depth++;
  }

  const total_words = pages.reduce((sum, page) => sum + page.wordCount, 0);
  const finalStatus = errors.length === 0 ? 'success' : (pages.length > 0 ? 'success' : 'failed');
  
  await prisma.scrappedStatus.update({
    where: { id: project.id },
    data: {
      pages: pages.length,
      errors: errors.length,
      total_words: total_words,
      success: finalStatus,
      current: false,
    }
  });
  
  console.log(`\nScraping completed!`);
  console.log(`Pages scraped: ${pages.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Total words: ${total_words}`);
  console.log(`Status: ${finalStatus}`);
  
  return {
    baseUrl,
    pages,
    totalPages: pages.length,
    errors
  };
}

/**
 * Get all unique URLs
 */
export function getAllUrls(result: ScrapeResult): string[] {
  return result.pages.map(page => page.url);
}

/**
 * Improved chunking strategy for better vector embeddings
 */
export function getChunkedContent(result: ScrapeResult): VectorChunk[] {
  const chunks: VectorChunk[] = [];
  const MIN_CHUNK_SIZE = 50; // Minimum words per chunk
  const MAX_CHUNK_SIZE = 500; // Maximum words per chunk
  let chunkId = 0;
  
  for (const page of result.pages) {
    const { headings, content, codeSnippets } = page.structuredContent;
    
    // Strategy 1: Pair headings with their content
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      const relatedContent = content[i] || '';
      const relatedCode = codeSnippets[i] || '';
      
      // Combine heading with its content
      let chunkContent = heading;
      if (relatedContent) {
        chunkContent += '\n\n' + relatedContent;
      }
      if (relatedCode) {
        chunkContent += '\n\n```\n' + relatedCode + '\n```';
      }
      
      // Check if chunk meets minimum size requirement
      const wordCount = chunkContent?.split(/\s+/).filter(word => word.length > 0).length || 0;
      
      if (wordCount >= MIN_CHUNK_SIZE) {
        chunks.push({
          url: page.url,
          pageTitle: page.title,
          timestamp: page.timestamp.toISOString(),
          chunkType: relatedContent && relatedCode ? 'heading_content_code' : 
                     relatedContent ? 'heading_content' : 'heading_content',
          content: chunkContent || '',
          _id: `${chunkId++}-${randomUUIDv7()}`
        });
      }
    }
    
    // Strategy 2: Group remaining content into meaningful chunks
    const remainingContent = content.slice(headings.length);
    let currentChunk = '';
    let currentWordCount = 0;
    
    for (const contentItem of remainingContent) {
      const itemWordCount = contentItem.split(/\s+/).filter(word => word.length > 0).length;
      
      // If adding this content would exceed max chunk size, finalize current chunk
      if (currentWordCount + itemWordCount > MAX_CHUNK_SIZE && currentChunk) {
        if (currentWordCount >= MIN_CHUNK_SIZE) {
          chunks.push({
            url: page.url,
            pageTitle: page.title,
            timestamp: page.timestamp.toISOString(),
            chunkType: 'content',
            content: currentChunk.trim(),
            _id: `${chunkId++}-${randomUUIDv7()}`
          });
        }
        currentChunk = '';
        currentWordCount = 0;
      }
      
      // Add content to current chunk
      if (currentChunk) {
        currentChunk += '\n\n' + contentItem;
      } else {
        currentChunk = contentItem;
      }
      currentWordCount += itemWordCount;
    }
    
    // Finalize last content chunk
    if (currentChunk && currentWordCount >= MIN_CHUNK_SIZE) {
      chunks.push({
        url: page.url,
        pageTitle: page.title,
        timestamp: page.timestamp.toISOString(),
        chunkType: 'content',
        content: currentChunk.trim(),
        _id: `${chunkId++}-${randomUUIDv7()}`
      });
    }
    
    // Strategy 3: Group code snippets together if they're substantial
    const substantialCodeSnippets = codeSnippets.slice(headings.length).filter(code => 
      code.split(/\s+/).filter(word => word.length > 0).length >= MIN_CHUNK_SIZE / 2
    );
    
    let currentCodeChunk = '';
    let currentCodeWordCount = 0;
    
    for (const codeSnippet of substantialCodeSnippets) {
      const codeWordCount = codeSnippet.split(/\s+/).filter(word => word.length > 0).length;
      
      if (currentCodeWordCount + codeWordCount > MAX_CHUNK_SIZE && currentCodeChunk) {
        chunks.push({
          url: page.url,
          pageTitle: page.title,
          timestamp: page.timestamp.toISOString(),
          chunkType: 'code',
          content: '```\n' + currentCodeChunk.trim() + '\n```',
          _id: `${chunkId++}-${randomUUIDv7()}`
        });
        currentCodeChunk = '';
        currentCodeWordCount = 0;
      }
      
      if (currentCodeChunk) {
        currentCodeChunk += '\n\n' + codeSnippet;
      } else {
        currentCodeChunk = codeSnippet;
      }
      currentCodeWordCount += codeWordCount;
    }
    
    // Finalize last code chunk
    if (currentCodeChunk && currentCodeWordCount >= MIN_CHUNK_SIZE / 2) {
      chunks.push({
        url: page.url,
        pageTitle: page.title,
        timestamp: page.timestamp.toISOString(),
        chunkType: 'code',
        content: '```\n' + currentCodeChunk.trim() + '\n```',
        _id: `${chunkId++}-${randomUUIDv7()}`
      });
    }
    
    // Strategy 4: If no substantial chunks were created, create one comprehensive chunk
    if (chunks.filter(chunk => chunk.url === page.url).length === 0) {
      const allContent = [...headings, ...content].filter(text => text.length > 10).join('\n\n');
      if (allContent) {
        chunks.push({
          url: page.url,
          pageTitle: page.title,
          timestamp: page.timestamp.toISOString(),
          chunkType: 'content',
          content: allContent,
          _id: `${chunkId++}-${randomUUIDv7()}`
        });
      }
    }
  }
  
  console.log(`Created ${chunks.length} meaningful chunks from ${result.pages.length} pages`);
  console.log(`Average chunk size: ${chunks.reduce((sum, chunk) => 
    sum + chunk.content.split(/\s+/).filter(word => word.length > 0).length, 0) / chunks.length} words`);
  
  return chunks;
}

/**
 * Get content by URL
 */
export function getContentByUrl(result: ScrapeResult, targetUrl: string): ScrapedPage | null {
  return result.pages.find(page => page.url === targetUrl) || null;
}

/**
 * Filter pages by content length
 */
export function filterPagesByWordCount(result: ScrapeResult, minWords: number = 50): ScrapedPage[] {
  return result.pages.filter(page => page.wordCount >= minWords);
}