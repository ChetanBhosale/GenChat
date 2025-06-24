import React, { useMemo } from 'react'
import { projectFormSchema } from '@repo/common/type'
import { BotIcon, Database, Globe, Image, MessageCircle, Sparkles, Zap } from 'lucide-react'
import { Bot } from 'lucide-react'
import { chatbotTypes } from '@repo/common'
import { Badge } from '@/components/ui/badge'

const LivePreview = ({formData}:{formData:projectFormSchema}) => {

   const selectedChatBot = useMemo(() => {
    return chatbotTypes.find(bot => bot.id === formData.chatBotType)
   },[formData.chatBotType])
  return (
    <div className='lg:col-span-1 space-y-6'>
    <div className='bg-card rounded-xl border border-border p-6 sticky top-4'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='p-2 bg-primary/20 rounded-lg'>
          <Sparkles className='w-5 h-5 text-primary' />
        </div>
        <h3 className='text-lg font-semibold text-card-foreground'>Live Preview</h3>
      </div>

      <div className='bg-background rounded-lg border border-border p-4 mb-6'>
        <div className='flex items-center gap-3 mb-4 pb-3 border-b border-border'>
          <div className='relative'>
            
              <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
                <Bot className='w-4 h-4 text-primary-foreground' />
              </div>
            
            <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-background'></div>
          </div>
          <div>
            <h4 className='font-medium text-sm text-card-foreground'>
              {formData.chatbotName || 'Your Chatbot'}
            </h4>
            <p className='text-xs text-green-400'>Online</p>
          </div>
        </div>
        
        <div className='space-y-3'>
          <div className='flex gap-2'>
            <div className='flex-shrink-0'>
              
                <div className='w-6 h-6 bg-primary rounded-full flex items-center justify-center'>
                  <Bot className='w-3 h-3 text-primary-foreground' />
                </div>
              
            </div>
            <div 
              className='px-3 py-2 rounded-lg text-sm text-white max-w-xs bg-primary'
            >
              {formData.welcomeMessage || 'Hi! How can I help you today?'}
            </div>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className='space-y-4'>
        <div className='p-4 bg-background rounded-lg border border-border'>
          <div className='flex items-center gap-3 mb-3'>
            <Globe className='w-4 h-4 text-muted-foreground' />
            <div>
              <h4 className='font-medium text-sm text-card-foreground'>
                {formData.projectName || 'Your Project'}
              </h4>
              <p className='text-xs text-muted-foreground'>
                {formData.websiteUrl || 'yourwebsite.com'}
              </p>
            </div>
          </div>
          
          {formData.chatBotType && (
            <Badge className={selectedChatBot?.color}>
              {selectedChatBot?.name}
            </Badge>
          )}
        </div>

        <div className='text-sm text-muted-foreground space-y-2'>
          <div className='flex items-center gap-2'>
            <Database className='w-4 h-4' />
            <span>Auto-training from website content</span>
          </div>
          <div className='flex items-center gap-2'>
            <MessageCircle className='w-4 h-4' />
            <span>Conversational AI responses</span>
          </div>
          <div className='flex items-center gap-2'>
            <Zap className='w-4 h-4' />
            <span>Real-time chat widget</span>
          </div>
          <div className='flex items-center gap-2'>
            <BotIcon className='w-4 h-4' />
            <span>Website favicon will be chatbot icon </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default LivePreview