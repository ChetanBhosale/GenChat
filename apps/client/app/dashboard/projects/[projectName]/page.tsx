import { getSingleProject } from '@/app/actions/project'
import SingleProjectDisplay from '@/components/custom/Project/SingleProjectDisplay'
import { Button } from '@/components/ui/button'
import { IprojectSchema } from '@repo/common/type'
import { ArrowLeft } from 'lucide-react'
import React from 'react'

type Props = {
    params: {
        projectName: string
    }
}

const SingleProject = async ({
    params
}: Props) => {

  const {projectName} = params

  const project =await getSingleProject(projectName)
  if(!project?.success){
    return <div>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>{projectName}</h1> 
        <p className='text-sm text-muted-foreground'>{project?.message}</p>
      </div>
    </div>
  }

  return (
    <div className='w-full space-y-6 px-6 py-2'>
     <SingleProjectDisplay project={project?.data as IprojectSchema} />
    </div>
  )
}

export default SingleProject