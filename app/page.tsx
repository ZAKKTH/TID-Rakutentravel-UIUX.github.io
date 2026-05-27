'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { ChatMessage } from '@/components/chat-message'
import { ChatInput } from '@/components/chat-input'
import { AIQuestion } from '@/components/ai-question'
import { HotelResultCards } from '@/components/hotel-result-cards'
import { ParsedCriteriaDisplay, parseCriteria } from '@/components/parsed-criteria-display'

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
    description: '三島駅から徒歩5分。モダンな客室設備とビジネス向け設施が充実。',
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
    description: 'アクセスが良く、リーズナブルな価格が魅力。',
  },
  {
    id: '3',
    name: 'グランドホテル静岡',
    distance: 4.2,
    rating: 4.4,
    reviews: 312,
    price: 9800,
    image: '🏨',
    amenities: ['WiFi', 'Breakfast', 'AC'],
    description: '高級感あふれるホテル。温泉大浴場完備。',
  },
  {
    id: '4',
    name: 'ビジネスホテル駅前',
    distance: 0.3,
    rating: 3.9,
    reviews: 89,
    price: 4800,
    image: '🏨',
    amenities: ['WiFi'],
    description: '三島駅から最も近いホテル。低価格で駅前ロケーション。',
  },
  {
    id: '5',
    name: 'リゾートスパ三島',
    distance: 4.5,
    rating: 4.7,
    reviews: 421,
    price: 12500,
    image: '🏨',
    amenities: ['WiFi', 'Breakfast', 'AC'],
    description: 'スパ施設完備の高級ホテル。',
  },
]

const exampleQueries = [
  '三島駅 5km以内 朝食付き',
  '駅前の格安ホテル WiFi完備',
  '温泉スパ完備 贅沢な環境',
]

export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [, setCurrentQuery] = useState('')
  const [, setNeedsDate] = useState(false)
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

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: message }])

    // Show thinking state
    await new Promise(r => setTimeout(r, 300))
    setMessages(prev => [...prev, { type: 'ai-thinking' }])

    // Parse and show criteria
    await new Promise(r => setTimeout(r, 800))
    setMessages(prev => prev.filter(m => m.type !== 'ai-thinking'))
    setMessages(prev => [...prev, { type: 'ai-criteria', query: message }])

    // Check if date is missing
    const hasDate = message.includes('今日') || message.includes('今週') || message.includes('来週') || /\d{4}/.test(message)

    if (!hasDate) {
      await new Promise(r => setTimeout(r, 500))
      setNeedsDate(true)
      setMessages(prev => [...prev, { type: 'ai-question', questionType: 'date' }])
      setIsLoading(false)
      return
    }

    // Show results
    await new Promise(r => setTimeout(r, 600))
    setMessages(prev => [...prev, { type: 'ai-results', hotels: mockHotels }])
    setIsLoading(false)
  }

  const handleQuestionAnswer = async (answer: string) => {
    setNeedsDate(false)

    // Add user answer as message
    setMessages(prev => [...prev, { type: 'user', content: answer }])

    // Show thinking
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 500))

    // Show results
    setMessages(prev => [...prev, { type: 'ai-results', hotels: mockHotels }])
    setIsLoading(false)
  }

  const handleExampleClick = (example: string) => {
    handleSend(example)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-sm">Rakuten Travel AI</h1>
              <p className="text-[10px] text-muted-foreground">セマンティック検索</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Kaizen UX
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            // Welcome State
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-balance">
                  理想のホテルを1行で検索
                </h2>
                <p className="text-muted-foreground max-w-md text-sm">
                  自然な言葉で条件を入力してください。AIが意図を理解し、最適な宿泊施設を提案します。
                </p>
              </div>

              <div className="space-y-3 w-full max-w-md">
                <p className="text-xs font-medium text-muted-foreground uppercase">例えば...</p>
                <div className="flex flex-col gap-2">
                  {exampleQueries.map((example) => (
                    <button
                      key={example}
                      onClick={() => handleExampleClick(example)}
                      className="w-full text-left px-4 py-3 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/60 hover:border-primary/30 transition-all text-sm"
                    >
                      {example}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  左下の ^ ボタンからタグで細かい条件を組み合わせることもできます
                </p>
              </div>
            </div>
          ) : (
            // Chat Messages
            <div className="space-y-4">
              {messages.map((message, index) => {
                switch (message.type) {
                  case 'user':
                    return (
                      <ChatMessage key={index} type="user">
                        <p className="text-sm">{message.content}</p>
                      </ChatMessage>
                    )

                  case 'ai-thinking':
                    return (
                      <ChatMessage key={index} type="ai">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" />
                            <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse delay-75" />
                            <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse delay-150" />
                          </div>
                          <span className="text-xs text-muted-foreground">検索条件を分析中...</span>
                        </div>
                      </ChatMessage>
                    )

                  case 'ai-criteria':
                    const criteria = parseCriteria(message.query)
                    return (
                      <ChatMessage key={index} type="ai">
                        <div className="space-y-3">
                          <p className="text-sm">ご希望の条件を理解しました。</p>
                          <ParsedCriteriaDisplay criteria={criteria} />
                        </div>
                      </ChatMessage>
                    )

                  case 'ai-question':
                    return (
                      <ChatMessage key={index} type="ai">
                        {message.questionType === 'date' && (
                          <AIQuestion
                            question="宿泊日はいつ頃をご希望ですか?"
                            options={[
                              { label: '今日', value: '今日' },
                              { label: '今週末', value: '今週末' },
                              { label: '来週', value: '来週' },
                            ]}
                            onSelect={handleQuestionAnswer}
                            showDatePicker
                          />
                        )}
                      </ChatMessage>
                    )

                  case 'ai-results':
                    return (
                      <ChatMessage key={index} type="ai">
                        <HotelResultCards hotels={message.hotels} />
                      </ChatMessage>
                    )

                  case 'ai-text':
                    return (
                      <ChatMessage key={index} type="ai">
                        <p className="text-sm">{message.content}</p>
                      </ChatMessage>
                    )

                  default:
                    return null
                }
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-linear-to-t from-background via-background to-transparent pt-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSend={handleSend}
            isLoading={isLoading}
            placeholder="例: 三島駅 5km以内 朝食付き ダブルベッド"
          />
        </div>
      </div>
    </div>
  )
}
