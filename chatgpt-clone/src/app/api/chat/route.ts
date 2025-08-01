import { NextRequest, NextResponse } from 'next/server'

// Simple AI response simulation - in a real app, you'd integrate with OpenAI, Claude, or another AI service
function generateAIResponse(messages: Array<{ role: string; content: string }>): string {
  const userMessage = messages[messages.length - 1]?.content || ''
  
  // Simple responses based on keywords
  if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
    return "Hello! I'm your AI assistant. How can I help you today?"
  }
  
  if (userMessage.toLowerCase().includes('weather')) {
    return "I'm not able to check real-time weather data, but I'd recommend checking a weather app or website for the most current conditions in your area."
  }
  
  if (userMessage.toLowerCase().includes('time')) {
    return "I don't have access to real-time information, but you can check the current time on your device or by searching online."
  }
  
  if (userMessage.toLowerCase().includes('help')) {
    return "I'm here to help! You can ask me questions about various topics, request explanations, help with writing, or just have a conversation. What would you like to know more about?"
  }
  
  if (userMessage.toLowerCase().includes('code') || userMessage.toLowerCase().includes('programming')) {
    return "I'd be happy to help with coding questions! I can assist with various programming languages, debugging, code review, or explaining programming concepts. What specific programming topic are you working on?"
  }
  
  // Default responses
  const defaultResponses = [
    "That's an interesting question! Could you tell me more about what you're looking for?",
    "I understand what you're asking. Let me help you with that.",
    "Thanks for sharing that with me. Here's what I think about your question.",
    "That's a great point. Let me provide some insights on that topic.",
    "I appreciate you bringing this up. Here's my perspective on what you've asked."
  ]
  
  const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  
  return `${randomResponse} Regarding "${userMessage.slice(0, 50)}${userMessage.length > 50 ? '...' : ''}", I'd be happy to help you explore this topic further. What specific aspect would you like to know more about?`
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }
    
    // In a real application, you would:
    // 1. Validate the user's subscription status
    // 2. Check rate limits
    // 3. Call an actual AI service like OpenAI
    // 4. Handle streaming responses
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    const aiResponse = generateAIResponse(messages)
    
    return NextResponse.json({
      content: aiResponse,
      role: 'assistant'
    })
    
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}