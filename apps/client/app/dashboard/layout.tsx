import React from 'react'
import DashboardProvider from './provider'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'


const DashbordLayout = async ({children}: {children: React.ReactNode}) => {
    const user = await currentUser()
    if(!user){
        redirect('/sign-in')
    }
  return (
    <DashboardProvider>
        {children}
    </DashboardProvider>
  )
}

export default DashbordLayout