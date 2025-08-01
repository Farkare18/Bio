'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Sidebar } from '@/components/sidebar'
import { ChatInterface } from '@/components/chat-interface'
import { Message, Chat } from '@/lib/types'
import { generateChatTitle } from '@/lib/utils'

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const chatId = params.id as string

  const [user, setUser] = useState<{
    id: string
    email?: string
    full_name?: string
    subscription_status?: string
  } | null>(null)
  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)

  const fetchChats = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setChats(data || [])
    } catch (error) {
      console.error('Error fetching chats:', error)
    }
  }, [])

  const getUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)
      await fetchChats(user.id)
    } catch (error) {
      console.error('Error getting user:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }, [router, fetchChats])

  const createNewChat = useCallback(async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('chats')
        .insert([
          {
            user_id: user.id,
            title: 'New Chat',
          }
        ])
        .select()
        .single()

      if (error) throw error
      
      setChat(data)
      setMessages([])
      
      // Update URL to the new chat ID
      router.replace(`/chat/${data.id}`)
      
      // Refresh chats list
      await fetchChats(user.id)
    } catch (error) {
      console.error('Error creating new chat:', error)
    }
  }, [user, router, fetchChats])

  const loadChat = useCallback(async () => {
    if (!user) return
    
    try {
      // Load chat details
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select('*')
        .eq('id', chatId)
        .eq('user_id', user.id)
        .single()

      if (chatError) throw chatError
      setChat(chatData)

      // Load messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (messagesError) throw messagesError
      setMessages(messagesData || [])
    } catch (error) {
      console.error('Error loading chat:', error)
      router.push('/')
    }
  }, [chatId, user, router])

  useEffect(() => {
    getUser()
  }, [getUser])

  useEffect(() => {
    if (user && chatId) {
      if (chatId === 'new') {
        createNewChat()
      } else {
        loadChat()
      }
    }
  }, [user, chatId, createNewChat, loadChat])

  async function handleSendMessage(content: string) {
    if (!chat || !user) return

    setSendingMessage(true)

    try {
      // Add user message
      const userMessage = {
        chat_id: chat.id,
        content,
        role: 'user' as const,
      }

      const { data: userMessageData, error: userMessageError } = await supabase
        .from('messages')
        .insert([userMessage])
        .select()
        .single()

      if (userMessageError) throw userMessageError

      // Update local state
      setMessages(prev => [...prev, userMessageData])

      // Update chat title if it's the first message
      if (messages.length === 0) {
        const newTitle = generateChatTitle(content)
        
        const { error: updateError } = await supabase
          .from('chats')
          .update({ title: newTitle, updated_at: new Date().toISOString() })
          .eq('id', chat.id)

        if (!updateError) {
          setChat(prev => prev ? { ...prev, title: newTitle } : null)
          await fetchChats(user.id)
        }
      }

      // Generate AI response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessageData].map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const { content: aiResponse } = await response.json()

      // Add AI message
      const aiMessage = {
        chat_id: chat.id,
        content: aiResponse,
        role: 'assistant' as const,
      }

      const { data: aiMessageData, error: aiMessageError } = await supabase
        .from('messages')
        .insert([aiMessage])
        .select()
        .single()

      if (aiMessageError) throw aiMessageError

      // Update local state
      setMessages(prev => [...prev, aiMessageData])

      // Update chat timestamp
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chat.id)

    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSendingMessage(false)
    }
  }

  async function handleNewChat() {
    router.push('/chat/new')
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
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        chats={chats}
        currentChatId={chat?.id}
        user={user}
        onNewChat={handleNewChat}
        onSignOut={handleSignOut}
      />
      <main className="flex-1 md:ml-64">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={sendingMessage}
        />
      </main>
    </div>
  )
}