'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { IprojectSchema } from '@repo/common/type'
import CreateNewProjectScreen from '@/components/custom/Project/CreateNewProjectScreen'
import { Bot, ExternalLink, MoreVertical, Activity, Calendar, Eye, Settings, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { project_type_color, ProvideChatBotById } from '@repo/common'
import Link from 'next/link'

interface ProjectsClientComponentProps {
  initialProjects: IprojectSchema[]
  error?: string
}

const ProjectsClientComponent: React.FC<ProjectsClientComponentProps> = ({ 
  initialProjects, 
  error 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Filter projects based on search and filters
  const filteredProjects = initialProjects?.filter((project: IprojectSchema) => {
    const matchesSearch = project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.projectDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.websiteUrl.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesType = typeFilter === 'all' || project.chatBotType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  }) || []

  if (error) {
    return (
      <div className="col-span-full flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load projects</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Search and Filters */}
      <div className='col-span-full bg-card rounded-xl border border-border p-6 mb-6'>
        <div className='flex flex-col lg:flex-row gap-4'>
          <div className='relative flex-1'>
            <Search className='w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder="Search projects, websites, or types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 bg-background border-border focus:border-primary'
            />
          </div>
          <div className='flex gap-3'>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm'
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="training">Training</option>
              <option value="inactive">Inactive</option>
              <option value="error">Error</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className='px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm'
            >
              <option value="all">All Types</option>
              <option value="Documentation Chatbot">Documentation</option>
              <option value="Customer Support">Support</option>
              <option value="Lead Generator">Lead Gen</option>
              <option value="Sales Assistant">Sales</option>
              <option value="General Assistant">General</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 && initialProjects.length === 0 ? (
        <div className="col-span-full">
          <CreateNewProjectScreen />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="col-span-full flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-muted-foreground">No projects match your search criteria</p>
            <Button 
              variant="ghost" 
              className="mt-2"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setTypeFilter('all')
              }}
            >
              Clear filters
            </Button>
          </div>
        </div>
      ) : (
        filteredProjects.map((project: IprojectSchema) => (
          <div key={project.id} className='bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-200'>
            <div className='flex items-start justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center'>
                  <Bot className='w-6 h-6 text-primary' />
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-card-foreground'>{project.projectName}</h3>
                  <p className='text-sm text-muted-foreground'>{project.projectDescription}</p>
                </div>
              </div>
              <div className='relative'>
                <Button variant="ghost" size="sm">
                  <MoreVertical className='w-4 h-4' />
                </Button>
              </div>
            </div>

            <div className='space-y-3 mb-4'>
              <div className='flex items-center gap-2'>
                <ExternalLink className='w-4 h-4 text-muted-foreground' />
                <Link href={project.websiteUrl} target='_blank' className='text-sm hover:text-foreground text-muted-foreground'>
                  {project.websiteUrl}
                </Link>
              </div>
              <div className='flex items-center gap-2'>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${ProvideChatBotById(project.chatBotType).color}`}>
                  {ProvideChatBotById(project.chatBotType).name}
                </span>
                <Badge className={project_type_color[project.status as keyof typeof project_type_color]}>
                  <span className='ml-1 capitalize'>{project.status}</span>
                </Badge>
              </div>
            </div>

            <div className='flex items-center justify-between text-sm text-muted-foreground mb-4'>
              <span className='flex items-center gap-1'>
                <Activity className='w-3 h-3' />
                Last active: {new Date(project.updatedAt).toLocaleDateString()}
              </span>
              <span className='flex items-center gap-1'>
                <Calendar className='w-3 h-3' />
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className='flex gap-2 pt-4 border-t border-border'>
              <Button variant="outline" size="sm" className='flex-1'>
                <Eye className='w-4 h-4 mr-2' />
                View
              </Button>
              <Button variant="outline" size="sm" className='flex-1'>
                <Settings className='w-4 h-4 mr-2' />
                Settings
              </Button>
              <Button variant="outline" size="sm" className='flex-1'>
                <TrendingUp className='w-4 h-4 mr-2' />
                Analytics
              </Button>
            </div>
          </div>
        ))
      )}
    </>
  )
}

export default ProjectsClientComponent 