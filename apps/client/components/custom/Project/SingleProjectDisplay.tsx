import { Button } from '@/components/ui/button'
import { project_type, project_type_color, ProvideChatBotById } from '@repo/common'
import { IprojectSchema } from '@repo/common/type'
import { ArrowLeft, Activity, Globe, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import ProjectTryModule from './ProjectTryModule'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import ProjectAnalyticsCharts from './ProjectAnalyticsCharts'
import SingleProjectStats from './SingleProjectStats'
import SingleProjectConfiguration from './SingleProjectConfiguration'
import ProjectLogs from './ProjectLogs'

type Props = {
    project: IprojectSchema
}

const SingleProjectDisplay = ({project}: Props) => {
    console.log({project})
    // Get chatbot type information
    const chatbotType = ProvideChatBotById(project.chatBotType)
    
    // Format dates
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Generate fake analytics data
    const generateFakeAnalytics = () => {
        const last7Days = Array.from({length: 7}, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (6 - i))
            return {
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                conversations: Math.floor(Math.random() * 50) + 10,
                responses: Math.floor(Math.random() * 200) + 50,
                users: Math.floor(Math.random() * 30) + 5,
                responseTime: Math.floor(Math.random() * 500) + 100
            }
        })
        return last7Days
    }

    // Generate hourly usage data
    const generateHourlyData = () => {
        return Array.from({length: 24}, (_, i) => ({
            hour: `${i.toString().padStart(2, '0')}:00`,
            usage: Math.floor(Math.random() * 100) + 10
        }))
    }

    // Generate response type data
    const generateResponseTypeData = () => {
        return [
            { name: 'Success', value: 85, color: '#10b981' },
            { name: 'Partial', value: 12, color: '#f59e0b' },
            { name: 'Failed', value: 3, color: '#ef4444' }
        ]
    }

    const analyticsData = generateFakeAnalytics()
    const hourlyData = generateHourlyData()
    const responseTypeData = generateResponseTypeData()
    // Generate fake logs
    const generateFakeLogs = () => {
        const logTypes = ['info', 'success', 'warning', 'error']
        const activities = [
            'User started conversation',
            'AI response generated successfully',
            'Knowledge base updated',
            'User provided feedback',
            'Website scraping completed',
            'Error in response generation',
            'New user registered',
            'Chatbot settings updated',
            'High response time detected',
            'User session ended',
            'Integration webhook triggered',
            'Database query executed'
    ]
        
        return Array.from({length: 50}, (_, i) => {
            const date = new Date()
            date.setMinutes(date.getMinutes() - (i * Math.floor(Math.random() * 30) + 5))
            return {
                id: i + 1,
                type: logTypes[Math.floor(Math.random() * logTypes.length)],
                activity: activities[Math.floor(Math.random() * activities.length)],
                timestamp: date,
                user: `user_${Math.floor(Math.random() * 1000)}`,
                details: `Session ${Math.floor(Math.random() * 10000)}`
            }
        })
    }

    const logs = generateFakeLogs()

    const getLogIcon = (type: string) => {
        switch(type) {
            case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
            case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />
            default: return <Activity className="w-4 h-4 text-blue-500" />
        }
    }

    const getLogBgColor = (type: string) => {
        switch(type) {
            case 'success': return 'bg-green-500/10 border-green-500/20'
            case 'warning': return 'bg-yellow-500/10 border-yellow-500/20'
            case 'error': return 'bg-red-500/10 border-red-500/20'
            default: return 'bg-blue-500/10 border-blue-500/20'
        }
    }

    return (
        <div className='w-full space-y-8'>
            {/* Header Section */}
            <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                    <div className='flex items-center gap-3'>
                        <h1 className='text-3xl font-bold text-foreground'>{project.projectName}</h1>
                        <div className={`px-3 py-1 rounded-full border text-xs font-medium ${project_type_color[project.status as keyof typeof project_type_color] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                            {project.status?.toUpperCase()}
                        </div>
                    </div>
                    <p className='text-muted-foreground max-w-2xl'>{project.projectDescription}</p>
                    <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                        <div className='flex items-center gap-1'>
                            <Globe className='w-4 h-4' />
                            <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className='hover:text-foreground transition-colors'>
                                {project.websiteUrl}
                            </a>
                        </div>
                        <div className='flex items-center gap-1'>
                            <Clock className='w-4 h-4' />
                            Created {formatDate(project.createdAt)}
                        </div>
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    <Link href='/dashboard/projects'>
                        <Button variant='outline' size='sm' className='gap-2'>
                            <ArrowLeft className='w-4 h-4' />
                            Back
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <SingleProjectStats />

            {/* Charts Component */}
            <ProjectAnalyticsCharts 
                analyticsData={analyticsData}
                hourlyData={hourlyData}
                responseTypeData={responseTypeData}
            />

            {/* Project Details Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Project Information */}
                <SingleProjectConfiguration projectData={JSON.stringify(project)} />

                {/* Sidebar */}
                <div className='space-y-6 '>
                    {/* Project Status */}
                    <div className='bg-card border h-full  border-border rounded-lg p-6'>
                        <h3 className='text-lg font-semibold mb-4'>Project Status</h3>
                        <div className='space-y-3'>
                            <div className='flex justify-between items-center'>
                                <span className='text-sm text-muted-foreground'>Status</span>
                                <Badge className={project_type_color[project.status as keyof typeof project_type_color] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                                    {project.status}
                                </Badge>
                            </div>
                            <Separator />
                            <div className='flex justify-between items-center'>
                                <span className='text-sm text-muted-foreground'>Paused</span>
                                <span className='text-sm'>{project.isPaused ? 'Yes' : 'No'}</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-sm text-muted-foreground'>Retry Count</span>
                                <span className='text-sm'>{project.retryCount > 3 ? 'Max' : project.retryCount}</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-sm text-muted-foreground'>Last Updated</span>
                                <span className='text-sm'>{formatDate(project.updatedAt)}</span>
                            </div>
                            <div className='mt-4 text-xs text-yellow-500'>
                                <p>Max retry count is 3, if you exceed it, you will not be able to scrape again.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <ProjectLogs projectId={project.id} />
        </div>
    )
}

export default SingleProjectDisplay