import { FileText, HeadphonesIcon, TrendingUp, Users, MessageCircle } from "lucide-react";

export const chatbotTypes = [
    {
      id: '1',
      name: 'Documentation Chatbot',
      description: 'Help users navigate and understand your documentation',
      icon: FileText,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: '2',
      name: 'Lead Generator',
      description: 'Capture and qualify leads automatically',
      icon: TrendingUp,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: '3',
      name: 'General Assistant',
      description: 'Multi-purpose chatbot for various tasks',
      icon: MessageCircle,
      color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      gradient: 'from-gray-500 to-slate-500'
    }
]

export function ProvideChatBotById(id:string){
  return chatbotTypes[Number(id) - 1]
}



export const project_type = {
  active :'active',
  pending : 'pending',
  paused : 'paused',
  inactive : 'inactive',
  failed : 'failed',
  scraping : 'scraping',
  success : 'success'
}

export const project_type_color = {
  [project_type.active] : 'bg-green-500/20 text-green-400 border-green-500/30',
  [project_type.pending] : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  [project_type.paused] : 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  [project_type.inactive] : 'bg-red-500/20 text-red-400 border-red-500/30',
  [project_type.failed] : 'bg-red-500/20 text-red-400 border-red-500/30',
  [project_type.scraping] : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
} 


export const system_config = {
  scrape_queue : 'scrape_queue',
  scrape_queue_length : 'scrape_queue_length'
}

export const ai_config = {
  dev_index :'devindex',
  prod_index :'prodindex',
  region : 'us-east-1',
  cloud : 'aws',
  model : 'llama-text-embed-v2'
}

export const chunk_type = {
  heading_content_code : 'heading_content_code',
  heading_content : 'heading_content',
  content : 'content',
  code : 'code'
}