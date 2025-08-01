'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Check, Crown, Zap, Star } from 'lucide-react'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '10 messages per day',
      'Basic AI responses',
      'Standard support',
      'Web access only'
    ],
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 20,
    priceId: 'price_pro_monthly', // Replace with your actual Stripe price ID
    features: [
      'Unlimited messages',
      'Advanced AI responses',
      'Priority support',
      'Web & mobile access',
      'Chat history export',
      'Custom prompts'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 50,
    priceId: 'price_premium_monthly', // Replace with your actual Stripe price ID
    features: [
      'Everything in Pro',
      'GPT-4 access',
      'API access',
      'Team collaboration',
      'Advanced analytics',
      'White-label options'
    ],
    popular: false
  }
]

export default function SubscriptionPage() {
  const [user, setUser] = useState<{
    id: string
    email?: string
    full_name?: string
    subscription_status?: string
  } | null>(null)
  const [currentSubscription, setCurrentSubscription] = useState<{
    subscription_status?: string
    subscription_id?: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingPlan, setProcessingPlan] = useState<string | null>(null)
  const router = useRouter()

  const getUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)
      
      // Get user's current subscription
      const { data: userData } = await supabase
        .from('users')
        .select('subscription_status, subscription_id')
        .eq('id', user.id)
        .single()
      
      setCurrentSubscription(userData)
    } catch (error) {
      console.error('Error getting user:', error)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    getUser()
  }, [getUser])

  async function handleSubscribe(priceId: string, planId: string) {
    if (!user) return
    
    setProcessingPlan(planId)
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
        }),
      })

      const { url, error } = await response.json()
      
      if (error) {
        throw new Error(error)
      }
      
      if (url) {
        window.location.href = url
      }
    } catch (error: unknown) {
      console.error('Error creating checkout session:', error)
      alert('Failed to start checkout process. Please try again.')
    } finally {
      setProcessingPlan(null)
    }
  }

  async function handleManageSubscription() {
    if (!user) return
    
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      })

      const { url, error } = await response.json()
      
      if (error) {
        throw new Error(error)
      }
      
      if (url) {
        window.location.href = url
      }
    } catch (error: unknown) {
      console.error('Error creating portal session:', error)
      alert('Failed to open subscription management. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the full potential of AI-powered conversations with our flexible pricing plans.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="mb-4">
                  {plan.id === 'free' && <Zap className="h-12 w-12 text-gray-400 mx-auto" />}
                  {plan.id === 'pro' && <Crown className="h-12 w-12 text-blue-500 mx-auto" />}
                  {plan.id === 'premium' && <Star className="h-12 w-12 text-purple-500 mx-auto" />}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                {plan.id === 'free' ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={currentSubscription?.subscription_status === 'free'}
                  >
                    {currentSubscription?.subscription_status === 'free' ? 'Current Plan' : 'Current Plan'}
                  </Button>
                ) : currentSubscription?.subscription_status === plan.id ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleManageSubscription}
                  >
                    Manage Subscription
                  </Button>
                ) : (
                  <Button
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-blue-500 hover:bg-blue-600' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    onClick={() => handleSubscribe(plan.priceId!, plan.id)}
                    disabled={processingPlan === plan.id}
                  >
                    {processingPlan === plan.id ? 'Processing...' : `Upgrade to ${plan.name}`}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
          >
            Back to Chat
          </Button>
        </div>
      </div>
    </div>
  )
}