'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Mail, Save, ArrowLeft } from 'lucide-react'

export default function SettingsPage() {
  const [user, setUser] = useState<{
    id: string
    email?: string
    full_name?: string
    subscription_status?: string
  } | null>(null)
  const [profile, setProfile] = useState({
    full_name: '',
    email: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const getUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)

      // Get user profile
      const { data: userData } = await supabase
        .from('users')
        .select('full_name, email, subscription_status')
        .eq('id', user.id)
        .single()

      if (userData) {
        setProfile({
          full_name: userData.full_name || '',
          email: userData.email || user.email
        })
      }
    } catch (error) {
      console.error('Error getting user:', error)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    getUser()
  }, [getUser])

  async function handleSave() {
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profile.full_name,
        })
        .eq('id', user.id)

      if (error) throw error

      alert('Profile updated successfully!')
    } catch (error: unknown) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>

          <div className="space-y-6">
            {/* Profile Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      className="pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      value={profile.email}
                      className="pl-10 bg-gray-50"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed from here. Contact support if needed.
                  </p>
                </div>
              </div>
            </div>

            {/* Account Section */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Subscription</h3>
                    <p className="text-sm text-gray-600">
                      Current plan: <span className="capitalize font-medium">Free</span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/subscription')}
                  >
                    Manage Plan
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <h3 className="font-medium text-red-900">Sign Out</h3>
                    <p className="text-sm text-red-600">
                      Sign out of your account
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="border-t pt-6">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}