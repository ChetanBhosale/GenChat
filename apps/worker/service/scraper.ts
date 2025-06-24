import type { IprojectSchema, IScrapingSchema } from "@repo/common/type";
import { prisma } from "@repo/db";
import * as cheerio from "cheerio";

// Interface for structured content
export interface StructuredContent {
  headings: string[];
  content: string[];
  codeSnippets: string[];
}

// Interface for chunked content with metadata
export interface VectorChunk {
  url: string;
  pageTitle: string;
  timestamp: string;
  chunkType: 'heading_content_code' | 'heading_content' | 'content' | 'code';
  content: string; // Format: heading\ncontent\ncode or subset
  wordCount: number;
}

// Interface for scraped page data
export interface ScrapedPage {
  url: string;
  title: string;
  structuredContent: StructuredContent;
  links: string[];
  timestamp: Date;
  wordCount: number;
}

// Interface for scraper results
export interface ScrapeResult {
  baseUrl: string;
  pages: ScrapedPage[];
  totalPages: number;
  errors: string[];
}

// Configuration for the scraper
export interface ScraperConfig {
  maxPages?: number;
  maxDepth?: number;
  delay?: number; // delay between requests in ms
  timeout?: number; // request timeout in ms
  userAgent?: string;
  excludePatterns?: RegExp[];
  includePatterns?: RegExp[];
  minContentLength?: number;
}

const DEFAULT_CONFIG: Required<ScraperConfig> = {
  maxPages: 50,
  maxDepth: 3,
  delay: 1000,
  timeout: 10000,
  userAgent: 'Mozilla/5.0 (compatible; AdvancedWebScraper/2.0)',
  excludePatterns: [
    /\.(pdf|jpg|jpeg|png|gif|svg|css|js|ico|woff|woff2|ttf|eot)$/i,
    /#/,
    /\/(search|login|register|cart|checkout|account|signup)\//i,
    /\/(privacy|terms|cookie)/i
  ],
  includePatterns: [],
  minContentLength: 20
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
 * Check if URL should be excluded based on patterns
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
 * Fetch HTML content from URL
 */
async function fetchHtml(url: string, config: Required<ScraperConfig>): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);
  
  try {
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
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Extract structured content from HTML
 */
function extractTextContent(html: string, config: Required<ScraperConfig>): { title: string; structuredContent: StructuredContent; wordCount: number } {
  const $ = cheerio.load(html);
  
  // Remove unwanted elements
  $('script, style, noscript, iframe, object, embed, meta, link').remove();
  $.root().contents().filter((_, node) => node.type === 'comment').remove();
  
  // Remove common boilerplate
  $('nav, .nav, #nav, .navigation, .navbar, header, .header, #header, footer, .footer, #footer').remove();
  $('.sidebar, #sidebar, .side-bar, .advertisement, .ad, .ads, .social-media, .share-buttons').remove();
  $('.breadcrumb, .breadcrumbs, .pagination, .pager, .related-posts, .related-articles').remove();
  
  // Extract title
  // Pragmatic Play Demo
  const title = $('title').text().trim() || $('h1').first().text().trim() || 'Untitled';
  
  // Extract headings (h1-h6)
  const headings: string[] = [];
  $('h1, h2, h3, h4, h5, h6').each((_, element) => {
    const text = $(element).text().  trim();
    if (text && text.length >= config.minContentLength) {
      headings.push(text.replace(/\s+/g, ' '));
    }
  });
  
  // Extract content from main content areas, excluding code snippets
  const content: string[] = [];
  const contentSelectors = [
    'main p',
    'article p',
    '.content p',
    '.post p',
    '#main p',
    '#content p',
    '.main-content p'
  ];
  
  for (const selector of contentSelectors) {
    $(selector).each((_, element) => {
      // Remove inline code elements
      $(element).find('code').remove();
      const text = $(element).text().trim();
      if (text && text.length >= config.minContentLength && !content.includes(text)) {
        content.push(text.replace(/\s+/g, ' '));
      }
    });
    if (content.length > 0) break;
  }
  
  // Fallback to body if no content found
  if (content.length === 0) {
    $('body p').each((_, element) => {
      $(element).find('code').remove();
      const text = $(element).text().trim();
      if (text && text.length >= config.minContentLength && !content.includes(text)) {
        content.push(text.replace(/\s+/g, ' '));
      }
    });
  }
  
  // Extract code snippets
  const codeSnippets: string[] = [];
  $('pre, code').each((_, element) => {
    // Only include code from pre or standalone code tags, not inline code within p
    if ($(element).parent().is('p')) return;
    const text = $(element).text().trim();
    if (text && text.length >= config.minContentLength && !codeSnippets.includes(text)) {
      codeSnippets.push(text.replace(/\s+/g, ' '));
    }
  });
  
  // Calculate total word count
  const allText = [...headings, ...content, ...codeSnippets].join(' ');
  const wordCount = allText.split(/\s+/).filter(word => word.length > 0).length;
  
  return {
    title,
    structuredContent: { headings, content, codeSnippets },
    wordCount
  };
}

/**
 * Find all internal links on a page
 */
function findInternalLinks(html: string, baseUrl: string): string[] {
  const $ = cheerio.load(html);
  const links = new Set<string>();
  
  $('a[href]').each((_, element) => {
    const href = $(element).attr('href');
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
  const links = findInternalLinks(html, url);
  
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
 * Main scraper function
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
  console.log(`Max pages: ${config.maxPages}, Max depth: ${config.maxDepth}`);
  
  // Update status to indicate scraping is in progress
  await prisma.scrappedStatus.update({
    where: { id: project.id },
    data: { success: 'working' }
  });
  
  let depth = 0;
  
  while (toVisit.size > 0 && pages.length < config.maxPages && depth < config.maxDepth) {
    const currentBatch = Array.from(toVisit);
    toVisit.clear();
    
    console.log(`Depth ${depth + 1}: Processing ${currentBatch.length} URLs`);
    
    for (const url of currentBatch) {
      if (visited.has(url) || pages.length >= config.maxPages) {
        continue;
      }
      
      visited.add(url);
      let isSuccess = false;
      
      try {
        console.log(`Scraping: ${url}`);
        
        const pageData = await scrapePage(url, config);
        pages.push(pageData);
        isSuccess = true;
        
        // Add new links to queue
        for (const link of pageData.links) {
          if (!visited.has(link) && !shouldExcludeUrl(link, config)) {
            toVisit.add(link);
          }
        }
        
        console.log(`✓ Scraped: ${pageData.title} (${pageData.wordCount} words)`);
        
        if (config.delay > 0) {
          await new Promise(resolve => setTimeout(resolve, config.delay));
        }
        
      } catch (error) {
        const errorMsg = `Failed to scrape ${url}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`✗ ${errorMsg}`);
        errors.push(errorMsg);
      }
      
      // Save each URL to database immediately
      try {
        await prisma.scrappedLinks.create({
          data: {
            urls: url,
            status: isSuccess,
            scrappedId: project.id
          }
        });
      } catch (dbError) {
        console.error(`Failed to save link to database: ${url}`, dbError);
      }
    }
    
    depth++;
  }

  const total_words = pages.reduce((sum, page) => sum + page.wordCount, 0);
  const finalStatus = errors.length === 0 ? 'success' : (pages.length > 0 ? 'success' : 'failed');
  
  // Update final scraping status
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
 * Get all unique URLs from scraping result
 */
export function getAllUrls(result: ScrapeResult): string[] {
  return result.pages.map(page => page.url);
}

/**
 * Get chunked content for vector database storage
 */
export function getChunkedContent(result: ScrapeResult): VectorChunk[] {
  const chunks: VectorChunk[] = [];
  
  for (const page of result.pages) {
    const { headings, content, codeSnippets } = page.structuredContent;
    const totalItems = Math.max(headings.length, content.length, codeSnippets.length);
    
    for (let i = 0; i < totalItems; i++) {
      const heading = headings[i] || '';
      const contentItem = content[i] || '';
      const codeItem = codeSnippets[i] || '';
      
      const chunkItems = heading || contentItem || codeItem ? [heading, contentItem, codeItem].filter(item => item) : [];
      if (chunkItems.length === 0) continue;
      
      let chunkType: VectorChunk['chunkType'];
      if (chunkItems.length === 3) {
        chunkType = 'heading_content_code';
      } else if (heading && contentItem) {
        chunkType = 'heading_content';
      } else if (contentItem) {
        chunkType = 'content';
      } else {
        chunkType = 'code';
      }
      
      const chunkContent = chunkItems.join('\n') + '\n';
      const wordCount = chunkContent.split(/\s+/).filter(word => word.length > 0).length;
      
      chunks.push({
        url: page.url,
        pageTitle: page.title,
        timestamp: page.timestamp.toISOString(),
        chunkType,
        content: chunkContent,
        wordCount
      });
    }
  }
  
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