import ProjectProvider from "./Provider"

const LayoutProject = ({children}: {children: React.ReactNode}) => {
  return (
        <div className="p-3">
          <ProjectProvider>
            {children}
          </ProjectProvider>
        </div>

  )
}

export default LayoutProject