import { ProjectContext } from '@/context/ProjectContext'
import React, { Fragment, useContext } from 'react'

type Props = {}

const ProjectView = (props: Props) => {
    const ctx = useContext(ProjectContext)
    if(!ctx) return new Error('project view is not working for now')
const {filterProjects} = ctx;
    return <div>hello</div>
//   return (
//     <Fragment>

//     {filteredProjects.length === 0 ? (

//         ) : (
//           <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
//             {filteredProjects.map((project) => (
//              
//             ))}
//           </div>
//         )} 
//     </Fragment>
//   )
}

export default ProjectView