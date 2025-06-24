'use client'

import BreadcrumbProvider from "@/components/custom/sidebar/breadcrumb"
import SidebarDashboard from "@/components/custom/sidebar/Sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const DashboardProvider = ({children}: {children: React.ReactNode}) => {
  
  return (
    <div className="w-full min-h-screen">
        <SidebarProvider>
            <SidebarDashboard />
            <main className="w-full">
                <div className="flex items-center text-md my-2">
                <SidebarTrigger />
                <BreadcrumbProvider />
                </div>
                {children}
            </main>
        </SidebarProvider>
    </div>
  )
}

export default DashboardProvider