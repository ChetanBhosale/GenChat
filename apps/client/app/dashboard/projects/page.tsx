'use client'

import { Button } from '@/components/ui/button'
import React, { useContext, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search,
  Filter,
  Plus,
  Bot,
  ExternalLink,
  MoreVertical,
  Calendar,
  Activity,
  Users,
  MessageCircle,
  Settings,
  Trash2,
  Copy,
  Eye,
  Edit,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import ProjectStats from '@/components/custom/Project/ProjectStats'
import { getUserProjects } from '@/app/actions/project'
import { ProjectContext } from '@/context/ProjectContext'
import ProjectView from '@/components/custom/Project/ProjectView'
import ProjectDisplay from '@/components/custom/Project/ProjectDisplay'

// Sample projects data
// const projects = [
//   {
//     id: 1,
//     name: 'Documentation Helper',
//     description: 'AI assistant for product documentation',
//     type: 'Documentation Chatbot',
//     website: 'docs.example.com',
//     status: 'active',
//     messages: 1240,
//     users: 89,
//     lastActive: '2 hours ago',
//     createdAt: '2024-01-15',
//     color: 'bg-blue-500/20 text-blue-400',
//     performance: 94
//   },
//   {
//     id: 2,
//     name: 'Support Assistant',
//     description: 'Customer support automation bot',
//     type: 'Customer Support',
//     website: 'support.acme.com',
//     status: 'active',
//     messages: 892,
//     users: 156,
//     lastActive: '5 minutes ago',
//     createdAt: '2024-01-10',
//     color: 'bg-green-500/20 text-green-400',
//     performance: 87
//   },
//   {
//     id: 3,
//     name: 'Lead Qualifier',
//     description: 'Automated lead generation and qualification',
//     type: 'Lead Generator',
//     website: 'landing.startup.io',
//     status: 'training',
//     messages: 156,
//     users: 23,
//     lastActive: '1 day ago',
//     createdAt: '2024-01-08',
//     color: 'bg-purple-500/20 text-purple-400',
//     performance: 76
//   },
//   {
//     id: 4,
//     name: 'Sales Bot',
//     description: 'Product recommendations and sales assistance',
//     type: 'Sales Assistant',
//     website: 'shop.ecommerce.com',
//     status: 'inactive',
//     messages: 45,
//     users: 8,
//     lastActive: '3 days ago',
//     createdAt: '2024-01-05',
//     color: 'bg-orange-500/20 text-orange-400',
//     performance: 62
//   },
//   {
//     id: 5,
//     name: 'FAQ Assistant',
//     description: 'Frequently asked questions automation',
//     type: 'General Assistant',
//     website: 'help.company.com',
//     status: 'active',
//     messages: 678,
//     users: 45,
//     lastActive: '1 hour ago',
//     createdAt: '2024-01-03',
//     color: 'bg-gray-500/20 text-gray-400',
//     performance: 91
//   },
//   {
//     id: 6,
//     name: 'Booking Assistant',
//     description: 'Appointment scheduling and management',
//     type: 'Service Provider',
//     website: 'book.services.com',
//     status: 'error',
//     messages: 234,
//     users: 12,
//     lastActive: '2 days ago',
//     createdAt: '2024-01-01',
//     color: 'bg-red-500/20 text-red-400',
//     performance: 45
//   }
// ]

const statusConfig = {
  active: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: <CheckCircle className="w-3 h-3" /> },
  training: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: <Clock className="w-3 h-3" /> },
  inactive: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: <Activity className="w-3 h-3" /> },
  error: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: <AlertCircle className="w-3 h-3" /> }
}

const Projects = () => {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error("ProjectContext must be used inside ProjectProvider")
  const {fetchProjectFunction} = ctx;
  const [searchTerm, setSearchTerm] = useState('')


  useEffect(() => {
    fetchProjectFunction()
  },[])


  return (
    <div className='w-full space-y-6 p-6'>

      <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Projects</h1>
          <p className='text-muted-foreground mt-1'>Manage and monitor your AI chatbots</p>
        </div>
        <Link href="/dashboard/projects/create">
          <Button className='bg-primary text-primary-foreground hover:bg-primary/90 gap-2'>
            <Plus className='w-4 h-4' />
            Create Project
          </Button>
        </Link>
      </div>


      <ProjectStats />

      <div className='space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <ProjectDisplay />
      </div>

    </div>
  )
}

export default Projects