import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'
import React, { Fragment } from 'react'

const BreadcrumbProvider = () => {
const pathname = usePathname()
  return (
    <div className='flex items-center text-md my-2'>
        <Breadcrumb>
            <BreadcrumbList>
                {pathname?.split('/').map((ele,index) => (
                    <Fragment key={index}>
                        <BreadcrumbItem key={index}>
                            <BreadcrumbLink href={`${pathname?.split('/').slice(0,index+1).join('/')}`} className={`${index === pathname?.split('/').length - 1 ? 'text-white' : 'text-gray-400'}`}>{ele}</BreadcrumbLink>
                        </BreadcrumbItem>
                        {index !== pathname?.split('/').length - 1 && <BreadcrumbSeparator />}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    </div>
  )
}

export default BreadcrumbProvider