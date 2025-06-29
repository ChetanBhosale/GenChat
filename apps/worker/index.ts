import dotenv from 'dotenv'
dotenv.config({path: '../../.env'})
import redis from '@repo/redis'
import { ai_config, project_type, system_config } from '@repo/common'
import { prisma } from '@repo/db'
import type { IScrapingSchema } from '@repo/common/type'
import { scrapeWebsite, getChunkedContent, type VectorChunk } from './service/scraper';
import { AIModel } from '@repo/ai'
import type { ServerlessSpecCloudEnum } from '@pinecone-database/pinecone';

// mainDeleteData()

// Utility function to update project status to failed
async function updateProjectStatusToFailed(projectId: string, error: any): Promise<void> {
  try {
    console.error(`❌ Updating project ${projectId} status to failed due to error:`, error);
    
    const project = await prisma.projects.findUnique({
      where: { id: projectId }
    });
    
    if (project) {
      await prisma.projects.update({
        where: { id: projectId },
        data: { 
          status: project_type.failed,
          retryCount: project.retryCount + 1
        }
      });
    }
  } catch (dbError) {
    console.error(`Failed to update project status for ${projectId}:`, dbError);
  }
}

// Utility function to update scraping status to failed
async function updateScrapingStatusToFailed(scrapingId: string, error: any): Promise<void> {
  try {
    console.error(`❌ Updating scraping status ${scrapingId} to failed due to error:`, error);
    
    await prisma.scrappedStatus.update({
      where: { id: scrapingId },
      data: { success: project_type.failed }
    });
  } catch (dbError) {
    console.error(`Failed to update scraping status for ${scrapingId}:`, dbError);
  }
}

async function checkIndexExists(indexName: string): Promise<void> {
  try {
    console.log(`Checking if index exists: ${indexName}`);
    
    let index = AIModel.pc.Index(indexName);
    if(!index){
      console.log(`Index ${indexName} does not exist, creating...`);
      
      await AIModel.pc.createIndex({
        name : indexName,
        vectorType: 'dense',
        dimension: 1536,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: ai_config.cloud as ServerlessSpecCloudEnum,
            region: ai_config.region as string
          }
        },
        deletionProtection: 'disabled'
      });
      
      console.log(`✅ Successfully created index: ${indexName}`);
    } else {
      console.log(`✅ Index ${indexName} already exists`);
    }
  } catch (error) {
    let newError = error as any;    
    console.error(`❌ Error checking/creating index ${indexName}:`, newError);
    throw new Error(`Failed to check/create index ${indexName}: ${newError.message}`);
  }
}

// Google embedding models processing
async function processVectorChunks(projectId: string, chunks: any[]): Promise<void> {
  console.log(`Started embedding process for project ${projectId}`);
  console.log({chunks})
  
  // try {
  //   let app_index = process.env.NODE_ENV === 'PRODUCTION' ? ai_config.prod_index : ai_config.dev_index;
  //   await checkIndexExists(app_index);
    
  //   let format = []
  //   let i=0;
    
  //   for(let chunk of chunks){
  //     try {
  //       console.log(`Processing chunk ${i + 1}/${chunks.length} for project ${projectId}`);
        
  //       // Create embedding
  //       let embedding = await AIModel.ai.models.embedContent({
  //         model: AIModel.model.embedding as string,
  //         contents: chunk.content
  //       });

  //       // Rate limiting delay
  //       await new Promise(resolve => setTimeout(resolve, 5000));
        
  //       if (!embedding.embeddings || !embedding.embeddings[0]) {
  //         console.warn(`⚠️ No embedding generated for chunk ${i} in project ${projectId}`);
  //         continue;
  //       }
        
  //       console.log(`✅ Successfully generated embedding for chunk ${i} of project ${projectId}`);

  //       format.push({
  //         id : `${projectId}-${i}`,
  //         values : embedding.embeddings[0].values,
  //         metadata : {
  //           projectId : projectId,
  //           chunkType : chunk.chunkType,
  //           wordCount : chunk.wordCount,
  //           url : chunk.url,
  //           pageTitle : chunk.pageTitle,
  //         }
  //       });
        
  //       i++;
  //     } catch (chunkError) {
  //       console.error(`❌ Error processing chunk ${i} for project ${projectId}:`, chunkError);
  //       // Continue with next chunk instead of failing entirely
  //       i++;
  //     }
  //   }
    
  //   if (format.length === 0) {
  //     throw new Error(`No embeddings were generated for project ${projectId}`);
  //   }
    
  //   // Upsert all embeddings
  //   await AIModel.pc.Index(app_index).upsert([...format]);
    
  //   console.log(`✅ Successfully processed ${format.length}/${chunks.length} vector chunks for project ${projectId}`);
    
  // } catch (error) {
  //   console.error(`❌ Error in processVectorChunks for project ${projectId}:`, error);
  //   await updateProjectStatusToFailed(projectId, error);
  //   throw error;
  // }
}

async function checkIfIndexExists(indexName: string): Promise<void> {
  try {
    console.log(`Checking if Pinecone index exists: ${indexName}`);
    
    const listIndexes = await AIModel.pc.listIndexes();
    console.log({listIndexes});
    
    // Check if index exists
    const indexExists = listIndexes.indexes?.some(index => index.name === indexName);
    
    if (indexExists) {
      console.log(`✅ Index ${indexName} already exists`);
      return;
    }
    
    // Create index if it doesn't exist
    console.log(`Index ${indexName} does not exist, creating...`);
    
    await AIModel.pc.createIndexForModel({
      name: indexName,
      cloud: 'aws',
      region: 'us-east-1',
      embed: {
        model: 'llama-text-embed-v2',
        fieldMap: { text: 'content' },
      },
      waitUntilReady: true,
    });
    
    console.log(`✅ Successfully created index: ${indexName}`);
    
  } catch (error) {
    let newError = error as any;
    console.error(`❌ Error checking/creating Pinecone index ${indexName}:`, newError);
    throw new Error(`Failed to check/create Pinecone index ${indexName}: ${newError.message}`);
  }
}

async function processVectorChunksWithPinecodeModels(projectId: string, chunks: any[]): Promise<void> {
  console.log({chunks})
  try {
    console.log(`Processing ${chunks.length} vector chunks with Pinecone models for project ${projectId}`);
    
    let indexName = process.env.NODE_ENV === 'PRODUCTION' ? ai_config.prod_index : ai_config.dev_index;
    let index = AIModel.pc.index(indexName).namespace(projectId);
    
    // Get index statistics before processing
    let stats = await index.describeIndexStats();
    console.log({stats}, `Index stats for project ${projectId} before processing`);
    
    // Upsert records
    let data = await index.upsertRecords(chunks);
    console.log({data}, `Upsert result for project ${projectId}`);
    
    // Get updated statistics
    let updatedStats = await index.describeIndexStats();
    console.log({updatedStats}, `Index stats for project ${projectId} after processing`);
    
    console.log(`✅ Successfully upserted ${chunks.length} vector chunks for project ${projectId}`);
    
  } catch (error) {
    console.error(`❌ Error in processVectorChunksWithPinecodeModels for project ${projectId}:`, error);
    await updateProjectStatusToFailed(projectId, error);
    throw error;
  }
}
async function startScrapping(scrapedData: IScrapingSchema, webUrl: string): Promise<void> {
  try {
    console.log(`Starting scraping for project: ${scrapedData.projectId}`);
    console.log('Index name:', process.env.NODE_ENV === 'PRODUCTION' ? ai_config.prod_index : ai_config.dev_index);
    console.log('Pinecone API Key configured:', !!process.env.PINECONE_API_KEY);
    
    // Scrape website
    const result = await scrapeWebsite(scrapedData, webUrl);
    
    // Check/create index
    await checkIfIndexExists(process.env.NODE_ENV === 'PRODUCTION' ? ai_config.prod_index : ai_config.dev_index);
    
    // Wait before processing
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Generate vector chunks
    const vectorChunks = getChunkedContent(result);
    console.log(`Generated ${vectorChunks.length} vector chunks for project ${scrapedData.projectId}`);
    
    if (vectorChunks.length === 0) {
      throw new Error(`No content chunks generated from scraping for project ${scrapedData.projectId}`);
    }
    
    // Process vector chunks
    await processVectorChunksWithPinecodeModels(scrapedData.projectId, vectorChunks);
    
    // Update project status to active
    await prisma.projects.update({
      where: { id: scrapedData.projectId },
      data: { 
        status: project_type.active,
        retryCount: 0 
      }
    });

    // Update scraping status to success
    await prisma.scrappedStatus.update({
      where: { id: scrapedData.id },
      data: { success: project_type.success, current: true }
    });

    console.log(`✅ Successfully completed scraping for project: ${scrapedData.projectId}`);
    
  } catch (error) {
    console.error(`❌ Error in scraping process for project ${scrapedData.projectId}:`, error);
    
    // Update scraping status to failed
    await updateScrapingStatusToFailed(scrapedData.id, error);
    
    // Update project status to failed
    await updateProjectStatusToFailed(scrapedData.projectId, error);
    
    throw error; 
  }
}

console.log('Worker started - Listening for scraping jobs...');

while (true) {
  try {
    const data = await redis.lpop(system_config.scrape_queue);
    // const data = "3613425f-cd6f-47fa-99b7-39cb2bd58c7f"
    
    if (data && data?.length > 0) {
      console.log(`Received job for project: ${data}`);
      
      try {
        const projectData = await prisma.projects.findFirst({
          where: { id: data }
        });

        if (!projectData) {
          throw new Error(`Project not found: ${data}`);
        }

        console.log(`Found project: ${projectData.projectName} - ${projectData.websiteUrl}`);

        // Check retry count
        // if(projectData.retryCount > 3){
        //   console.error(`❌ Project ${data} has exceeded maximum retry count (${projectData.retryCount})`);
        //   await updateProjectStatusToFailed(data, new Error('Maximum retry count exceeded'));
        //   continue;
        // }

        // Update project status to scraping
        await prisma.projects.update({
          where: { id: projectData.id },
          data: { status: project_type.scraping }
        });

        // Create scraping status record
        const scrappedData = await prisma.scrappedStatus.create({
          data: {
            projectId: projectData.id,
            success: project_type.scraping,
            pages: 0,  
            errors: 0,
            total_words: 0,
            current: false,
          }
        });

        console.log(`Created scraping status record: ${scrappedData.id}`);

        // Start scraping process
        await startScrapping(scrappedData, projectData.websiteUrl);

      } catch (error) {
        console.error(`❌ Error processing job for project ${data}:`, error);
        
        // Try to update project status to failed if we have the project ID
        if (data) {
          await updateProjectStatusToFailed(data, error);
        }
      }
    } else {
      console.log('No jobs in queue, waiting...');
    }
    
  } catch (error) {
    console.error('❌ Error in main worker loop:', error);
  }

  await new Promise(resolve => setTimeout(resolve, 4000));
}

// Fixed syntax error - removed extra comma
async function mainDeleteData(){
  try {
    await Promise.all([
      prisma.scrappedLinks.deleteMany(),
      prisma.scrappedStatus.deleteMany(),
      prisma.projects.deleteMany()
    ]);
    console.log('✅ Data deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting data:', error);
    throw error;
  }
}

