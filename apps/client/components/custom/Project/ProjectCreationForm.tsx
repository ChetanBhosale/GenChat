'use client'

import React, { useState, useRef, FC, useContext } from 'react'
import { projectFormSchema } from '@repo/common/type'
import Form from './Form'
import LivePreview from './LivePreview'
import { ProjectContext } from '@/context/ProjectContext'



const avatarPresets = [
  { id: 'bot1', name: 'Modern Bot', emoji: '🤖', color: 'bg-blue-500' },
  { id: 'assistant', name: 'Assistant', emoji: '👨‍💼', color: 'bg-purple-500' },
  { id: 'support', name: 'Support', emoji: '🎧', color: 'bg-green-500' },
  { id: 'sales', name: 'Sales Rep', emoji: '👩‍💼', color: 'bg-orange-500' },
  { id: 'friendly', name: 'Friendly', emoji: '😊', color: 'bg-pink-500' },
  { id: 'professional', name: 'Professional', emoji: '💼', color: 'bg-gray-500' }
]

type Props = {
  // handleSaveProject : (form:projectFormSchema) => void
}



const ProjectCreationForm : FC<Props> = ( ) => {

  const ctx = useContext(ProjectContext)
   if (!ctx) throw new Error("ProjectContext must be used inside ProjectProvider")

const { details, handleInputChange, error, loading } = ctx

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 my-4'>
      <Form formData={details} handleInputChange={handleInputChange} error={error} loading={loading} />
      <LivePreview formData={details}  />
    </div>
  )
}

export default ProjectCreationForm