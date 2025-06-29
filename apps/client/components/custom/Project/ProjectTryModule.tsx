'use client'
import { project_type, project_type_color, ProvideChatBotById } from '@repo/common'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { IprojectSchema } from '@repo/common/type'
import { IReturn } from '@/common/action.return'
import { handleScrapingAgain } from '@/app/actions/project'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'


const ProjectTryModule = ({buildProject}:{buildProject:string}) => {
  const [project,setProject] = useState<IprojectSchema>({
    ...JSON.parse(buildProject),
  })
  const [loading,setLoading] = useState(false)

  const handleScrapingFunction = async (projectId: string) => {
    setLoading(true)
    const response : IReturn = await handleScrapingAgain(projectId)
    if(response.success){
      toast.success(response.message)
      let newProject = project;
      newProject.status = project_type.scraping
      setProject({...newProject})
    }else{
      toast.error(response.message)
      let newProject = project;
      newProject.status = project_type.failed
      setProject({...newProject})
    }
    setLoading(false)
  }
  return (
    <div>
         <div className='flex items-center gap-2 mb-4'>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${ProvideChatBotById(project.chatBotType).color}`}>
                      {ProvideChatBotById(project.chatBotType).name}
                    </span>
                    <Badge className={project_type_color[project.status as keyof typeof project_type_color]}>
                      {/* {statusConfig[project.status as keyof typeof statusConfig].icon} */}
                      <span className='ml-1 capitalize'>{project.status}</span>
                    </Badge>    
                   
   
    {
        project_type.failed === project.status && (
            <Button size="sm" disabled={loading} className='bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 hover:text-red-500' onClick={() => handleScrapingFunction(project.id)} >
                Try again
            </Button>
        )
    }
    {
        project_type.active === project.status && (
            <Button size="sm" disabled={loading} className='bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30 hover:text-blue-500' onClick={() => handleScrapingFunction(project.id)} >
                Scrape Again
            </Button>
        )
    }
    
      </div>
      {
        project_type.scraping == project.status && <p className='text-xs text-muted-foreground mt-1 ml-2'>Estimated time for scraping would be around 10 minutes</p>
      }
    </div>
   
  )
}

export default ProjectTryModule