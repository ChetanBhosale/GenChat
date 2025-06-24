import { AirVent, ChartGanttIcon } from 'lucide-react'
import React from 'react'

type Props = {}

const Logo = (props: Props) => {
  return (
    <div className='flex items-center gap-2 cursor-pointer'>
      <AirVent className='w-5 h-5' /> 
      <h1 className='text-xl font-extrabold text-foreground'>Finix</h1>
    </div>
  )
}

export default Logo