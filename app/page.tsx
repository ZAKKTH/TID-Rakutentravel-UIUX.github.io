'use client'

import { useState, useEffect } from 'react'
import { SearchInput } from '@/components/search-input'
import { HotelGrid } from '@/components/hotel-grid'

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
                自然言語で旅行を計画
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                条件や想いをそのまま入力すれば、AIが理想のホテルを見つけ出します。従来の細かい検索フィルターは必要ありません。
              </p>
            </div>

            <div className="max-w-2xl">
              <SearchInput onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Example queries */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">例：</p>
              <div className="flex flex-wrap gap-2">
                {[
                  '三島駅近く、朝食付き',
                  'ダブルベッド、WiFi完備',
                  '静かな環境、スパ付き',
                  '格安で駅前',
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => handleSearch(example)}
                    className="text-sm px-3 py-1.5 rounded-full border border-border bg-background hover:bg-secondary transition-colors text-foreground"
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
            <div className="mb-8 space-y-2">
              <p className="text-sm text-muted-foreground">検索クエリ</p>
              <p className="text-xl font-semibold text-balance">
                {searchQuery}
              </p>
              {!isLoading && results.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {results.length}件の検索結果
                </p>
              )}
            </div>
          )}

          <HotelGrid hotels={results} isLoading={isLoading} />
        </section>
      )}

      {/* Features Section */}
      {!hasSearched && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'セマンティック検索',
                description: '自然な言葉で検索。AIが意図を理解して最適な結果を表示します。',
                icon: '🧠',
              },
              {
                title: '瞬間的な結果',
                description: '複雑な条件を一度に指定。AIが全てを分析して理想のホテルを提案。',
                icon: '⚡',
              },
              {
                title: '信頼できる情報',
                description: '楽天トラベルの実際のホテル情報。評価や口コミも確認できます。',
                icon: '⭐',
              },
            ].map((feature) => (
              <div key={feature.title} className="space-y-3">
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
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
