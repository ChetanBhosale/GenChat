import { z } from "zod";
import { success } from "zod/v4";

// model Projects {
//     id String @id @default(uuid())
//     userId String 
//     projectName String
//     chatBotName String
//     websiteUrl String
//     projectDescription String?
//     welcomeMessage String?
//     avatarImage String?
//     chatBotType String?  // id will be store here =>  1: Documentation Chatbot, 2: Lead Generator, 3: General Assistant
//     supportEmail String?
//     supportContact String?
//     isPaused Boolean @default(false)
//     status String? // active, paused, deleted, scraping
//     retryCount Int @default(0)
  
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
  
//     @@index([userId])
//     @@index([websiteUrl])
//     @@index([chatBotType])
//   }


export interface IprojectSchema {
    id : string,
    userId : string,
    projectName : string,
    chatBotName : string,
    websiteUrl : string,
    projectDescription : string,
    welcomeMessage : string,
    avatarImage : string,
    chatBotType : string,
    supportEmail : string | null,
    supportContact : string | null,
    isPaused : boolean,
    status : string,
    retryCount : number,
    createdAt : Date,
    updatedAt : Date,
}

export const projectFormZodSchema = z.object({
    projectName : z.string().min(1, {message : "Project name is required"}),
    chatbotName : z.string().min(1, {message : "Chatbot name is required"}),
    websiteUrl : z.string().min(1, {message : "Website URL is required"}),
    projectDescription : z.string().min(1, {message : "Project description is required"}),
    welcomeMessage : z.string().min(1),
    chatBotType : z.string().min(1),
    supportEmail : z.string().optional()
})

export type projectFormSchema = z.infer<typeof projectFormZodSchema>


// model ScrappedStatus {
//   id String @id @default(uuid())
//   projects Projects @relation(fields: [projectId], references: [id])
//   projectId String
//   success String? // success, working, failed
//   scrappedLinks ScrappedLinks[]
//   pages Int
//   errors Int
//   total_words Int
//   current Boolean // currently used data or not  

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }


export const scrapingSchemaZod = z.object({
    id : z.string(),
    projectId : z.string(),
    success : z.string(),
    pages : z.number(),
    errors : z.number(),
    total_words : z.number(),
    current : z.boolean(),

    createdAt : z.date(),
    updatedAt : z.date()
})

export type IScrapingSchema = z.infer<typeof scrapingSchemaZod>


