'use client'

import ProjectCreationForm from '@/components/custom/Project/ProjectCreationForm'
import { Button } from '@/components/ui/button'
import { ProjectContext } from '@/context/ProjectContext'
import { projectFormSchema } from '@repo/common/type'
import Link from 'next/link'
import React, { useContext } from 'react'

const CreateProject = () => {

    const ctx = useContext(ProjectContext)
    if (!ctx) throw new Error("ProjectContext must be used inside ProjectProvider")
    
    const {SaveProject} = ctx;
    
  return (
    <div className='w-full'>
        <div className='w-full flex justify-between items-center mb-4'>
            <div>
                <h1 className='text-2xl font-bold'>Create Project</h1>
                <p className='text-gray-400'>Create a new project to get started</p>
            </div>
            <div className='flex gap-3'>
        <Link href='/dashboard/projects'>
            <Button variant="outline">
                Cancel
            </Button>
        </Link>
            <Button onClick={SaveProject} className='bg-primary text-primary-foreground hover:bg-primary/90'>
                Save
            </Button>
            </div>
        </div>
        <ProjectCreationForm />
    </div>
  )
}

export default CreateProject