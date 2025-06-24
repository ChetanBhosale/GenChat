import Header from '@/components/custom/Landing/Header'
import Hero from '@/components/custom/Landing/Hero'
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { 
  Check, 
  X, 
  Zap, 
  Crown, 
  Bot,
  MessageCircle,
  Users,
  BarChart3,
  Shield,
  Rocket,
  Headphones,
  ArrowRight,
  Star,
  Globe,
  Clock,
  TrendingUp,
  FileText,
  HeadphonesIcon,
  Sparkles,
  Camera,
  Palette,
  Settings,
  Database,
  ChevronRight
} from 'lucide-react'
import React from 'react'

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out our chatbot builder',
    badge: 'Free Forever',
    icon: <Bot className="w-6 h-6" />,
    color: 'border-border bg-card',
    buttonText: 'Get Started Free',
    buttonVariant: 'outline' as const,
    features: [
      { name: '1 Chatbot', included: true },
      { name: '100 Messages/month', included: true },
      { name: 'Basic Templates', included: true },
      { name: 'Website Integration', included: true },
      { name: 'Email Support', included: true },
      { name: 'Custom Branding', included: false },
      { name: 'Advanced Analytics', included: false },
      { name: 'API Access', included: false }
    ]
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'Best for growing businesses and professionals',
    badge: 'Most Popular',
    icon: <Zap className="w-6 h-6" />,
    color: 'border-primary bg-primary/5 relative',
    buttonText: 'Start Free Trial',
    buttonVariant: 'default' as const,
    features: [
      { name: '5 Chatbots', included: true },
      { name: '10,000 Messages/month', included: true },
      { name: 'All Templates', included: true },
      { name: 'Custom Avatar Upload', included: true },
      { name: 'Custom Branding', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'API Access', included: true },
      { name: 'Priority Email Support', included: true }
    ]
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: 'per month',
    description: 'Advanced features for large organizations',
    badge: 'Best Value',
    icon: <Crown className="w-6 h-6" />,
    color: 'border-orange-500/30 bg-orange-500/5',
    buttonText: 'Contact Sales',
    buttonVariant: 'outline' as const,
    features: [
      { name: 'Unlimited Chatbots', included: true },
      { name: 'Unlimited Messages', included: true },
      { name: 'White-label Solution', included: true },
      { name: 'Custom Avatar Upload', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'API Access', included: true },
      { name: 'Team Collaboration', included: true },
      { name: 'Priority Phone Support', included: true }
    ]
  }
]

const features = [
  {
    icon: <Bot className="w-8 h-8" />,
    title: 'AI-Powered Conversations',
    description: 'Advanced natural language processing that understands context and provides intelligent, human-like responses to your customers.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: <Camera className="w-8 h-8" />,
    title: 'Custom Avatar & Branding',
    description: 'Upload custom avatars, choose themes, and fully brand your chatbot to match your company identity and style.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: 'Website Integration',
    description: 'One-click integration with any website. No coding required - just embed and your chatbot is ready to engage visitors.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: 'Advanced Analytics',
    description: 'Detailed insights into user interactions, conversion rates, popular questions, and chatbot performance metrics.',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Real-time Responses',
    description: 'Lightning-fast responses powered by advanced AI models. Your customers get instant answers 24/7 without waiting.',
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Enterprise Security',
    description: 'Bank-level security with data encryption, GDPR compliance, and secure data handling to protect your business.',
    gradient: 'from-slate-500 to-gray-500'
  }
]

const chatbotTypes = [
  {
    icon: <FileText className="w-6 h-6" />,
    name: 'Documentation Assistant',
    description: 'Help users navigate complex documentation and find answers instantly',
    color: 'text-blue-400',
    examples: ['API Documentation', 'User Manuals', 'Knowledge Base']
  },
  {
    icon: <HeadphonesIcon className="w-6 h-6" />,
    name: 'Customer Support',
    description: 'Provide 24/7 customer service and resolve common issues automatically',
    color: 'text-green-400',
    examples: ['Ticket Creation', 'FAQ Answers', 'Issue Resolution']
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    name: 'Lead Generator',
    description: 'Capture and qualify leads while providing valuable information',
    color: 'text-purple-400',
    examples: ['Lead Qualification', 'Contact Collection', 'Product Interest']
  },
  {
    icon: <Users className="w-6 h-6" />,
    name: 'Sales Assistant',
    description: 'Guide customers through your products and increase conversions',
    color: 'text-orange-400',
    examples: ['Product Recommendations', 'Price Quotes', 'Feature Comparison']
  }
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Head of Customer Success',
    company: 'TechCorp',
    content: 'Finix transformed our customer support. We reduced response time by 80% and increased customer satisfaction significantly.',
    rating: 5,
    avatar: '👩‍💼'
  },
  {
    name: 'Michael Chen',
    role: 'Marketing Director',
    company: 'StartupXYZ',
    content: 'The lead generation chatbot increased our qualified leads by 150%. Setup was incredibly easy and results came immediately.',
    rating: 5,
    avatar: '👨‍💻'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Product Manager',
    company: 'InnovateCo',
    content: 'Best investment for our documentation. Users can now find answers instantly instead of searching through pages of docs.',
    rating: 5,
    avatar: '👩‍🚀'
  }
]

const stats = [
  { number: '50,000+', label: 'Active Chatbots' },
  { number: '2M+', label: 'Messages Processed' },
  { number: '99.9%', label: 'Uptime Guarantee' },
  { number: '24/7', label: 'Support Available' }
]

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      {/* Stats Section */}
      <section className="py-16 mt-52 px-6 ">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Everything You Need to Build Amazing Chatbots
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From simple customer support to complex AI assistants, our platform provides cutting-edge tools to create, customize, and deploy intelligent chatbots that drive real results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-card rounded-2xl border border-border p-8 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chatbot Types Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Bot className="w-4 h-4 mr-2" />
              Chatbot Types
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Built for Every Use Case
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you need customer support, lead generation, or documentation help, we have specialized chatbot types optimized for your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {chatbotTypes.map((type, index) => (
              <div key={index} className="bg-card rounded-2xl border border-border p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className={`p-4 rounded-xl bg-background border border-border ${type.color}`}>
                    {type.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-card-foreground mb-3">{type.name}</h3>
                    <p className="text-muted-foreground mb-4">{type.description}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-card-foreground">Perfect for:</p>
                      <div className="flex flex-wrap gap-2">
                        {type.examples.map((example, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Star className="w-4 h-4 mr-2" />
              Customer Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Loved by Thousands of Businesses
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how companies are transforming their customer experience with our AI chatbots.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card rounded-2xl border border-border p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-card-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Crown className="w-4 h-4 mr-2" />
              Pricing Plans
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start free and scale as you grow. All plans include our core features with no hidden fees or setup costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`rounded-2xl border p-8 ${plan.color} hover:shadow-xl transition-all duration-300 ${plan.name === 'Pro' ? 'scale-105' : ''}`}>
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    {/* <Badge className={`px-4 py-1 text-sm ${plan.name === 'Pro' ? 'bg-primary text-primary-foreground' : 'bg-orange-500 text-white'}`}>
                      {plan.badge}
                    </Badge> */}
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-6">
                    <div className={`p-4 rounded-xl ${plan.name === 'Pro' ? 'bg-primary/20 text-primary' : 'bg-muted/50 text-muted-foreground'}`}>
                      {plan.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-card-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">/{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={`${feature.included ? 'text-card-foreground' : 'text-muted-foreground'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant={plan.buttonVariant} 
                  className="w-full py-6 text-lg font-medium"
                  size="lg"
                >
                  {plan.buttonText}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Transform Your Customer Experience?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of businesses using Finix to automate support, generate leads, and provide instant assistance to their customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-6 text-lg">
                Start Building Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                Watch Demo
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Setup in under 5 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">Finix</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Build powerful AI chatbots in minutes. Transform your website into an intelligent customer service platform that works 24/7.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm">Privacy</Button>
                <Button variant="ghost" size="sm">Terms</Button>
                <Button variant="ghost" size="sm">Contact</Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Features</p>
                <p>Pricing</p>
                <p>API Docs</p>
                <p>Templates</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Help Center</p>
                <p>Documentation</p>
                <p>Contact Us</p>
                <p>Status</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Finix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage