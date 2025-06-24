import { Button } from '@/components/ui/button'
import { Bot, Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {}

const CreateNewProjectScreen = (props: Props) => {
    return (
        <div className='bg-card rounded-xl border border-border p-12 text-center'>
            <Bot className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-card-foreground mb-2'>No projects found</h3>
            <p className='text-muted-foreground mb-6'>Try adjusting your search or filters, or create your first project.</p>
            <Link href="/dashboard/projects/create">
                <Button>
                    <Plus className='w-4 h-4 mr-2' />
                    Create Project
                </Button>
            </Link>
        </div>
    )
}

export default CreateNewProjectScreen