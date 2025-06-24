import React from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bot, 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Plus,
  ExternalLink,
  MoreVertical,
  Calendar,
  Activity
} from 'lucide-react'
import Link from 'next/link'

// Sample data
const stats = [
  {
    title: 'Total Projects',
    value: '12',
    change: '+2 this month',
    icon: <Bot className="w-5 h-5" />,
    color: 'text-blue-400'
  },
  {
    title: 'Active Users',
    value: '2,847',
    change: '+18% from last month',
    icon: <Users className="w-5 h-5" />,
    color: 'text-green-400'
  },
  {
    title: 'Total Messages',
    value: '15,642',
    change: '+24% from last month',
    icon: <MessageCircle className="w-5 h-5" />,
    color: 'text-purple-400'
  },
  {
    title: 'Conversion Rate',
    value: '12.5%',
    change: '+3.2% from last month',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'text-orange-400'
  }
]

const recentProjects = [
  {
    id: 1,
    name: 'Documentation Helper',
    type: 'Documentation Chatbot',
    website: 'docs.example.com',
    status: 'active',
    messages: 1240,
    lastActive: '2 hours ago',
    color: 'bg-blue-500/20 text-blue-400'
  },
  {
    id: 2,
    name: 'Support Assistant',
    type: 'Customer Support',
    website: 'support.acme.com',
    status: 'active',
    messages: 892,
    lastActive: '5 minutes ago',
    color: 'bg-green-500/20 text-green-400'
  },
  {
    id: 3,
    name: 'Lead Qualifier',
    type: 'Lead Generator',
    website: 'landing.startup.io',
    status: 'training',
    messages: 156,
    lastActive: '1 day ago',
    color: 'bg-purple-500/20 text-purple-400'
  },
  {
    id: 4,
    name: 'Sales Bot',
    type: 'Sales Assistant',
    website: 'shop.ecommerce.com',
    status: 'inactive',
    messages: 45,
    lastActive: '3 days ago',
    color: 'bg-orange-500/20 text-orange-400'
  }
]

const DashboardPage = () => {
  return (
    <div className='w-full space-y-8 p-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Welcome back! 👋</h1>
          <p className='text-muted-foreground mt-1'>Here's what's happening with your chatbots today.</p>
        </div>
        <Link href="/dashboard/projects/create">
          <Button className='bg-primary text-primary-foreground hover:bg-primary/90 gap-2'>
            <Plus className='w-4 h-4' />
            Create Project
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat, index) => (
          <div key={index} className='bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow'>
            <div className='flex items-center justify-between mb-4'>
              <div className={`p-2 rounded-lg bg-opacity-20 ${stat.color}`}>
                {stat.icon}
              </div>
              <MoreVertical className='w-4 h-4 text-muted-foreground' />
            </div>
            <div>
              <h3 className='text-2xl font-bold text-card-foreground mb-1'>{stat.value}</h3>
              <p className='text-sm text-muted-foreground mb-2'>{stat.title}</p>
              <p className='text-xs text-green-400'>{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className='bg-card rounded-xl border border-border p-6'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-xl font-semibold text-card-foreground'>Recent Projects</h2>
            <p className='text-sm text-muted-foreground'>Manage and monitor your chatbot projects</p>
          </div>
          <Link href="/dashboard/projects">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        <div className='space-y-4'>
          {recentProjects.map((project) => (
            <div key={project.id} className='flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-border/60 transition-colors'>
              <div className='flex items-center gap-4 flex-1'>
                <div className='w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center'>
                  <Bot className='w-5 h-5 text-primary' />
                </div>
                
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <h3 className='font-medium text-card-foreground truncate'>{project.name}</h3>
                    <Badge 
                      variant={project.status === 'active' ? 'default' : project.status === 'training' ? 'secondary' : 'outline'}
                      className='text-xs'
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <span className='flex items-center gap-1'>
                      <ExternalLink className='w-3 h-3' />
                      {project.website}
                    </span>
                    <span className={project.color}>
                      {project.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-6 text-sm text-muted-foreground'>
                <div className='text-right'>
                  <p className='font-medium text-card-foreground'>{project.messages.toLocaleString()}</p>
                  <p className='text-xs'>messages</p>
                </div>
                <div className='text-right'>
                  <p className='flex items-center gap-1'>
                    <Activity className='w-3 h-3' />
                    {project.lastActive}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='p-2 bg-blue-500/20 rounded-lg'>
              <Bot className='w-5 h-5 text-blue-400' />
            </div>
            <h3 className='font-semibold text-card-foreground'>Quick Setup</h3>
          </div>
          <p className='text-sm text-muted-foreground mb-4'>Get your first chatbot running in under 5 minutes</p>
          <Button variant="outline" size="sm" className='w-full'>
            Start Setup
          </Button>
        </div>

        <div className='bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='p-2 bg-green-500/20 rounded-lg'>
              <MessageCircle className='w-5 h-5 text-green-400' />
            </div>
            <h3 className='font-semibold text-card-foreground'>View Analytics</h3>
          </div>
          <p className='text-sm text-muted-foreground mb-4'>Check your chatbot performance and user interactions</p>
          <Button variant="outline" size="sm" className='w-full'>
            View Stats
          </Button>
        </div>

        <div className='bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='p-2 bg-purple-500/20 rounded-lg'>
              <Users className='w-5 h-5 text-purple-400' />
            </div>
            <h3 className='font-semibold text-card-foreground'>Team Settings</h3>
          </div>
          <p className='text-sm text-muted-foreground mb-4'>Manage team members and collaboration settings</p>
          <Button variant="outline" size="sm" className='w-full'>
            Manage Team
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage