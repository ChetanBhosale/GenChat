import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'
import { InteractiveGridPattern } from '@/components/magicui/interactive-grid-pattern'
import React from 'react'
import { Pointer } from './Pointer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const Hero = () => {
  return (
    <div className='relative w-full flex flex-col mt-32 items-center justify-center px-6'>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-6xl">
        {/* Pointer */}
        <div className='mb-6 flex items-center justify-center'>
          <Pointer />
        </div>
        
        {/* Main Heading */}
        <h1 className='text-5xl md:text-7xl font-extrabold text-balance text-foreground mb-6 leading-tight'>
          Turn Your Website Into A Chatbot
        </h1>
        
        {/* Description */}
        <p className='text-xl md:text-2xl text-muted-foreground font-light max-w-4xl mb-10 leading-relaxed'>
          Scrape any website and create specialized AI agents that convert visitors into customers, help with documentation, and provide instant support.
        </p>
        
        {/* CTA Buttons */}
        <div className='flex flex-col sm:flex-row items-center gap-4 mb-8'>
        <Link href='/dashboard'>
          <Button size='lg' className='px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group'>
            Get Started For Free
          </Button>
        </Link>
        </div>
        
        {/* Trust indicators */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>No credit card required</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-muted-foreground/30 rounded-full" />
          <div className="flex items-center gap-2">
            <span>Setup in under 5 minutes</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-muted-foreground/30 rounded-full" />
          <div className="flex items-center gap-2">
            <span>50,000+ active chatbots</span>
          </div>
        </div>
      </div>
      
      {/* Optional: Add subtle grid pattern */}
      <div className="absolute inset-0 opacity-20">
        {/* <InteractiveGridPattern /> */}
      </div>
    </div>
  )
}

export default Hero