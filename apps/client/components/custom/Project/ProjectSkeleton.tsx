import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

type Props = {}

const ProjectSkeleton = (props: Props) => {
  return (
    <Skeleton className='w-full h-[200px] rounded-xl bg-secondary' />
  )
}

export default ProjectSkeleton