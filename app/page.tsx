'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { SemanticSearchInput } from '@/components/semantic-search-input'
import { HotelResultCards, type HotelData } from '@/components/hotel-result-cards'
import { ParsedCriteriaDisplay, parseCriteria } from '@/components/parsed-criteria-display'
import { ChatMessage } from '@/components/chat-message'

type Message =
  | { type: 'user'; content: string }
  | { type: 'thinking' }
  | { type: 'criteria'; query: string }
  | { type: 'question'; question: string; options: string[] }
  | { type: 'results'; hotels: HotelData[]; matchedKeys: string[] }

const MOCK_HOTELS: HotelData[] = [
  {
    id: '1',
    name: 'プレミアムシティホテル三島',
    price: 8500,
    rating: 4.6,
    reviews: 248,
    distance: 2.5,
    image: '🏨',
    hasBreakfast: true,
    hasWifi: true,
    hasHotSpring: false,
    hasSpa: false,
    hasParking: true,
    noiseScore: 7,
    cleanScore: 9,
    serviceScore: 8,
    matchScore: 88,
  },
  {
    id: '2',
    name: 'シティホテルミシマ',
    price: 6200,
    rating: 4.2,
    reviews: 156,
    distance: 3.8,
    image: '🏩',
    hasBreakfast: true,
    hasWifi: true,
    hasHotSpring: false,
    hasSpa: false,
    hasParking: false,
    noiseScore: 6,
    cleanScore: 7,
    serviceScore: 7,
    matchScore: 70,
    badge: '格安',
  },
  {
    id: '3',
    name: 'グランドホテル静岡',
    price: 9800,
    rating: 4.4,
    reviews: 312,
    distance: 4.2,
    image: '🏰',
    hasBreakfast: true,
    hasWifi: true,
    hasHotSpring: true,
    hasSpa: false,
    hasParking: true,
    noiseScore: 8,
    cleanScore: 9,
    serviceScore: 9,
    matchScore: 82,
  },
  {
    id: '4',
    name: 'ビジネスホテル駅前',
    price: 4800,
    rating: 3.9,
    reviews: 89,
    distance: 0.3,
    image: '🏢',
    hasBreakfast: false,
    hasWifi: true,
    hasHotSpring: false,
    hasSpa: false,
    hasParking: false,
    noiseScore: 5,
    cleanScore: 7,
    serviceScore: 6,
    matchScore: 65,
    badge: '最寄',
  },
  {
    id: '5',
    name: 'リゾートスパ三島',
    price: 12500,
    rating: 4.8,
    reviews: 421,
    distance: 4.5,
    image: '🌿',
    hasBreakfast: true,
    hasWifi: true,
    hasHotSpring: true,
    hasSpa: true,
    hasParking: true,
    noiseScore: 10,
    cleanScore: 10,
    serviceScore: 10,
    matchScore: 96,
    badge: '人気No.1',
  },
]

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pendingMatchedKeys, setPendingMatchedKeys] = useState<string[]>([])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSearch = async (raw: string, matchedKeys: string[]) => {
    setIsLoading(true)
    setPendingMatchedKeys(matchedKeys)
    setMessages(prev => [...prev, { type: 'user', content: raw }])

    // Thinking
    await new Promise(r => setTimeout(r, 300))
    setMessages(prev => [...prev, { type: 'thinking' }])

    // Criteria
    await new Promise(r => setTimeout(r, 900))
    setMessages(prev => prev.filter(m => m.type !== 'thinking'))
    setMessages(prev => [...prev, { type: 'criteria', query: raw }])

    // Check for missing date
    const hasDate = /今日|今週|来週|\d{4}|\d{1,2}月|\d{1,2}日/.test(raw)
    if (!hasDate) {
      await new Promise(r => setTimeout(r, 400))
      setMessages(prev => [
        ...prev,
        {
          type: 'question',
          question: '宿泊日はいつ頃をご希望ですか?',
          options: ['今日', '今週末', '来週', '日付を指定'],
        },
      ])
      setIsLoading(false)
      return
    }

    // Results
    await new Promise(r => setTimeout(r, 600))
    setMessages(prev => [...prev, { type: 'results', hotels: MOCK_HOTELS, matchedKeys }])
    setIsLoading(false)
  }

  const handleOptionSelect = async (option: string) => {
    setIsLoading(true)
    setMessages(prev => [...prev, { type: 'user', content: option }])
    await new Promise(r => setTimeout(r, 700))
    setMessages(prev => [...prev, { type: 'results', hotels: MOCK_HOTELS, matchedKeys: pendingMatchedKeys }])
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">Rakuten Travel AI</h1>
              <p className="text-[10px] text-muted-foreground leading-tight">セマンティック検索</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">
            意図を理解するホテル検索
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-10">
        {/* ── Search section ── */}
        <section className="space-y-2">
          <h2 className="text-xl font-bold">理想のホテルを見つける</h2>
          <p className="text-sm text-muted-foreground">
            自然な言葉で条件を入力、またはタグをクリックして組み合わせてください
          </p>
          <div className="pt-2">
            <SemanticSearchInput onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </section>

        {/* ── Conversation / results ── */}
        {messages.length > 0 && (
          <section className="space-y-4">
            {messages.map((msg, i) => {
              if (msg.type === 'user') {
                return (
                  <ChatMessage key={i} type="user">
                    <p className="text-sm">{msg.content}</p>
                  </ChatMessage>
                )
              }

              if (msg.type === 'thinking') {
                return (
                  <ChatMessage key={i} type="ai">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-muted-foreground">検索条件を分析中...</span>
                    </div>
                  </ChatMessage>
                )
              }

              if (msg.type === 'criteria') {
                const criteria = parseCriteria(msg.query)
                return (
                  <ChatMessage key={i} type="ai">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">ご希望の条件を理解しました。</p>
                      <ParsedCriteriaDisplay criteria={criteria} />
                    </div>
                  </ChatMessage>
                )
              }

              if (msg.type === 'question') {
                return (
                  <ChatMessage key={i} type="ai">
                    <div className="space-y-3">
                      <p className="text-sm">{msg.question}</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.options.map(opt => (
                          <button
                            key={opt}
                            onClick={() => handleOptionSelect(opt)}
                            disabled={isLoading}
                            className="text-xs px-4 py-2 rounded-xl border border-primary/40 bg-primary/5 text-primary font-medium hover:bg-primary/10 hover:border-primary/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </ChatMessage>
                )
              }

              if (msg.type === 'results') {
                return (
                  <ChatMessage key={i} type="ai">
                    <HotelResultCards hotels={msg.hotels} matchedKeys={msg.matchedKeys} />
                  </ChatMessage>
                )
              }

              return null
            })}
            <div ref={endRef} />
          </section>
        )}

        {/* ── Empty state guidance ── */}
        {messages.length === 0 && (
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">使い方のヒント</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { title: 'タグをクリック', desc: '下のタグをクリックすると検索欄に自動挿入されます' },
                { title: '自由に入力', desc: '認識されたキーワードはハイライト表示されます' },
                { title: 'AIが解釈', desc: 'Enterで検索。AIがあなたの意図をリアルタイムで表示' },
              ].map(h => (
                <div key={h.title} className="p-4 rounded-xl border border-border bg-card space-y-1">
                  <p className="text-sm font-semibold">{h.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
