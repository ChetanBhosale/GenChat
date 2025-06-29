'use client'
import { getProjectLogs } from '@/app/actions/project'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, Globe, FileText, AlertTriangle, RefreshCw } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface ScrappedLink {
    id: string
    urls: string
    status: boolean
    scrappedId: string
}

interface LogEntry {
    id: string
    projectId: string
    success: string
    pages: number
    errors: number
    total_words: number
    current: boolean
    createdAt: Date
    updatedAt: Date
    scrappedLinks: ScrappedLink[]
}

const ProjectLogs = ({projectId}:{projectId:string}) => {
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
    
        const fetchLogs = async () => {
            try {
                const response = await getProjectLogs(projectId);
                if (response.success) {
                    setLogs(response.data);
                    setError(null);
                } else {
                    setError(response.message as string || 'Failed to fetch logs');
                }
            } catch (err) {
                setError('An error occurred while fetching logs');
            } finally {
                setLoading(false);
            }
        };
    
        // Initial fetch
        fetchLogs();
    
        
        intervalId = setInterval(() => {
            console.log('fetching logs')
            fetchLogs();
        }, 5000);
    
        // Cleanup on unmount
        return () => {
            clearInterval(intervalId);
        };
    }, [projectId]);
    

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusBadge = (status: string) => {
        switch(status.toLowerCase()) {
            case 'success':
                return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Success</Badge>
            case 'working':
                return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Working</Badge>
            case 'failed':
                return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>
            default:
                return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>
        }
    }

    const getStatusIcon = (status: string) => {
        switch(status.toLowerCase()) {
            case 'success':
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'working':
                return <Clock className="w-4 h-4 text-blue-500" />
            case 'failed':
                return <XCircle className="w-4 h-4 text-red-500" />
            default:
                return <AlertTriangle className="w-4 h-4 text-gray-500" />
        }
    }

    const currentLog = logs.find(log => log.current)
    const totalPages = currentLog?.pages || 0
    const totalWords = currentLog?.total_words || 0
    const totalErrors = currentLog?.errors || 0
    const successfulLinks = currentLog?.scrappedLinks.filter(link => link.status).length || 0
    const failedLinks = currentLog?.scrappedLinks.filter(link => !link.status).length || 0

    if (loading) {
        return (
            <div className='bg-card border border-border rounded-lg p-6'>
                <div className='flex items-center justify-center h-64'>
                    <RefreshCw className='w-8 h-8 animate-spin text-muted-foreground' />
                    <span className='ml-2 text-muted-foreground'>Loading logs...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='bg-card border border-border rounded-lg p-6'>
                <div className='flex items-center justify-center h-64 text-red-500'>
                    <AlertTriangle className='w-8 h-8 mr-2' />
                    <span>{error}</span>
                </div>
            </div>
        )
    }

    return (
        <div className='bg-card border border-border rounded-lg p-6 space-y-6'>


            {/* Stats Overview */}
            {currentLog && (
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    <div className='bg-muted rounded-lg p-4 text-center'>
                        <div className='text-2xl font-bold text-foreground'>{totalPages}</div>
                        <div className='text-sm text-muted-foreground'>Pages Scraped</div>
                    </div>
                    <div className='bg-muted rounded-lg p-4 text-center'>
                        <div className='text-2xl font-bold text-green-600'>{successfulLinks}</div>
                        <div className='text-sm text-muted-foreground'>Successful</div>
                    </div>
                    <div className='bg-muted rounded-lg p-4 text-center'>
                        <div className='text-2xl font-bold text-blue-600'>{totalWords.toLocaleString()}</div>
                        <div className='text-sm text-muted-foreground'>Total Words</div>
                    </div>
                    <div className='bg-muted rounded-lg p-4 text-center'>
                        <div className='text-2xl font-bold text-red-600'>{totalErrors}</div>
                        <div className='text-sm text-muted-foreground'>Errors</div>
                    </div>
                </div>
            )}

            <Separator />

            {/* Logs History */}
            <div className='space-y-4'>
                <h4 className='text-md font-semibold text-foreground'>Scraping History</h4>
                
                {logs.length === 0 ? (
                    <div className='text-center py-8 text-muted-foreground'>
                        <FileText className='w-12 h-12 mx-auto mb-2 opacity-50' />
                        <p>No scraping logs found for this project.</p>
                    </div>
                ) : (
                    <ScrollArea className="h-96 w-full">
                        <div className='space-y-4 pr-4'>
                            {logs.map((log, index) => (
                                <div key={log.id} className={`border rounded-lg p-4 space-y-3 ${log.current ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                    {/* Log Header */}
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2'>
                                            {getStatusIcon(log.success)}
                                            <span className='font-medium'>
                                                Scraping Session #{logs.length - index}
                                            </span>
                                            {log.current && (
                                                <Badge variant='outline' className='text-xs'>Current</Badge>
                                            )}
                                        </div>
                                        {getStatusBadge(log.success)}
                                    </div>

                                    {/* Log Stats */}
                                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                                        <div>
                                            <span className='text-muted-foreground'>Pages:</span>
                                            <span className='ml-1 font-medium'>{log.pages}</span>
                                        </div>
                                        <div>
                                            <span className='text-muted-foreground'>Words:</span>
                                            <span className='ml-1 font-medium'>{log.total_words.toLocaleString()}</span>
                                        </div>
                                        <div>
                                            <span className='text-muted-foreground'>Errors:</span>
                                            <span className='ml-1 font-medium text-red-600'>{log.errors}</span>
                                        </div>
                                        <div>
                                            <span className='text-muted-foreground'>Success Rate:</span>
                                            <span className='ml-1 font-medium text-green-600'>
                                                {
                                                    log.current ? <><span className='text-green-600'>{log.pages > 0 ? Math.round(((log.pages - log.errors) / log.pages) * 100) : 0}%</span></> : <span className='text-red-600'>0%</span>
                                                }
                                               
                                            </span>
                                        </div>
                                        <div>
                                            <span className='text-muted-foreground'>Current Active :</span>
                                            <span className='ml-1 font-medium text-green-600'>
                                              {log.current ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Timestamps */}
                                    <div className='flex items-center justify-between text-xs text-muted-foreground'>
                                        <span>Started: {formatDate(log.createdAt)}</span>
                                        <span>Completed: {formatDate(log.updatedAt)}</span>
                                    </div>

                                    {/* Scraped Links */}
                                    {log.scrappedLinks && log.scrappedLinks.length > 0 && (
                                        <div className='space-y-2'>
                                            <div className='flex items-center gap-2'>
                                                <Globe className='w-4 h-4 text-muted-foreground' />
                                                <span className='text-sm font-medium'>Scraped URLs ({log.scrappedLinks.length})</span>
                                            </div>
                                            <ScrollArea className="h-32 w-full">
                                                <div className='space-y-1 pr-4'>
                                                    {log.scrappedLinks.map((link) => (
                                                        <div key={link.id} className='flex items-center justify-between p-2 bg-muted/50 rounded text-xs'>
                                                            <a 
                                                                href={link.urls} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className='text-primary hover:underline truncate flex-1 mr-2'
                                                            >
                                                                {link.urls}
                                                            </a>
                                                            {link.status ? (
                                                                <CheckCircle className='w-3 h-3 text-green-500 flex-shrink-0' />
                                                            ) : (
                                                                <XCircle className='w-3 h-3 text-red-500 flex-shrink-0' />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </div>
    )
}

export default ProjectLogs