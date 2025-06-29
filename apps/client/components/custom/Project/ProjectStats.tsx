
import { Bot, CheckCircle, MessageCircle, Users } from 'lucide-react'
import React from 'react'

const projects = [
  {
    id: 1,
    name: 'Documentation Helper',
    description: 'AI assistant for product documentation',
    type: 'Documentation Chatbot',
    website: 'docs.example.com',
    status: 'active',
    messages: 1240,
    users: 89,
    lastActive: '2 hours ago',
    createdAt: '2024-01-15',
    color: 'bg-blue-500/20 text-blue-400',
    performance: 94
  },
  {
    id: 2,
    name: 'Support Assistant',
    description: 'Customer support automation bot',
    type: 'Customer Support',
    website: 'support.acme.com',
    status: 'active',
    messages: 892,
    users: 156,
    lastActive: '5 minutes ago',
    createdAt: '2024-01-10',
    color: 'bg-green-500/20 text-green-400',
    performance: 87
  },
  {
    id: 3,
    name: 'Lead Qualifier',
    description: 'Automated lead generation and qualification',
    type: 'Lead Generator',
    website: 'landing.startup.io',
    status: 'training',
    messages: 156,
    users: 23,
    lastActive: '1 day ago',
    createdAt: '2024-01-08',
    color: 'bg-purple-500/20 text-purple-400',
    performance: 76
  },
  {
    id: 4,
    name: 'Sales Bot',
    description: 'Product recommendations and sales assistance',
    type: 'Sales Assistant',
    website: 'shop.ecommerce.com',
    status: 'inactive',
    messages: 45,
    users: 8,
    lastActive: '3 days ago',
    createdAt: '2024-01-05',
    color: 'bg-orange-500/20 text-orange-400',
    performance: 62
  },
  {
    id: 5,
    name: 'FAQ Assistant',
    description: 'Frequently asked questions automation',
    type: 'General Assistant',
    website: 'help.company.com',
    status: 'active',
    messages: 678,
    users: 45,
    lastActive: '1 hour ago',
    createdAt: '2024-01-03',
    color: 'bg-gray-500/20 text-gray-400',
    performance: 91
  },
  {
    id: 6,
    name: 'Booking Assistant',
    description: 'Appointment scheduling and management',
    type: 'Service Provider',
    website: 'book.services.com',
    status: 'error',
    messages: 234,
    users: 12,
    lastActive: '2 days ago',
    createdAt: '2024-01-01',
    color: 'bg-red-500/20 text-red-400',
    performance: 45
  }
]

  const activeCount = projects.filter(p => p.status === 'active').length
  const totalMessages = projects.reduce((sum, p) => sum + p.messages, 0)
  const totalUsers = projects.reduce((sum, p) => sum + p.users, 0)

const ProjectStats = () => {
  return (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-card rounded-lg border border-border p-4'>
          <div className='flex items-center gap-3'>
            <Bot className='w-5 h-5 text-blue-400' />
            <div>
              <p className='text-2xl font-bold text-card-foreground'>{projects.length}</p>
              <p className='text-sm text-muted-foreground'>Total Projects</p>
            </div>
          </div>
        </div>
        <div className='bg-card rounded-lg border border-border p-4'>
          <div className='flex items-center gap-3'>
            <CheckCircle className='w-5 h-5 text-green-400' />
            <div>
              <p className='text-2xl font-bold text-card-foreground'>{activeCount}</p>
              <p className='text-sm text-muted-foreground'>Active Bots</p>
            </div>
          </div>
        </div>
        <div className='bg-card rounded-lg border border-border p-4'>
          <div className='flex items-center gap-3'>
            <MessageCircle className='w-5 h-5 text-purple-400' />
            <div>
              <p className='text-2xl font-bold text-card-foreground'>{totalMessages.toLocaleString()}</p>
              <p className='text-sm text-muted-foreground'>Total Messages</p>
            </div>
          </div>
        </div>

      </div>
  )
}

export default ProjectStats