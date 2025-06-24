import React from 'react'
import Logo from './Logo'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const Header = async () => {
  const user = await currentUser()

  return (
    <div className='flex items-center justify-between px-5 py-3'>
        <Logo />
        <div className='flex items-center gap-2'>
          <Link href='/dashboard' className='hidden md:block'>
            <Button size='sm' variant='outline' className='px-6 hover:text-white '>
                {user ? 'Dashboard' : 'Sign in'}
            </Button>
            </Link>

              <Button size='sm' className='bg-primary px-6 text-white'>
                  Join our community
              </Button>
        </div>
    </div>
  )
}

export default Header