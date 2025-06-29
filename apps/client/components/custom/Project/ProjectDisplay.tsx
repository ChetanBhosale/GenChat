'use client'
import { ProjectContext } from '@/context/ProjectContext'
import { IprojectSchema } from '@repo/common/type'
import React, { Fragment, useContext } from 'react'
import CreateNewProjectScreen from './CreateNewProjectScreen'
import { Bot, ExternalLink, Activity, Calendar, Forward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { project_type_color, ProvideChatBotById } from '@repo/common'
import Link from 'next/link'
import ProjectSkeleton from './ProjectSkeleton'
import { useRouter } from 'next/navigation'
// import { statusConfig } from '@/config/project-status'

type Props = {}

const ProjectDisplay = (props: Props) => {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error("ProjectContext must be used inside ProjectProvider")
  const { filterProjects } = ctx;
  const router = useRouter()

  return (
    <Fragment>
      {
        filterProjects == null ? Array.from({length: 6}).map((_,index) => <ProjectSkeleton key={index} />) : filterProjects?.length == 0 ? <CreateNewProjectScreen /> : <>
        {
            filterProjects?.map((project: IprojectSchema, index) => (
              <div key={index} className='bg-card h-full rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-200'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center'>
                      <Bot className='w-6 h-6 text-primary' />
                    </div>
                    <div>
                      <h3 className='text-lg font-semibold text-card-foreground'>{project.projectName}</h3>
                      <p className='text-sm text-muted-foreground'>{project.projectDescription.slice(0, 20)}...</p>
                    </div>
                  </div>
                  <div className='relative'>
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/projects/${project.projectName}`)}>
                      <Forward className='w-4 h-4' />
                      View
                    </Button>
                  </div>
                </div>

                <div className='space-y-3 mb-4'>
                  <div className='flex items-center gap-2'>
                    <ExternalLink className='w-4 h-4 text-muted-foreground' />
                    <Link href={project.websiteUrl} target='_blank' className='text-sm hover:text-foreground text-muted-foreground'>{project.websiteUrl}</Link>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${ProvideChatBotById(project.chatBotType).color}`}>
                      {ProvideChatBotById(project.chatBotType).name}
                    </span>
                    <Badge className={project_type_color[project.status as keyof typeof project_type_color]}>
                      {/* {statusConfig[project.status as keyof typeof statusConfig].icon} */}
                      <span className='ml-1 capitalize'>{project.status}</span>
                    </Badge>
                  </div>
                </div>

                {/* <div className='grid grid-cols-3 gap-4 mb-4 p-3 bg-background rounded-lg border border-border'>
                  <div className='text-center'>
                    <p className='text-lg font-bold text-card-foreground'>{project.messages}</p>
                    <p className='text-xs text-muted-foreground'>Messages</p>
                  </div>
                  <div className='text-center'>
                    <p className='text-lg font-bold text-card-foreground'>{project.users}</p>
                    <p className='text-xs text-muted-foreground'>Users</p>
                  </div>
                  <div className='text-center'>
                    <p className='text-lg font-bold text-card-foreground'>{project.performance}%</p>
                    <p className='text-xs text-muted-foreground'>Performance</p>
                  </div>
                </div>
*/}
                <div className='flex items-center justify-between text-sm text-muted-foreground mb-4'>
                  <span className='flex items-center gap-1'>
                    <Activity className='w-3 h-3' />
                    Last active: {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                  <span className='flex items-center gap-1'>
                    <Calendar className='w-3 h-3' />
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div> 
              </div>
            ))
          }
        </>
      }
    </Fragment>
  )
}

export default ProjectDisplay
