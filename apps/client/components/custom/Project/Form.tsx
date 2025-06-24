import React, { FC } from 'react'
import { projectFormSchema } from '@repo/common/type'
import { Settings, ExternalLink, Bot } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { chatbotTypes } from '@repo/common'

interface Props {
  formData: projectFormSchema,
  handleInputChange: (field: string, value: string) => void,
  error: projectFormSchema,
  loading: boolean
}

export const ErrorSpan = ({ message }: { message: String }) => {
  if (message?.length > 0) {
    return <span className='text-red-400 text-xs'>{message}</span>
  }
  return null;
}

const Form: FC<Props> = ({ formData, handleInputChange, error, loading }) => {
  return (
    <div className='lg:col-span-2 space-y-8'>
      <div className='bg-card rounded-xl border border-border p-6 space-y-6'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-primary/20 rounded-lg'>
            <Settings className='w-5 h-5 text-primary' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-card-foreground'>Project Details</h3>
            <p className='text-sm text-muted-foreground'>Configure your chatbot project basics</p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium text-card-foreground mb-2 block'>
              Project Name *
            </label>
            <Input
              placeholder="e.g., My Awesome Chatbot"
              value={formData.projectName}
              disabled={loading}
              onChange={(e) => handleInputChange('projectName', e.target.value)}
              className='bg-background border-border focus:border-primary'
            />
            <ErrorSpan message={error.projectName} />
          </div>

          <div>
            <label className='text-sm font-medium text-card-foreground mb-2 block'>
              Chatbot Name *
            </label>
            <Input
              placeholder="e.g., Alex Assistant"
              value={formData.chatbotName}
              disabled={loading}
              onChange={(e) => handleInputChange('chatbotName', e.target.value)}
              className='bg-background border-border focus:border-primary'
            />
            <ErrorSpan message={error.chatbotName} />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium text-card-foreground mb-2 block'>
              Website URL *
            </label>
            <div className='relative'>
              <Input
                placeholder="https://yourwebsite.com"
                value={formData.websiteUrl}
                disabled={loading}
                onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                className='bg-background border-border focus:border-primary pl-10'
              />
              <ExternalLink className='w-4 h-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2' />
            </div>
            <ErrorSpan message={error.websiteUrl} />
          </div>

          <div>
            <label className='text-sm font-medium text-card-foreground mb-2 block'>
              Support Email *
            </label>
            <div className='relative'>
              <Input
                placeholder="support@yourwebsite.com"
                value={formData.supportEmail}
                disabled={loading}
                onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                className='bg-background border-border focus:border-primary pl-10'
              />
              <ExternalLink className='w-4 h-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2' />
            </div>
            <ErrorSpan message={error.supportEmail ?? ''} />
          </div>
        </div>

        <div>
          <label className='text-sm font-medium text-card-foreground mb-2 block'>
            Description *
          </label>
          <textarea
            placeholder="Describe what your chatbot should help users with..."
            value={formData.projectDescription}
            disabled={loading}
            onChange={(e) => handleInputChange('projectDescription', e.target.value)}
            className='w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-20 text-sm'
          />
          <ErrorSpan message={error.projectDescription} />
        </div>

        <div>
          <label className='text-sm font-medium text-card-foreground mb-2 block'>
            Welcome Message
          </label>
          <Input
            placeholder="Hi! How can I help you today?"
            value={formData.welcomeMessage}
            disabled={loading}
            onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
            className='bg-background border-border focus:border-primary'
          />
          <ErrorSpan message={error.welcomeMessage} />
        </div>
      </div>

      {/* Chatbot Type Selection */}
      <div className='bg-card rounded-xl border border-border p-6 space-y-6'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-primary/20 rounded-lg'>
            <Bot className='w-5 h-5 text-primary' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-card-foreground'>Chatbot Type</h3>
            <p className='text-sm text-muted-foreground'>Choose the primary purpose of your chatbot</p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {chatbotTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => !loading && handleInputChange('chatBotType', type.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                formData.chatBotType === type.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-background hover:border-border/60'
              } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className='flex items-start gap-3'>
                <div className={`p-2 rounded-lg ${type.color}`}>
                  <type.icon className='w-5 h-5' />
                </div>
                <div className='flex-1'>
                  <h4 className='font-medium text-card-foreground text-sm mb-1'>
                    {type.name}
                  </h4>
                  <p className='text-xs text-muted-foreground'>
                    {type.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ErrorSpan message={error.chatBotType} />
      </div>
    </div>
  )
}

export default Form
