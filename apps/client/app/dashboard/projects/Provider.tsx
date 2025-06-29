'use client'

import { CreateProjectAction, getUserProjects, UpdateProjectAction } from '@/app/actions/project'
import { IReturn } from '@/common/action.return'
import { ProjectContext } from '@/context/ProjectContext'
import { projectFormSchema } from '@repo/common/type'
import { useRouter } from 'next/navigation'
import { IprojectSchema } from '@repo/common/type'

import React, { FC, ReactNode, useState } from 'react'
import { toast } from 'sonner'

type Props = { 
    children: ReactNode
}

const ProjectProvider: FC<Props> = ({ children }) => {
  const router = useRouter()
  const [loading,setLoading] = useState(false)
  const [projects,setProjects] = useState<null | IprojectSchema[]>(null)
  const [projectError,setProjectError] = useState('')
  const [searchTerm,setSearchTerm] = useState('')
  
  const filterProjects = projects?.filter((ele:IprojectSchema) => {
    return ele.projectName.includes(searchTerm) || ele.projectDescription.includes(searchTerm)
  }) || null

  const [details, setDetails] = useState<projectFormSchema>({
    projectName: '',
    chatbotName: '',
    websiteUrl: '',
    projectDescription: '',
    welcomeMessage: 'Hi, How can I help you today?',
    chatBotType: '',
    supportEmail: '',
  })

    const newErrors: projectFormSchema = {
    projectName: '',
    chatbotName: '',
    websiteUrl: '',
    projectDescription: '',
    welcomeMessage: '',
    chatBotType: '',
    supportEmail: '',
  }


  const [error, setError] = useState<projectFormSchema>({
    projectName: '',
    chatbotName: '',
    websiteUrl: '',
    projectDescription: '',
    welcomeMessage: '',
    chatBotType: '',
    supportEmail: '',
  })

  function handleInputChange(field: string, value: string) {
    setDetails(prev => ({ ...prev, [field]: value }))
    setError(prev => ({ ...prev, [field]: '' })) 
  }

  function validateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

async function SaveProject() {
    setLoading(true)
  let hasError = false


  // Validations
  if (details.projectName.trim().length < 3) {
    newErrors.projectName = 'Project name must be at least 3 characters long'
    hasError = true
  }

  if (details.chatbotName.trim().length < 3) {
    newErrors.chatbotName = 'Chatbot name must be at least 3 characters long'
    hasError = true
  }

  if (!details.websiteUrl.startsWith('http')) {
    newErrors.websiteUrl = 'Enter a valid URL (must start with http or https)'
    hasError = true
  }

  if (details.projectDescription.trim().length < 10) {
    newErrors.projectDescription = 'Description must be at least 10 characters'
    hasError = true
  }

  if (details.chatBotType.trim().length === 0) {
    newErrors.chatBotType = 'Please select a chatbot type'
    hasError = true
  }

  if (details.supportEmail && !validateEmail(details.supportEmail)) {
    newErrors.supportEmail = 'Enter a valid email address'
    hasError = true
  }

  setError(newErrors)

  if (hasError) {
    console.warn("Validation failed", newErrors)
    toast.warning('Please provide valid data')
    setLoading(false)
    return 
  }

  console.log("Form is valid, calling API...", details)

  const data : IReturn = await CreateProjectAction(details)

  if(!data?.success){
    toast.warning(data.message)

  }else{
    toast.success(data.message)
    router.push('/dashboard/projects')
  }
  
setLoading(false)
return;
}

async function updateProject(projectId:string,projectData:projectFormSchema){
  setLoading(true)
  let hasError = false

  if(projectData.projectName.trim().length < 3){
    newErrors.projectName = 'Project name must be at least 3 characters long'
    hasError = true
  }

  if(projectData.chatbotName.trim().length < 3){
    newErrors.chatbotName = 'Chatbot name must be at least 3 characters long'
    hasError = true
  }
  
  
  if(!projectData.websiteUrl.startsWith('http')){ 
    newErrors.websiteUrl = 'Enter a valid URL (must start with http or https)'
    hasError = true
  }

  if(projectData.projectDescription.trim().length < 10){
    newErrors.projectDescription = 'Description must be at least 10 characters' 
    hasError = true
  }

  if(projectData.chatBotType.trim().length === 0){
    newErrors.chatBotType = 'Please select a chatbot type'
    hasError = true
  }

  if(projectData.supportEmail && !validateEmail(projectData.supportEmail)){
    newErrors.supportEmail = 'Enter a valid email address'
    hasError = true
  }

  setError(newErrors)

  if(hasError){
    toast.warning('Please provide valid data')
    setLoading(false)
    return {
      success : false,
      message : 'Please provide valid data',
      data : null as any
    }
  }

  console.log("Form is valid, calling API...", projectData)

 
  const data : IReturn = await UpdateProjectAction(projectId,projectData)

  if(!data?.success){
    toast.warning(data.message) 
    setLoading(false)
    return {
      success : false,
      message : data.message,
      data : null as any
    }
  }else{
    toast.success(data.message)
    // router.push('/dashboard/projects')
    setLoading(false)
    return {
      success : true,
      message : data.message,
      data : data.data as IprojectSchema
    }
  }
}
async function fetchProjectFunction(){
  setLoading(true)
  const data = await getUserProjects();
    if(data?.success){
        setProjects(data?.data)
        setProjectError('')
    }else{
        setProjectError(() => "Failed to view project, please try again later!")
    }
    setLoading(false)
}


  const value = {
    setDetails,
    details,
    handleInputChange,
    SaveProject,
    error,
    setError,
    loading,
    projectError,
    fetchProjectFunction,
    filterProjects,
    updateProject
  }

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectProvider
