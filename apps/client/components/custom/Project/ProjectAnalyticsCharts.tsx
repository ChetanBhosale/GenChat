'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface AnalyticsData {
    date: string
    conversations: number
    responses: number
    users: number
    responseTime: number
}

interface HourlyData {
    hour: string
    usage: number
}

interface ResponseTypeData {
    name: string
    value: number
    color: string
}

interface ProjectAnalyticsChartsProps {
    analyticsData: AnalyticsData[]
    hourlyData: HourlyData[]
    responseTypeData: ResponseTypeData[]
}

const ProjectAnalyticsCharts = ({ analyticsData, hourlyData, responseTypeData }: ProjectAnalyticsChartsProps) => {
    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-medium">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <>

            {/* Hourly Usage Chart */}
            <div className='bg-card border border-border rounded-lg p-6'>
                <h3 className='text-lg font-semibold mb-4'>Hourly Usage Pattern</h3>
                <div className='h-64'>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={hourlyData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="hour" className="text-xs fill-muted-foreground" />
                            <YAxis className="text-xs fill-muted-foreground" />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="usage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    )
}

export default ProjectAnalyticsCharts 