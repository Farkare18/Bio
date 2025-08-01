'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  MessageSquare, 
  Plus, 
  Settings, 
  User, 
  Crown,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Chat } from '@/lib/types'

interface SidebarProps {
  chats: Chat[]
  currentChatId?: string
  user?: {
    id: string
    email?: string
    full_name?: string
    subscription_status?: string
  } | null
  onNewChat: () => void
  onSignOut: () => void
}

export function Sidebar({ chats, currentChatId, user, onNewChat, onSignOut }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0",
        isCollapsed ? "-translate-x-full" : "translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <Button
              onClick={onNewChat}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              New chat
            </Button>
          </div>

          {/* Chat list */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {chats.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-800",
                    currentChatId === chat.id ? "bg-gray-800" : ""
                  )}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="truncate">{chat.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <div className="space-y-2">
              {user?.subscription_status !== 'free' && (
                <div className="flex items-center gap-2 text-yellow-400 text-sm">
                  <Crown className="h-4 w-4" />
                  <span className="capitalize">{user?.subscription_status} Plan</span>
                </div>
              )}
              
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => router.push('/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => router.push('/subscription')}
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Button>

              {user && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800">
                  <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user?.full_name || user?.email}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-white"
                    onClick={onSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  )
}