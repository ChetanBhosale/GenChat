import React from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Check, 
  X, 
  Zap, 
  Crown, 
  Rocket,
  Bot,
  MessageCircle,
  Users,
  BarChart3,
  Shield,
  Headphones,
  CreditCard,
  Calendar,
  TrendingUp,
  Settings,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out our chatbot builder',
    badge: null,
    icon: <Bot className="w-6 h-6" />,
    color: 'border-border bg-card',
    buttonText: 'Get Started',
    buttonVariant: 'outline' as const,
    features: [
      { name: '1 Chatbot', included: true },
      { name: '100 Messages/month', included: true },
      { name: 'Basic Templates', included: true },
      { name: 'Website Integration', included: true },
      { name: 'Email Support', included: true },
      { name: 'Custom Branding', included: false },
      { name: 'Advanced Analytics', included: false },
      { name: 'API Access', included: false },
      { name: 'Priority Support', included: false },
      { name: 'Team Collaboration', included: false }
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
      { name: 'Website Integration', included: true },
      { name: 'Custom Branding', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'API Access', included: true },
      { name: 'Priority Email Support', included: true },
      { name: 'Team Collaboration', included: false },
      { name: 'White-label Solution', included: false }
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
      { name: 'All Templates', included: true },
      { name: 'Website Integration', included: true },
      { name: 'Custom Branding', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'API Access', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Team Collaboration', included: true },
      { name: 'White-label Solution', included: true }
    ]
  }
]

const features = [
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: 'Smart Conversations',
    description: 'AI-powered responses that understand context and provide relevant answers'
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Multi-user Support',
    description: 'Handle multiple customer conversations simultaneously with ease'
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Advanced Analytics',
    description: 'Detailed insights into user interactions and chatbot performance'
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Enterprise Security',
    description: 'Bank-level security with data encryption and compliance standards'
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    title: 'Easy Integration',
    description: 'One-click integration with your website, no coding required'
  },
  {
    icon: <Headphones className="w-5 h-5" />,
    title: '24/7 Support',
    description: 'Round-the-clock assistance to help you succeed with your chatbots'
  }
]

const currentPlan = {
  name: 'Pro',
  price: '$29',
  period: 'per month',
  status: 'active',
  nextBilling: '2024-02-15',
  icon: <Zap className="w-6 h-6" />
}

const usage = [
  {
    title: 'Chatbots',
    used: 3,
    limit: 5,
    icon: <Bot className="w-5 h-5" />,
    color: 'text-blue-400'
  },
  {
    title: 'Messages This Month',
    used: 7842,
    limit: 10000,
    icon: <MessageCircle className="w-5 h-5" />,
    color: 'text-green-400'
  },
  {
    title: 'Team Members',
    used: 2,
    limit: 5,
    icon: <Users className="w-5 h-5" />,
    color: 'text-purple-400'
  }
]

const credits = [
  {
    type: 'Bonus Messages',
    amount: 2500,
    expiresAt: '2024-03-01',
    status: 'active'
  },
  {
    type: 'Referral Credit',
    amount: 1000,
    expiresAt: '2024-04-15',
    status: 'active'
  }
]

const PlansPage = () => {
  return (
    <div className='w-full space-y-8 p-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Billing & Plans</h1>
          <p className='text-muted-foreground mt-1'>Manage your subscription and usage</p>
        </div>
        <Button variant="outline" className='gap-2'>
          <Settings className='w-4 h-4' />
          Billing Settings
        </Button>
      </div>

      {/* Current Plan */}
      <div className='bg-card rounded-xl border border-border p-6'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-primary/20 rounded-xl text-primary'>
              {currentPlan.icon}
            </div>
            <div>
              <div className='flex items-center gap-3 mb-1'>
                <h2 className='text-2xl font-bold text-card-foreground'>{currentPlan.name} Plan</h2>
                <Badge variant="default" className='bg-green-500/20 text-green-400 border-green-500/30'>
                  <CheckCircle className='w-3 h-3 mr-1' />
                  Active
                </Badge>
              </div>
              <p className='text-muted-foreground'>
                {currentPlan.price} {currentPlan.period} • Next billing: {new Date(currentPlan.nextBilling).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className='flex gap-3'>
            <Button variant="outline">
              Change Plan
            </Button>
            <Button>
              Upgrade
            </Button>
          </div>
        </div>
      </div>

      {/* Usage Overview */}
      <div className='bg-card rounded-xl border border-border p-6'>
        <h3 className='text-xl font-semibold text-card-foreground mb-6'>Usage Overview</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {usage.map((item, index) => {
            const percentage = (item.used / item.limit) * 100
            const isNearLimit = percentage > 80
            
            return (
              <div key={index} className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className={`p-2 bg-opacity-20 rounded-lg ${item.color}`}>
                      {item.icon}
                    </div>
                    <h4 className='font-medium text-card-foreground'>{item.title}</h4>
                  </div>
                  {isNearLimit && (
                    <AlertCircle className='w-4 h-4 text-orange-400' />
                  )}
                </div>
                
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-card-foreground font-medium'>
                      {item.used.toLocaleString()} / {item.limit.toLocaleString()}
                    </span>
                    <span className={`${isNearLimit ? 'text-orange-400' : 'text-muted-foreground'}`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className='w-full bg-muted rounded-full h-2'>
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isNearLimit ? 'bg-orange-400' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Credits & Bonuses */}
      <div className='bg-card rounded-xl border border-border p-6'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-xl font-semibold text-card-foreground'>Credits & Bonuses</h3>
            <p className='text-sm text-muted-foreground'>Additional credits available in your account</p>
          </div>
          <Button variant="outline" size="sm">
            View History
          </Button>
        </div>

        <div className='space-y-4'>
          {credits.map((credit, index) => (
            <div key={index} className='flex items-center justify-between p-4 bg-background rounded-lg border border-border'>
              <div className='flex items-center gap-4'>
                <div className='p-2 bg-green-500/20 rounded-lg'>
                  <CreditCard className='w-4 h-4 text-green-400' />
                </div>
                <div>
                  <h4 className='font-medium text-card-foreground'>{credit.type}</h4>
                  <p className='text-sm text-muted-foreground'>
                    Expires: {new Date(credit.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <p className='font-bold text-green-400'>+{credit.amount.toLocaleString()}</p>
                <p className='text-xs text-muted-foreground'>messages</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className='bg-card rounded-xl border border-border p-6'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-xl font-semibold text-card-foreground'>Payment Method</h3>
            <p className='text-sm text-muted-foreground'>Manage your billing information</p>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </div>

        <div className='flex items-center gap-4 p-4 bg-background rounded-lg border border-border'>
          <div className='p-2 bg-primary/20 rounded-lg'>
            <CreditCard className='w-5 h-5 text-primary' />
          </div>
          <div className='flex-1'>
            <p className='font-medium text-card-foreground'>•••• •••• •••• 4242</p>
            <p className='text-sm text-muted-foreground'>Expires 12/2026</p>
          </div>
          <Badge variant="secondary">Default</Badge>
        </div>
      </div>

      {/* Billing History */}
      <div className='bg-card rounded-xl border border-border p-6'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-xl font-semibold text-card-foreground'>Recent Invoices</h3>
            <p className='text-sm text-muted-foreground'>Your billing history</p>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        <div className='space-y-3'>
          {[
            { date: '2024-01-15', amount: '$29.00', status: 'paid' },
            { date: '2023-12-15', amount: '$29.00', status: 'paid' },
            { date: '2023-11-15', amount: '$29.00', status: 'paid' }
          ].map((invoice, index) => (
            <div key={index} className='flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-border/60 transition-colors'>
              <div className='flex items-center gap-3'>
                <Calendar className='w-4 h-4 text-muted-foreground' />
                <div>
                  <p className='font-medium text-card-foreground'>{new Date(invoice.date).toLocaleDateString()}</p>
                  <p className='text-sm text-muted-foreground'>Pro Plan</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <span className='font-medium text-card-foreground'>{invoice.amount}</span>
                <Badge variant="secondary" className='bg-green-500/20 text-green-400'>
                  Paid
                </Badge>
                <Button variant="ghost" size="sm">
                  <ArrowRight className='w-4 h-4' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlansPage 