import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'

type DefaultProviderProps = {
    children: React.ReactNode
}

const DefaultProvider = ({children}: DefaultProviderProps) => {
  return (
    <ClerkProvider>
        {children}
    </ClerkProvider>
  )
}

export default DefaultProvider