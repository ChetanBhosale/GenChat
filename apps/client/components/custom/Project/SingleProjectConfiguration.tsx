'use client'

import { ProvideChatBotById } from '@repo/common'
import { IprojectSchema, projectFormSchema } from '@repo/common/type'
import React, { useContext, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Save, X } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import ProjectTryModule from './ProjectTryModule'
import { ProjectContext } from '@/context/ProjectContext'
import { Input } from '@/components/ui/input'
import { IReturn } from '@/common/action.return'

type Props = {}

const SingleProjectConfiguration = ({projectData}:{projectData:string}) => {
    let [project,setProject] = useState<IprojectSchema>({
        ...JSON.parse(projectData),
    })
    let [updatedProject,setUpdatedProject] = useState<IprojectSchema>({
        ...JSON.parse(projectData),
    })
    const [edit,setEdit] = useState(false)

    const ctx = useContext(ProjectContext)
    if (!ctx) throw new Error("ProjectContext must be used inside ProjectProvider")
 
 const { error, loading, updateProject } = ctx

    function handleInputChange(field: keyof IprojectSchema, value: string) {
        console.log({field, value})
        setUpdatedProject(prev=>({
            ...prev,
            [field]:value
        }))
    }

  return (
    <div className='lg:col-span-2 space-y-6'>
    {/* Chatbot Configuration */}
    <div className='bg-card border border-bo    rder rounded-lg p-6'>
        <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                {ProvideChatBotById(project.chatBotType).name}
                Chatbot Configuration
            </h3>
            {edit ? (
            <div className=' flex items-center gap-2'>
                    {/* <Input type='text' value={updatedProject.projectName} onChange={(e:any)=>handleInputChange('projectName',e.target.value)} /> */}
                    <Button disabled={loading} variant='outline' size='sm' className='gap-2' onClick={async () => {
                        if(updatedProject){
                            let data : IReturn = await updateProject(project.id,updatedProject as projectFormSchema)
                            if(data.success){
                                setEdit(false)
                                setProject(data.data as IprojectSchema)
                                setUpdatedProject(data.data as IprojectSchema)
                            }
                        }
                    }}>
                        <Save className='w-4 h-4' />
                        Save
                    </Button>
                    <Button disabled={loading} variant='outline' size='sm' className='gap-2' onClick={()=>setEdit(false)}>
                        <X className='w-4 h-4' />
                        Cancel
                    </Button>
            </div>
        ) : (
            <Button variant='outline' size='sm' className='gap-2' onClick={()=>{
                setEdit(true)
                setUpdatedProject(project)
            }}>
                <Edit className='w-4 h-4' />
                Edit
            </Button>
        )}
        </div>
        
        <div className='space-y-4'>
        <ProjectTryModule buildProject={JSON.stringify(project)} />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                    <label className='text-sm font-medium text-muted-foreground'>Chatbot Name</label>
                    <Input type='text' disabled={!edit} value={edit ? updatedProject.chatbotName || '' : project.chatbotName || ''} onChange={(e:any)=>handleInputChange('chatbotName',e.target.value)} />
                </div>
                <div>
                    <label className='text-sm font-medium text-muted-foreground'>Type</label>
                    <div className='flex items-center gap-2'>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${ProvideChatBotById(project.chatBotType).color}`}>
                            {ProvideChatBotById(project.chatBotType).name}
                        </span>
                        {
                            error.chatbotName && (
                                <p className='text-sm text-red-500'>{error.chatbotName}</p>
                            )
                        }
                    </div>
                </div>
                <div>
                    <label className='text-sm font-medium text-muted-foreground'>Support Email</label>
                    <Input type='text' disabled={!edit} value={edit ? updatedProject.supportEmail || '' : project.supportEmail || ''} onChange={(e:any)=>handleInputChange('supportEmail',e.target.value)} />
                    {
                        error.supportEmail && (
                            <p className='text-sm text-red-500'>{error.supportEmail}</p>
                        )
                    }
                </div>
                <div>
                <label className='text-sm font-medium text-muted-foreground'>Welcome Message</label>
                <Input type='text' disabled={!edit} value={edit ? updatedProject.welcomeMessage || '' : project.welcomeMessage || ''} onChange={(e:any)=>handleInputChange('welcomeMessage',e.target.value)} />
                {
                    error.welcomeMessage && (
                        <p className='text-sm text-red-500'>{error.welcomeMessage}</p>
                    )
                }
            </div>
            </div>
            <div>
                    <label className='text-sm font-medium text-muted-foreground'>Project Description</label>
                    <textarea className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50' disabled={!edit} value={edit ? updatedProject.projectDescription || '' : project.projectDescription || ''} onChange={(e:any)=>handleInputChange('projectDescription',e.target.value)} />
                    {
                        error.projectDescription && (
                            <p className='text-sm text-red-500'>{error.projectDescription}</p>
                        )
                    }
                </div>
        </div>
    </div>
</div>
  )
}

export default SingleProjectConfiguration