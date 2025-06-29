import { MessageSquare, TrendingUp, Users, Clock } from 'lucide-react'
import React from 'react'


const SingleProjectStats = () => {
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
    
    const totalConversations = analyticsData.reduce((sum, day) => sum + day.conversations, 0)
    const totalResponses = analyticsData.reduce((sum, day) => sum + day.responses, 0)
    const totalUsers = analyticsData.reduce((sum, day) => sum + day.users, 0)
    const avgResponseTime = Math.round(analyticsData.reduce((sum, day) => sum + day.responseTime, 0) / analyticsData.length)

  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                <div className='bg-card border border-border rounded-lg p-6 space-y-2 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center justify-between'>
                        <div className='text-sm font-medium text-muted-foreground'>Total Conversations</div>
                        <MessageSquare className='w-4 h-4 text-muted-foreground' />
                    </div>
                    <div className='text-2xl font-bold'>{totalConversations.toLocaleString()}</div>
                    <div className='text-xs text-green-600'>+12% from last week</div>
                </div>

                <div className='bg-card border border-border rounded-lg p-6 space-y-2 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center justify-between'>
                        <div className='text-sm font-medium text-muted-foreground'>AI Responses</div>
                        <TrendingUp className='w-4 h-4 text-muted-foreground' />
                    </div>
                    <div className='text-2xl font-bold'>{totalResponses.toLocaleString()}</div>
                    <div className='text-xs text-green-600'>+8% from last week</div>
                </div>

                <div className='bg-card border border-border rounded-lg p-6 space-y-2 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center justify-between'>
                        <div className='text-sm font-medium text-muted-foreground'>Active Users</div>
                        <Users className='w-4 h-4 text-muted-foreground' />
                    </div>
                    <div className='text-2xl font-bold'>{totalUsers.toLocaleString()}</div>
                    <div className='text-xs text-blue-600'>+15% from last week</div>
                </div>

                <div className='bg-card border border-border rounded-lg p-6 space-y-2 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center justify-between'>
                        <div className='text-sm font-medium text-muted-foreground'>Avg Response Time</div>
                        <Clock className='w-4 h-4 text-muted-foreground' />
                    </div>
                    <div className='text-2xl font-bold'>{avgResponseTime}ms</div>
                    <div className='text-xs text-green-600'>-5ms from last week</div>
                </div>
            </div>
  )
}

export default SingleProjectStats