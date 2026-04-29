'use client'

import { useState, useEffect } from 'react'
import { SearchInput } from '@/components/search-input'
import { HotelGrid } from '@/components/hotel-grid'
import { CriteriaParser } from '@/components/criteria-parser'
import { EssentialQuestions } from '@/components/essential-questions'

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

const mockHotels: Record<string, Hotel[]> = {
  default: [
    {
      id: '1',
      name: 'プレミアムシティホテル三島',
      distance: 2.5,
      rating: 4.6,
      reviews: 248,
      price: 8500,
      image: '🏨',
      amenities: ['WiFi', 'Breakfast', 'AC'],
      description: '三島駅から徒歩5分。モダンな客室設備とビジネス向け設施が充実。朝食は日本料理とフレンチが選べます。',
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
      description: 'アクセスが良く、リーズナブルな価格が魅力。シングルからダブルまで様々なお部屋タイプがあります。',
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
      description: '高級感あふれるホテル。温泉大浴場完備で、ビジネスと観光どちらにも対応しています。',
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
      description: '三島駅から最も近いホテル。シンプルで清潔な客室が特徴。低価格で駅前ロケーション。',
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
      description: 'スパ施設完備の高級ホテル。自然に囲まれた環境で、ゆったり時間が過ごせます。',
    },
    {
      id: '6',
      name: 'コンフォートインミシマ',
      distance: 2.0,
      rating: 4.3,
      reviews: 203,
      price: 7200,
      image: '🏨',
      amenities: ['WiFi', 'Breakfast'],
      description: '清潔で快適な客室が評判。スタッフの対応も丁寧で、リピーター率が高いホテルです。',
    },
  ],
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<Hotel[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    setIsLoading(true)
    setHasSearched(true)

    // Simulate API call with 800ms delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Return all mock hotels (in a real app, this would filter based on the query)
    setResults(mockHotels.default)
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <div>
              <h1 className="font-bold text-lg">Rakuten Travel AI</h1>
              <p className="text-xs text-muted-foreground">セマンティック検索で理想のホテルを探す</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-balance">
                1行入力で理想のホテルが見つかる
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                思考をそのまま入力。AIが意図を理解して、最適な宿泊施設を即座に提案します。会話を重ねる必要はありません。
              </p>
            </div>

            <div className="max-w-2xl">
              <SearchInput onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Example queries - emphasizing one-shot semantic input */}
            <div className="space-y-3">
              <p className="text-xs uppercase font-bold text-muted-foreground">試してみる</p>
              <div className="flex flex-wrap gap-2">
                {[
                  '三島駅 5km以内 朝食付き ダブルベッド',
                  '駅前の格安ホテル WiFi完備',
                  '温泉スパ完備 贅沢な環境',
                  '今週末 お手頃価格 3つ星以上',
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => handleSearch(example)}
                    className="text-xs px-3 py-2 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all text-foreground font-medium"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {hasSearched && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {searchQuery && (
            <div className="mb-6 space-y-4">
              <div>
                <p className="text-xs uppercase font-bold text-muted-foreground mb-2">検索クエリ</p>
                <p className="text-2xl font-bold text-balance">
                  {searchQuery}
                </p>
              </div>
            </div>
          )}

          {/* Criteria Parser - shows AI's semantic understanding */}
          {searchQuery && <CriteriaParser query={searchQuery} />}

          {/* Essential questions if needed */}
          {searchQuery && !searchQuery.toLowerCase().includes('日') && (
            <EssentialQuestions onAnswered={(answer) => {
              setSearchQuery(searchQuery + ' ' + answer)
            }} />
          )}

          {!isLoading && results.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-muted-foreground">
                {results.length}件のおすすめ宿泊施設
              </p>
            </div>
          )}

          <HotelGrid hotels={results} isLoading={isLoading} />
        </section>
      )}

      {/* Features Section - Kaizen principles */}
      {!hasSearched && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="space-y-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Kaizen改善で実現する高速検索</h3>
              <p className="text-muted-foreground max-w-2xl">従来の会話型AIの冗長なやり取りを排除。思考をそのまま入力できるUIで、検索から予約までの時間を大幅短縮します。</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: '1行で条件指定',
                  description: 'セマンティック検索により、細かいフィルター設定不要。自然な文章で全条件を一度に伝えられます。',
                  icon: '📝',
                },
                {
                  title: '即座に結果表示',
                  description: '複数ターンの会話なし。入力直後にAIが意図を理解し、最適なホテルを瞬時に提案します。',
                  icon: '⚡',
                },
                {
                  title: '最小限の質問',
                  description: '不足情報は必要な時だけ。選択式の簡潔な質問で、認知負荷を最小化します。',
                  icon: '❓',
                },
              ].map((feature) => (
                <div key={feature.title} className="space-y-3 p-4 rounded-lg border border-border bg-secondary/30">
                  <div className="text-4xl">{feature.icon}</div>
                  <h4 className="font-semibold text-lg">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 Rakuten Travel AI. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">プライバシー</a>
              <a href="#" className="hover:text-foreground transition-colors">利用規約</a>
              <a href="#" className="hover:text-foreground transition-colors">お問い合わせ</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
