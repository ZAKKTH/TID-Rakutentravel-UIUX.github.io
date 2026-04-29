'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles } from 'lucide-react'

import { ChatMessage } from '@/components/chat-message'
import { ChatInput } from '@/components/chat-input'
import { AIQuestion } from '@/components/ai-question'
import { HotelResultCards } from '@/components/hotel-result-cards'
import {
  ParsedCriteriaDisplay,
  parseCriteria,
} from '@/components/parsed-criteria-display'

interface Hotel {
  id: string
  name: string
  distance: number
  rating: number
  reviews: number
  price: number
  image: string
  amenities: string[]
  description: string
}

type MessageType =
  | { type: 'user'; content: string }
  | { type: 'ai-thinking' }
  | { type: 'ai-criteria'; query: string }
  | { type: 'ai-question'; questionType: 'date' | 'guests' | 'budget' }
  | { type: 'ai-results'; hotels: Hotel[] }
  | { type: 'ai-text'; content: string }

const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'プレミアムシティホテル三島',
    distance: 2.5,
    rating: 4.6,
    reviews: 248,
    price: 8500,
    image: '🏨',
    amenities: ['WiFi', 'Breakfast', 'AC'],
    description: '三島駅から徒歩5分。',
  },
  {
    id: '2',
    name: 'シティホテルミシマ',
    distance: 3.8,
    rating: 4.2,
    reviews: 156,
    price: 6200,
    image: '🏨',
    amenities: ['WiFi', 'Breakfast'],
    description: 'リーズナブル。',
  },
]

export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuery, setCurrentQuery] = useState('')
  const [needsDate, setNeedsDate] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (message: string) => {
    setCurrentQuery(message)
    setIsLoading(true)

    setMessages((prev) => [
      ...prev,
      { type: 'user', content: message },
    ])

    await new Promise((r) => setTimeout(r, 300))

    setMessages((prev) => [...prev, { type: 'ai-thinking' }])

    await new Promise((r) => setTimeout(r, 600))

    setMessages((prev) =>
      prev.filter((m) => m.type !== 'ai-thinking')
    )

    setMessages((prev) => [
      ...prev,
      { type: 'ai-criteria', query: message },
    ])

    const hasDate =
      message.includes('今日') ||
      message.includes('今週') ||
      message.includes('来週') ||
      /\d{4}/.test(message)

    if (!hasDate) {
      setNeedsDate(true)

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { type: 'ai-question', questionType: 'date' },
        ])
      }, 300)

      setIsLoading(false)
      return
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { type: 'ai-results', hotels: mockHotels },
      ])
    }, 400)

    setIsLoading(false)
  }

  const handleQuestionAnswer = async (answer: string) => {
    setNeedsDate(false)

    setMessages((prev) => [
      ...prev,
      { type: 'user', content: answer },
    ])

    setIsLoading(true)

    await new Promise((r) => setTimeout(r, 400))

    setMessages((prev) => [
      ...prev,
      { type: 'ai-results', hotels: mockHotels },
    ])

    setIsLoading(false)
  }

  return (
    <div className="flex flex-col h-screen bg-background">

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold">Travel AI</h1>
              <p className="text-[10px] text-muted-foreground">
                semantic search
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

          {messages.map((m, i) => {
            switch (m.type) {
              case 'user':
                return (
                  <ChatMessage key={i} type="user">
                    <p className="text-sm">{m.content}</p>
                  </ChatMessage>
                )

              case 'ai-thinking':
                return (
                  <ChatMessage key={i} type="ai">
                    <p className="text-xs text-muted-foreground">
                      thinking...
                    </p>
                  </ChatMessage>
                )

              case 'ai-criteria':
                return (
                  <ChatMessage key={i} type="ai">
                    <ParsedCriteriaDisplay
                      criteria={parseCriteria(m.query)}
                    />
                  </ChatMessage>
                )

              case 'ai-question':
                return (
                  <ChatMessage key={i} type="ai">
                    <AIQuestion
                      question="宿泊日はいつですか？"
                      options={[
                        { label: '今日', value: '今日' },
                        { label: '今週末', value: '今週末' },
                        { label: '来週', value: '来週' },
                      ]}
                      onSelect={handleQuestionAnswer}
                      showDatePicker
                    />
                  </ChatMessage>
                )

              case 'ai-results':
                return (
                  <ChatMessage key={i} type="ai">
                    <HotelResultCards hotels={m.hotels} />
                  </ChatMessage>
                )

              default:
                return null
            }
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-4">
        <div className="max-w-3xl mx-auto px-4 pb-4">

          <div className="flex items-center gap-2 relative">

            <div className="flex-1">
              <ChatInput
                onSend={handleSend}
                isLoading={isLoading}
                placeholder="例: 三島駅 5km以内 朝食付き"
              />
            </div>

            {/* 条件ボタン */}
            <div className="relative">

              <button className="px-3 py-2 rounded-xl border border-border bg-card text-sm">
                条件
              </button>

              {/* 吹き出し */}
              <div className="absolute bottom-full mb-2 right-0">
                <div className="relative bg-card border border-border rounded-lg px-3 py-2 text-xs text-muted-foreground shadow-md">
                  細かい条件指定はこちら

                  <div className="absolute -bottom-1 right-3 w-3 h-3 bg-card border-b border-r border-border rotate-45" />
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  )
}