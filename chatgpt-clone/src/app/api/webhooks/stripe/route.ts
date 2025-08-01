import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Stripe from 'stripe'

interface SubscriptionWithPeriods extends Stripe.Subscription {
  current_period_start: number
  current_period_end: number
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  const supabase = await createServerSupabaseClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id

        if (!userId || !session.subscription) {
          console.error('Missing user_id or subscription in session metadata')
          break
        }

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        ) as unknown as SubscriptionWithPeriods

        // Determine subscription tier based on price ID
        let subscriptionStatus = 'pro'
        const priceId = subscription.items.data[0]?.price.id
        
        if (priceId?.includes('premium')) {
          subscriptionStatus = 'premium'
        }

        // Update user subscription status
        await supabase
          .from('users')
          .update({
            subscription_status: subscriptionStatus,
            subscription_id: subscription.id,
            stripe_customer_id: session.customer as string,
          })
          .eq('id', userId)

        // Create subscription record
        await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            price_id: priceId || '',
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as SubscriptionWithPeriods
        const customerId = subscription.customer as string

        // Find user by customer ID
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!user) {
          console.error('User not found for customer:', customerId)
          break
        }

        // Determine subscription tier
        let subscriptionStatus = 'pro'
        const priceId = subscription.items.data[0]?.price.id
        
        if (priceId?.includes('premium')) {
          subscriptionStatus = 'premium'
        }

        // Update user subscription
        await supabase
          .from('users')
          .update({
            subscription_status: subscriptionStatus,
            subscription_id: subscription.id,
          })
          .eq('id', user.id)

        // Update subscription record
        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            price_id: priceId || '',
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by customer ID
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!user) {
          console.error('User not found for customer:', customerId)
          break
        }

        // Revert to free plan
        await supabase
          .from('users')
          .update({
            subscription_status: 'free',
            subscription_id: null,
          })
          .eq('id', user.id)

        // Update subscription record
        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
          })
          .eq('stripe_subscription_id', subscription.id)

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Error handling webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}