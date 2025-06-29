'use server'

import { ActionReturn } from "@/common/action.return"
import { auth } from "@clerk/nextjs/server"
import { project_type, system_config } from "@repo/common"
import { projectFormSchema, projectFormZodSchema } from "@repo/common/type"
import { prisma } from '@repo/db'
import { redirect } from "next/navigation"
import { ZodError } from 'zod'
import redis from '@repo/redis'

export const CreateProjectAction = async (details: projectFormSchema) => {
  try {
    projectFormZodSchema.parse(details)


     const { userId } = await auth()
     if(!userId){
         ActionReturn(false,'Please login, before creating project')
        redirect('/sign-in')
     }

     // add validations here first 

     const projectExists = await prisma.projects.findFirst({
        where : { 
            websiteUrl : details?.websiteUrl
        }
     })


     if(projectExists){
        return ActionReturn(false,'Project url already exists')
     }

     // check if project name is already taken
     const projectNameExists = await prisma.projects.findFirst({
        where : {
            projectName : {
                equals : details?.projectName,
                mode : 'insensitive'
            },
            userId : userId
        }
     })
     

     if(projectNameExists){
        return ActionReturn(false,'Project name already exists, please choose a different name!')
     }

     const createProject = await prisma.projects.create({
        data : {
            userId,
            status : project_type.pending,
        ...details
        }
     })

     if(!createProject){
        return ActionReturn(
            false,
            'Creating Project Failed!',
            {}
        )
     }else{
       let data =  await redis.lpush(system_config.scrape_queue, createProject.id)
       console.log({data})
    }

     return ActionReturn(true,'Project Created Successfully',true)

    // return ActionReturn(true, 'Project created successfully',data)
  } catch (error) {

    if (error instanceof ZodError) {
      const messages = error.errors.map(err => err.message).join(', ')
      return ActionReturn(false, messages)
    }

    // Handle other errors (e.g., DB failure)
    console.log({ error })
    return ActionReturn(false, 'Something went wrong')
  }
}


export const getUserProjects = async() => {
   try {
    const { userId } = await auth()

    if(!userId){
        redirect('/sign-in')
    }
    
        const projects = await prisma.projects.findMany({
            where : {
                userId : userId
            }
        })

        if(!projects){
             return ActionReturn(true,'failed to fetch user projects!', projects)
        }

        return ActionReturn(true,'user projects fetched successfully!', projects)

    } catch (error) {
        return ActionReturn(false,'Something went wrong, please try again later!')
    }
}

export const getSingleProject = async(projectName: string) => {
    try {
        const { userId } = await auth()

        if(!userId){
            redirect('/sign-in')
        }

        const project = await prisma.projects.findFirst({
          where : {
            projectName : {
                equals : projectName,
                mode : 'insensitive'
            },
            userId : userId
          }
        })

        if(!project){
          return ActionReturn(false,'Project not found!')
        }

        return ActionReturn(true,'Project fetched successfully!', project)

    } catch (error) {
        return ActionReturn(false,'Something went wrong, please try again later!')
    }
}

export const handleScrapingAgain = async(projectId: string) => {
    try {
        const { userId } = await auth()

        if(!userId){
            redirect('/sign-in')
        }

        let validate = await prisma.projects.findFirst({
            where : {
                id : projectId,
                userId : userId,
            }
        })

        if(!validate){
            return ActionReturn(false,'Project not found!')
        }

        await redis.lpush(system_config.scrape_queue, validate.id)

        return ActionReturn(true,'Project added to queue!',true)
        
    } catch (error) {
        return ActionReturn(false,'Something went wrong, please try again later!')
    }
}

export const UpdateProjectAction = async(projectId:string,projectData:projectFormSchema) => {
    try {
        const { userId } = await auth()

        const parseData = projectFormZodSchema.parse(projectData)
        console.log({parseData})

        if(!userId){
            redirect('/sign-in')
        }

        const project = await prisma.projects.update({
            where : {
                id : projectId,
                userId : userId
            },
            data : projectData
        })

        if(!project){
            return ActionReturn(false,'Project not found!')
        }

        return ActionReturn(true,'Project updated successfully!',project)

    } catch (error) {
        return ActionReturn(false,'Something went wrong, please try again later!')
    }
}

export const getProjectLogs = async(projectId:string) => {
try {
  const {userId} = await auth()

  if(!userId){
    redirect('/sign-in')
  }

  const project = await prisma.scrappedStatus.findMany({
    where : {
      projectId : projectId,
    },
    include : {
      scrappedLinks : true,
    },
    orderBy : { 
      createdAt : 'desc'
    }
  })

  if(!project){
    return ActionReturn(false,'Project not found!')
  }

  return ActionReturn(true,'Project logs fetched successfully!',project)

} catch (error) {
  return ActionReturn(false,'Something went wrong, please try again later!',error)
}
}