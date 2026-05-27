'use client'

import { useState, useRef } from 'react'
import { X, Search, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Tag {
  id: string
  label: string
  icon: string
  category: 'amenity' | 'location' | 'atmosphere' | 'budget' | 'food' | 'facility'
  dimensionKeys?: string[]
}

export const ALL_TAGS: Tag[] = [
  // amenity
  { id: 'wifi',       label: 'Free WiFi',      icon: '📶', category: 'amenity',    dimensionKeys: ['wifi'] },
  { id: 'hotspring',  label: '温泉',            icon: '♨',  category: 'amenity',    dimensionKeys: ['hotSpring', 'noiseScore'] },
  { id: 'spa',        label: 'スパ',            icon: '🧘', category: 'amenity',    dimensionKeys: ['spa', 'serviceScore'] },
  { id: 'parking',    label: '駐車場',          icon: '🅿️', category: 'facility',   dimensionKeys: ['parking'] },
  { id: 'pool',       label: 'プール',          icon: '🏊', category: 'facility',   dimensionKeys: ['serviceScore'] },
  { id: 'gym',        label: 'ジム',            icon: '💪', category: 'facility',   dimensionKeys: ['serviceScore'] },
  { id: 'pets',       label: 'ペット可',        icon: '🐾', category: 'facility',   dimensionKeys: ['serviceScore'] },
  // food
  { id: 'breakfast',  label: '朝食付き',        icon: '🍳', category: 'food',       dimensionKeys: ['breakfast', 'matchScore'] },
  { id: 'dinner',     label: '夕食付き',        icon: '🍽', category: 'food',       dimensionKeys: ['serviceScore'] },
  { id: 'bar',        label: 'バー・ラウンジ',  icon: '🍸', category: 'food',       dimensionKeys: ['serviceScore'] },
  // location
  { id: 'station',    label: '駅近',            icon: '🚉', category: 'location',   dimensionKeys: ['distance'] },
  { id: 'airport',    label: '空港近く',        icon: '✈️', category: 'location',   dimensionKeys: ['distance'] },
  { id: 'ocean',      label: 'オーシャンビュー',icon: '🌊', category: 'location',   dimensionKeys: ['noiseScore'] },
  { id: 'mountain',   label: '山・自然',        icon: '🏔', category: 'location',   dimensionKeys: ['noiseScore'] },
  { id: 'city',       label: '都市中心部',      icon: '🏙', category: 'location',   dimensionKeys: ['distance'] },
  { id: 'resort',     label: 'リゾート',        icon: '🏖', category: 'location',   dimensionKeys: ['serviceScore', 'noiseScore'] },
  // atmosphere
  { id: 'quiet',      label: '静かな環境',      icon: '🌙', category: 'atmosphere', dimensionKeys: ['noiseScore', 'matchScore'] },
  { id: 'luxury',     label: 'ラグジュアリー',  icon: '💎', category: 'atmosphere', dimensionKeys: ['rating', 'serviceScore'] },
  { id: 'romantic',   label: 'ロマンティック',  icon: '🕯', category: 'atmosphere', dimensionKeys: ['rating', 'cleanScore'] },
  { id: 'family',     label: 'ファミリー向け',  icon: '👨‍👩‍👧', category: 'atmosphere', dimensionKeys: ['serviceScore'] },
  { id: 'business',   label: 'ビジネス向け',   icon: '👨‍💼', category: 'atmosphere', dimensionKeys: ['wifi', 'distance'] },
  { id: 'nature',     label: '自然・癒し',      icon: '🌿', category: 'atmosphere', dimensionKeys: ['noiseScore', 'cleanScore'] },
  // budget
  { id: 'budget',     label: '格安',            icon: '💰', category: 'budget',     dimensionKeys: ['price', 'matchScore'] },
  { id: 'midrange',   label: 'コスパ重視',      icon: '💴', category: 'budget',     dimensionKeys: ['price', 'rating'] },
  { id: 'premium',    label: 'プレミアム',      icon: '✨', category: 'budget',     dimensionKeys: ['rating', 'serviceScore'] },
]

const CATEGORIES: { key: Tag['category']; label: string }[] = [
  { key: 'amenity',    label: '設備' },
  { key: 'food',       label: '食事' },
  { key: 'location',   label: 'エリア' },
  { key: 'atmosphere', label: '雰囲気' },
  { key: 'budget',     label: '予算' },
  { key: 'facility',   label: 'その他' },
]

const PREFECTURES = ['東京都', '神奈川県', '静岡県', '京都府', '大阪府', '北海道', '沖縄県', '福岡県', '愛知県', '広島県']
const AREAS: Record<string, string[]> = {
  '東京都':  ['新宿', '渋谷', '品川', '銀座', '浅草', '秋葉原'],
  '神奈川県': ['横浜', '川崎', '箱根', '鎌倉', '小田原'],
  '静岡県':  ['三島', '熱海', '伊豆', '浜松', '静岡市'],
  '京都府':  ['京都市', '嵐山', '祇園', '伏見'],
  '大阪府':  ['梅田', '難波', '心斎橋', '天王寺'],
  '北海道':  ['札幌', '函館', '旭川', '富良野'],
  '沖縄県':  ['那覇', '恩納村', '石垣島', '宮古島'],
  '福岡県':  ['博多', '天神', '小倉'],
  '愛知県':  ['名古屋', '豊田', '岡崎'],
  '広島県':  ['広島市', '福山', '宮島'],
}

interface TagPoolBuilderProps {
  onSearch: (tags: Tag[], prefecture: string, area: string) => void
}

export function TagPoolBuilder({ onSearch }: TagPoolBuilderProps) {
  const [activeCategory, setActiveCategory] = useState<Tag['category'] | 'all'>('all')
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [dragOverZone, setDragOverZone] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [prefecture, setPrefecture] = useState('')
  const [area, setArea] = useState('')
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const filteredTags = activeCategory === 'all'
    ? ALL_TAGS
    : ALL_TAGS.filter(t => t.category === activeCategory)

  const toggleTag = (tag: Tag) => {
    setSelectedTags(prev => {
      if (prev.find(t => t.id === tag.id)) return prev.filter(t => t.id !== tag.id)
      return [...prev, tag]
    })
  }

  const removeTag = (id: string) => setSelectedTags(prev => prev.filter(t => t.id !== id))

  const handleDragStart = (e: React.DragEvent, tag: Tag) => {
    e.dataTransfer.setData('tagId', tag.id)
    setDraggingId(tag.id)
  }

  const handleDragEnd = () => setDraggingId(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverZone(false)
    const tagId = e.dataTransfer.getData('tagId')
    const tag = ALL_TAGS.find(t => t.id === tagId)
    if (tag && !selectedTags.find(t => t.id === tag.id)) {
      setSelectedTags(prev => [...prev, tag])
    }
  }

  const canSearch = selectedTags.length > 0 && prefecture !== ''

  return (
    <div className="flex flex-col lg:flex-row gap-0 h-full min-h-[calc(100vh-56px)]">

      {/* ── Left Panel: Tag Pool ── */}
      <div className="flex-1 lg:max-w-[56%] flex flex-col border-r border-border bg-background">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">条件タグ</h2>
          <p className="text-xs text-muted-foreground mt-0.5">タグをドラッグ、またはタップして右の検索プランに追加</p>
        </div>

        {/* Category filter tabs */}
        <div className="flex gap-1 px-4 py-3 overflow-x-auto border-b border-border shrink-0">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'shrink-0 text-xs px-3 py-1.5 rounded-md font-medium transition-all',
              activeCategory === 'all'
                ? 'bg-foreground text-background'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            )}
          >
            すべて
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                'shrink-0 text-xs px-3 py-1.5 rounded-md font-medium transition-all',
                activeCategory === cat.key
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tag grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-wrap gap-2">
            {filteredTags.map(tag => {
              const isSelected = !!selectedTags.find(t => t.id === tag.id)
              const isDragging = draggingId === tag.id
              return (
                <div
                  key={tag.id}
                  draggable
                  onDragStart={e => handleDragStart(e, tag)}
                  onDragEnd={handleDragEnd}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium cursor-grab active:cursor-grabbing select-none transition-all duration-150',
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-background border-border text-foreground hover:border-primary/50 hover:shadow-sm hover:scale-[1.03]',
                    isDragging && 'opacity-40 scale-95'
                  )}
                >
                  <span className="text-sm leading-none">{tag.icon}</span>
                  <span>{tag.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Right Panel: Search Builder ── */}
      <div className="flex-1 lg:max-w-[44%] flex flex-col bg-secondary/20">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">検索プラン</h2>
          <p className="text-xs text-muted-foreground mt-0.5">タグを選択後、エリアを指定して検索</p>
        </div>

        <div className="flex-1 flex flex-col gap-5 p-5 overflow-y-auto">

          {/* Drop zone */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">選択した条件</p>
            <div
              ref={dropZoneRef}
              onDragOver={e => { e.preventDefault(); setDragOverZone(true) }}
              onDragLeave={() => setDragOverZone(false)}
              onDrop={handleDrop}
              className={cn(
                'min-h-[120px] rounded-xl border-2 border-dashed p-4 transition-all duration-200',
                dragOverZone
                  ? 'border-primary bg-primary/5 scale-[1.01]'
                  : selectedTags.length > 0
                    ? 'border-border bg-background'
                    : 'border-border/50 bg-background/50'
              )}
            >
              {selectedTags.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground pointer-events-none">
                  <span className="text-2xl opacity-30">↙</span>
                  <p className="text-xs text-center">左のタグをここにドロップ<br />またはタップして追加</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tag => (
                    <div
                      key={tag.id}
                      className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-medium text-primary"
                    >
                      <span>{tag.icon}</span>
                      <span>{tag.label}</span>
                      <button
                        onClick={() => removeTag(tag.id)}
                        className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Location selectors */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              エリア指定 <span className="text-primary">*必須</span>
            </p>

            {/* Prefecture */}
            <div className="relative">
              <select
                value={prefecture}
                onChange={e => { setPrefecture(e.target.value); setArea('') }}
                className="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors cursor-pointer pr-8"
              >
                <option value="">都道府県を選択</option>
                {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Area (dependent) */}
            <div className="relative">
              <select
                value={area}
                onChange={e => setArea(e.target.value)}
                disabled={!prefecture}
                className="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed pr-8"
              >
                <option value="">市区町村・エリアを選択</option>
                {(AREAS[prefecture] ?? []).map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Summary */}
          {selectedTags.length > 0 && prefecture && (
            <div className="rounded-xl bg-background border border-border p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">検索プレビュー</p>
              <p className="text-sm text-foreground leading-relaxed">
                <span className="font-semibold text-primary">{prefecture}{area && ` › ${area}`}</span>
                {' '}で{' '}
                {selectedTags.map(t => t.label).join('・')}
                {' '}のホテルを検索
              </p>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => canSearch && onSearch(selectedTags, prefecture, area)}
            disabled={!canSearch}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
              canSearch
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg active:scale-[0.98]'
                : 'bg-secondary text-muted-foreground cursor-not-allowed'
            )}
          >
            <Search className="w-4 h-4" />
            ホテルを検索する
          </button>

          {!canSearch && (
            <p className="text-xs text-muted-foreground text-center -mt-2">
              {selectedTags.length === 0
                ? 'タグを1つ以上選択してください'
                : '都道府県を選択してください'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
