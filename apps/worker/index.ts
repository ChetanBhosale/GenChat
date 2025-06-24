import redis from '@repo/redis'
import { project_type, system_config } from '@repo/common'
import { prisma } from '@repo/db'
import type { IScrapingSchema } from '@repo/common/type'
import { scrapeWebsite, getChunkedContent } from './service/scraper';

import { AIModel } from '@repo/ai'

// async function processVectorChunks(projectId: string, chunks: any[]): Promise<void> {
//   for(let chunk of chunks){
//     console.log(chunk);
//   }
//   console.log(`Processing ${chunks.length} vector chunks for project ${projectId}`);
//   console.log('Vector chunk processing completed (placeholder)');
// }

// async function startScrapping(scrapedData: IScrapingSchema, webUrl: string): Promise<void> {
//   try {
//     console.log(`Starting scraping for project: ${scrapedData.projectId}`);
    
//     const result = await scrapeWebsite(scrapedData, webUrl);
    
//     const vectorChunks = getChunkedContent(result);
//     console.log(`Generated ${vectorChunks.length} vector chunks`);
    
//      await processVectorChunks(scrapedData.projectId, vectorChunks);
    
//     await prisma.projects.update({
//       where: { id: scrapedData.projectId },
//       data: { 
//         status: project_type.active,
//         retryCount: 0 
//       }
//     });

//     await prisma.scrappedStatus.update({
//       where: { id: scrapedData.id },
//       data: { success: project_type.success, current: true }
//     });


//     console.log(`✅ Successfully completed scraping for project: ${scrapedData.projectId}`);
    
//   } catch (error) {
//     console.error(`❌ Error in scraping process:`, error);
    
//     await prisma.scrappedStatus.update({
//       where: { id: scrapedData.id },
//       data: { success: project_type.failed }
//     });
    
//     const project = await prisma.projects.findUnique({
//       where: { id: scrapedData.projectId }
//     });
    
//     if (project) {
//       await prisma.projects.update({
//         where: { id: scrapedData.projectId },
//         data: { 
//           status: project_type.failed,
//           retryCount: project.retryCount + 1
//         }
//       });
//     }
    
//     throw error; 
//   }
// }

console.log('Worker started - Listening for scraping jobs...');

// while (true) {
//   try {
//     const data = await redis.lpop(system_config.scrape_queue);
    
//     if (data && data?.length > 0) {
//       console.log(`Received job for project: ${data}`);
      
//       try {
//         const projectData = await prisma.projects.findFirst({
//           where: { id: data }
//         });

//         if (!projectData) {
//           throw new Error(`Project not found: ${data}`);
//         }

//         console.log(`Found project: ${projectData.projectName} - ${projectData.websiteUrl}`);

//         if(projectData.retryCount > 3){
//           throw new Error(`Project failed after 3 retries: ${data}, please create a new project`);
//         }

//         await prisma.projects.update({
//           where: { id: projectData.id },
//           data: { status: project_type.scraping }
//         });

//         const scrappedData = await prisma.scrappedStatus.create({
//           data: {
//             projectId: projectData.id,
//             success: project_type.scraping,
//             pages: 0,  
//             errors: 0,
//             total_words: 0,
//             current: false,
//           }
//         });

//         console.log(`Created scraping status record: ${scrappedData.id}`);

//         await startScrapping(scrappedData, projectData.websiteUrl);

//       } catch (error) {
//         console.error(`Error processing job for project ${data}:`, error);
//       }
//     } else {
//       console.log('No jobs in queue, waiting...');
//     }
    
//   } catch (error) {
//     console.error('Error in main worker loop:', error);
//   }

//   await new Promise(resolve => setTimeout(resolve, 4000));
// }


async function main(){
  console.log(AIModel.model);
  // const data = await AIModel.ai.models.generateContent({
  //   model: AIModel.model.chat as string,
  //   contents: "Hello, how are you?",
  // })

  // console.log(data);
}

main();