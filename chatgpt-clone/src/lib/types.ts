export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  subscription_status?: 'free' | 'pro' | 'premium'
  subscription_id?: string
  created_at: string
  updated_at: string
}

export interface Chat {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  chat_id: string
  content: string
  role: 'user' | 'assistant'
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'
  price_id: string
  current_period_start: string
  current_period_end: string
  created_at: string
  updated_at: string
}