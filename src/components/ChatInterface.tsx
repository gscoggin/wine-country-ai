'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, User, Bot, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to Sip.AI! I\'m your personal wine country concierge. Whether you\'re seeking the perfect Cabernet, a hidden gem restaurant, or planning an unforgettable weekend escape—I\'m here to guide you. What sounds lovely today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    // Smooth scroll to bottom when messages change
    if (messagesContainerRef.current) {
      const scrollHeight = messagesContainerRef.current.scrollHeight
      messagesContainerRef.current.scrollTo({
        top: scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Expand chat
    setIsExpanded(true)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('Error:', error)

      let errorContent = 'Sorry, I encountered an error. Please try again.'

      // Handle specific error cases
      if (error.message && error.message.includes('429')) {
        errorContent = 'You\'ve reached the rate limit. Please wait a moment before sending another message.'
      } else if (error.message && error.message.includes('timeout')) {
        errorContent = 'The request took too long. Please try with a shorter message.'
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`card max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-2 border-tuscan-200 transition-all duration-500 ease-in-out ${
        isExpanded ? 'shadow-2xl' : ''
      }`}
    >
      <div
        ref={messagesContainerRef}
        className={`overflow-y-auto mb-6 space-y-6 px-2 transition-all duration-500 ease-in-out scroll-smooth ${
          isExpanded ? 'h-[36rem]' : 'h-96'
        }`}
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                  message.role === 'user'
                    ? 'bg-terracotta-600 text-white'
                    : 'bg-sage-600 text-white'
                }`}
              >
                {message.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div
                className={`px-5 py-3 rounded-2xl shadow-sm ${
                  message.role === 'user'
                    ? 'bg-terracotta-600 text-white'
                    : 'bg-tuscan-50 text-charcoal-900 border border-tuscan-200'
                }`}
              >
                {message.role === 'assistant' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="prose prose-sm max-w-none prose-charcoal
                      prose-headings:text-charcoal-900 prose-headings:font-serif prose-headings:mb-3 prose-headings:mt-4 first:prose-headings:mt-0
                      prose-p:text-charcoal-800 prose-p:leading-relaxed prose-p:mb-4
                      prose-ul:my-4 prose-ul:space-y-3
                      prose-ol:my-4 prose-ol:space-y-3
                      prose-li:text-charcoal-800 prose-li:leading-relaxed prose-li:mb-2
                      prose-strong:text-charcoal-900 prose-strong:font-semibold
                      prose-a:text-terracotta-600 prose-a:no-underline hover:prose-a:underline
                      [&>*:last-child]:mb-0"
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-sage-600 text-white flex items-center justify-center shadow-md">
                <Bot size={18} />
              </div>
              <div className="bg-tuscan-50 border border-tuscan-200 px-5 py-3 rounded-2xl shadow-sm">
                <div className="flex items-center space-x-2">
                  <Loader2 size={18} className="animate-spin text-terracotta-600" />
                  <span className="text-sm text-charcoal-700">Curating your perfect experience...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              const form = e.currentTarget.form
              if (form) {
                form.requestSubmit()
              }
            }
          }}
          placeholder="Ask about wineries, restaurants, experiences, or anything wine country..."
          className="flex-1 input-field shadow-sm transition-all duration-300"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="btn-primary bg-terracotta-600 hover:bg-terracotta-700 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center transition-all duration-300"
        >
          <Send size={18} />
          <span>Send</span>
        </button>
      </form>
    </div>
  )
}