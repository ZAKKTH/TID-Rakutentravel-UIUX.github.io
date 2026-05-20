'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { TagPoolBuilder, type Tag } from '@/components/tag-pool-builder'
import { SearchResultsView } from '@/components/search-results-view'

type Phase = 'builder' | 'loading' | 'results'

interface SearchState {
  tags: Tag[]
  prefecture: string
  area: string
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>('builder')
  const [search, setSearch] = useState<SearchState | null>(null)

  const handleSearch = async (tags: Tag[], prefecture: string, area: string) => {
    setSearch({ tags, prefecture, area })
    setPhase('loading')
    // Simulate search latency
    await new Promise(r => setTimeout(r, 1400))
    setPhase('results')
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">

      {/* Header */}
      <header className="shrink-0 h-14 border-b border-border bg-background/95 backdrop-blur z-40 flex items-center px-5">
        <div className="flex items-center gap-2.5 flex-1">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <div className="leading-none">
            <p className="text-sm font-bold tracking-tight">Rakuten Travel AI</p>
            <p className="text-[10px] text-muted-foreground">One-shot Tag Search</p>
          </div>
        </div>

        {/* Phase indicator */}
        <div className="flex items-center gap-3">
          {(['builder', 'results'] as const).map((p, i) => (
            <div key={p} className="flex items-center gap-1.5">
              <div className={[
                'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all',
                phase === 'results' || (phase === 'loading' && p === 'builder')
                  ? p === 'builder'
                    ? 'bg-foreground text-background border-foreground'
                    : phase === 'results' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'
                  : p === 'builder'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground'
              ].join(' ')}>
                {i + 1}
              </div>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {p === 'builder' ? '条件設定' : '検索結果'}
              </span>
              {i === 0 && (
                <span className="text-muted-foreground/40 text-xs mx-0.5 hidden sm:inline">›</span>
              )}
            </div>
          ))}
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 overflow-hidden relative">

        {/* Builder phase */}
        {(phase === 'builder' || phase === 'loading') && (
          <div className={[
            'h-full transition-all duration-500',
            phase === 'loading' ? 'opacity-30 pointer-events-none scale-[0.99]' : 'opacity-100 scale-100'
          ].join(' ')}>
            <TagPoolBuilder onSearch={handleSearch} />
          </div>
        )}

        {/* Loading overlay */}
        {phase === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-10">
            <div className="w-14 h-14 rounded-2xl bg-background border border-border shadow-xl flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-foreground">検索中...</p>
              <p className="text-xs text-muted-foreground">
                {search?.tags.map(t => t.label).join(' · ')} を分析しています
              </p>
            </div>
            {/* Tag progress chips */}
            {search && (
              <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                {search.tags.map((tag, i) => (
                  <span
                    key={tag.id}
                    className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {tag.icon} {tag.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results phase */}
        {phase === 'results' && search && (
          <div className="h-full overflow-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <SearchResultsView
              tags={search.tags}
              prefecture={search.prefecture}
              area={search.area}
            />
          </div>
        )}
      </main>
    </div>
  )
}
