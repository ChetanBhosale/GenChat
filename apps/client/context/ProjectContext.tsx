import { IprojectSchema, projectFormSchema } from '@repo/common/type'
import { Dispatch, SetStateAction, createContext } from 'react'

type ProjectFormSchema = {
  projectName: string
  chatbotName: string
  websiteUrl: string
  projectDescription: string
  welcomeMessage: string
  chatBotType: string
  supportEmail?: string
}

type ProjectContextType = {
  details: ProjectFormSchema
  setDetails: Dispatch<SetStateAction<ProjectFormSchema>>
  handleInputChange: (field: string, value: string) => void
  SaveProject: () => void,
  error : projectFormSchema,
  loading : boolean,
  projectError : string,
  fetchProjectFunction : () => {},
  filterProjects : IprojectSchema[] | [] | null
}

// 👇 Create context with correct type
export const ProjectContext = createContext<ProjectContextType | null>(null)
