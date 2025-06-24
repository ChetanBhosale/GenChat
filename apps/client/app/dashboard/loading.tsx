import { Loader2 } from 'lucide-react'
import React from 'react'

const DashboardLoading = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
        <Loader2 className='animate-spin text-primary' /> 
    </div>
  )
}

export default DashboardLoading