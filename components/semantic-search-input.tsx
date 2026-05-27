'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Known semantic tags ────────────────────────────────────────────────────────
interface SemanticTag {
  key: string
  label: string       // display label in chip
  pattern: RegExp     // matches in the raw text
  category: string
}

export const SEMANTIC_TAGS: SemanticTag[] = [
  { key: 'onsen',     label: '温泉',       pattern: /温泉|♨/gi,       category: '設備' },
  { key: 'budget',    label: '格安',       pattern: /格安|安い|安め/gi, category: '予算' },
  { key: 'station',   label: '駅近',       pattern: /駅近|駅前|駅周辺/gi, category: 'エリア' },
  { key: 'mishima',   label: '三島駅',     pattern: /三島/gi,           category: 'エリア' },
  { key: 'dist5',     label: '5km以内',    pattern: /5km以内|5km/gi,   category: 'エリア' },
  { key: 'quiet',     label: '静か',       pattern: /静か|閑静|静粛/gi, category: '雰囲気' },
  { key: 'breakfast', label: '朝食付き',   pattern: /朝食/gi,           category: '食事' },
  { key: 'dinner',    label: '夕食付き',   pattern: /夕食|夕飯/gi,      category: '食事' },
  { key: 'wifi',      label: 'WiFi',       pattern: /wifi|wi-fi|ワイファイ/gi, category: '設備' },
  { key: 'ocean',     label: '海が見える', pattern: /海|オーシャン/gi,  category: '雰囲気' },
  { key: 'nature',    label: '自然',       pattern: /自然|山|森/gi,     category: '雰囲気' },
  { key: 'luxury',    label: '高級',       pattern: /高級|贅沢|ラグジュアリー/gi, category: '予算' },
  { key: 'relax',     label: 'リラックス', pattern: /リラックス|癒し|休養/gi, category: '雰囲気' },
  { key: 'business',  label: 'ビジネス',   pattern: /ビジネス|出張/gi,  category: 'エリア' },
  { key: 'double',    label: 'ダブルベッド', pattern: /ダブル/gi,       category: '部屋' },
  { key: 'twin',      label: 'ツインルーム', pattern: /ツイン/gi,       category: '部屋' },
  { key: 'washitsu',  label: '和室',       pattern: /和室/gi,           category: '部屋' },
  { key: 'spa',       label: 'スパ',       pattern: /スパ/gi,           category: '設備' },
  { key: 'parking',   label: '駐車場',     pattern: /駐車場|パーキング/gi, category: '設備' },
]

export const SUGGESTION_TAGS = [
  { key: 'onsen',     label: '♨ 温泉',         insertText: '温泉' },
  { key: 'budget',    label: '¥ 格安',          insertText: '格安' },
  { key: 'station',   label: '駅 駅近',          insertText: '駅近' },
  { key: 'quiet',     label: '月 静か',          insertText: '静か' },
  { key: 'breakfast', label: '朝 朝食付き',      insertText: '朝食付き' },
  { key: 'wifi',      label: '電 WiFi',          insertText: 'WiFi' },
  { key: 'ocean',     label: '波 海が見える',    insertText: '海が見える' },
  { key: 'nature',    label: '木 自然',          insertText: '自然' },
  { key: 'luxury',    label: '星 高級',          insertText: '高級' },
  { key: 'relax',     label: '心 リラックス',    insertText: 'リラックス' },
  { key: 'business',  label: '仕 ビジネス',      insertText: 'ビジネス' },
]

// ── Intent sentence builder ────────────────────────────────────────────────────
export function buildIntentSentence(raw: string, matchedKeys: string[]): string {
  if (!raw.trim() && matchedKeys.length === 0) return ''

  const parts: string[] = []

  const hasKey = (k: string) => matchedKeys.includes(k)

  // Location
  if (hasKey('mishima')) parts.push('三島駅周辺')
  else if (hasKey('station')) parts.push('駅近く')

  // Distance
  if (hasKey('dist5')) parts.push('5km圏内')

  // Features
  const features: string[] = []
  if (hasKey('onsen')) features.push('温泉付き')
  if (hasKey('spa'))   features.push('スパ付き')
  if (hasKey('breakfast')) features.push('朝食込み')
  if (hasKey('dinner'))    features.push('夕食込み')
  if (hasKey('wifi'))  features.push('WiFi完備')
  if (hasKey('parking')) features.push('駐車場あり')

  // Atmosphere
  if (hasKey('quiet'))   features.push('静かな環境')
  if (hasKey('ocean'))   features.push('海の見える')
  if (hasKey('nature'))  features.push('自然豊か')
  if (hasKey('relax'))   features.push('リラックスできる')
  if (hasKey('luxury'))  features.push('高級')
  if (hasKey('budget'))  features.push('お手頃な')
  if (hasKey('business')) features.push('ビジネス向け')

  // Room
  if (hasKey('double'))   features.push('ダブルベッド')
  if (hasKey('twin'))     features.push('ツインルーム')
  if (hasKey('washitsu')) features.push('和室')

  const location = parts.join('・')
  const featureStr = features.join('・')

  if (!location && !featureStr) {
    return `"${raw.trim()}" のホテルをお探しですね。`
  }

  const where = location ? `${location}で` : ''
  const what = featureStr ? `${featureStr}の` : ''

  return `${where}${what}ホテルをお探しですね。`
}

// ── Segment the raw text into plain-text + tag-chip parts ────────────────────
interface Segment {
  type: 'text' | 'tag'
  text: string
  key?: string
  label?: string
}

function segmentText(raw: string): { segments: Segment[]; matchedKeys: string[] } {
  if (!raw) return { segments: [], matchedKeys: [] }

  // Build replacement map: [start, end) → tag
  const matches: Array<{ start: number; end: number; tag: SemanticTag }> = []
  for (const tag of SEMANTIC_TAGS) {
    tag.pattern.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = tag.pattern.exec(raw)) !== null) {
      // avoid overlapping
      const overlaps = matches.some(
        ex => !(m!.index >= ex.end || m!.index + m![0].length <= ex.start)
      )
      if (!overlaps) {
        matches.push({ start: m.index, end: m.index + m[0].length, tag })
      }
    }
  }
  matches.sort((a, b) => a.start - b.start)

  const segments: Segment[] = []
  const matchedKeys: string[] = []
  let cursor = 0

  for (const { start, end, tag } of matches) {
    if (start > cursor) {
      segments.push({ type: 'text', text: raw.slice(cursor, start) })
    }
    segments.push({ type: 'tag', text: raw.slice(start, end), key: tag.key, label: tag.label })
    if (!matchedKeys.includes(tag.key)) matchedKeys.push(tag.key)
    cursor = end
  }
  if (cursor < raw.length) {
    segments.push({ type: 'text', text: raw.slice(cursor) })
  }

  return { segments, matchedKeys }
}

// ── Props ──────────────────────────────────────────────────────────────────────
interface SemanticSearchInputProps {
  onSearch: (raw: string, matchedKeys: string[]) => void
  isLoading?: boolean
}

// ── Component ─────────────────────────────────────────────────────────────────
export function SemanticSearchInput({ onSearch, isLoading = false }: SemanticSearchInputProps) {
  const PREFILL = '三島駅 5km以内 朝食付き'
  const [raw, setRaw] = useState(PREFILL)
  const [justInserted, setJustInserted] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { segments, matchedKeys } = segmentText(raw)
  const intentSentence = buildIntentSentence(raw, matchedKeys)

  const insertTag = useCallback((text: string) => {
    setRaw(prev => {
      const trimmed = prev.trimEnd()
      // avoid duplicate
      if (trimmed.includes(text)) return prev
      return trimmed ? `${trimmed} ${text} ` : `${text} `
    })
    setJustInserted(text)
    setTimeout(() => setJustInserted(null), 800)
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!raw.trim() || isLoading) return
    onSearch(raw.trim(), matchedKeys)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit(e)
  }

  // Mirror layer measures the input width for overlay
  const [inputWidth, setInputWidth] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!wrapperRef.current) return
    const ro = new ResizeObserver(() => {
      setInputWidth(wrapperRef.current?.offsetWidth ?? 0)
    })
    ro.observe(wrapperRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="space-y-4">
      {/* ── Search bar ── */}
      <form onSubmit={handleSubmit}>
        <div
          ref={wrapperRef}
          className="relative flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-border bg-card shadow-sm focus-within:border-primary focus-within:shadow-md transition-all"
        >
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />

          {/* Highlight overlay (pointer-events:none so real input is clickable) */}
          <div
            className="absolute left-13 right-14 top-0 bottom-0 flex items-center overflow-hidden pointer-events-none select-none"
            aria-hidden
            style={{ paddingTop: '12px', paddingBottom: '12px' }}
          >
            <div className="flex flex-wrap gap-1 items-center text-sm font-normal leading-6" style={{ width: inputWidth }}>
              {segments.map((seg, i) =>
                seg.type === 'text' ? (
                  <span key={i} className="text-transparent whitespace-pre">{seg.text}</span>
                ) : (
                  <span
                    key={i}
                    className={cn(
                      'inline-flex items-center gap-0.5 px-1.5 py-0 rounded-md text-xs font-semibold leading-5 transition-all',
                      seg.key === justInserted?.toLowerCase().replace(/\s+/g, '')
                        ? 'bg-primary text-primary-foreground scale-105'
                        : 'bg-primary/15 text-primary'
                    )}
                  >
                    {seg.label}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Actual invisible text input on top */}
          <input
            ref={inputRef}
            type="text"
            value={raw}
            onChange={e => setRaw(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="例: 三島駅 5km以内 朝食付き 温泉 静か"
            className="flex-1 bg-transparent text-transparent caret-foreground selection:bg-primary/25 outline-none text-sm leading-6 placeholder:text-muted-foreground placeholder:text-opacity-100 disabled:cursor-not-allowed min-w-0"
            style={{ caretColor: 'var(--color-foreground)' }}
            autoComplete="off"
            spellCheck={false}
          />

          {raw && (
            <button
              type="button"
              onClick={() => setRaw('')}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="クリア"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={!raw.trim() || isLoading}
            className="shrink-0 px-5 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '検索中...' : '検索'}
          </button>
        </div>
      </form>

      {/* ── Tag suggestion panel ── */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTION_TAGS.map(tag => {
          const active = matchedKeys.includes(tag.key)
          return (
            <button
              key={tag.key}
              type="button"
              onClick={() => insertTag(tag.insertText)}
              className={cn(
                'text-xs font-medium px-3 py-1.5 rounded-full border transition-all',
                active
                  ? 'bg-primary/10 text-primary border-primary/50 scale-105'
                  : 'border-border text-foreground bg-background hover:border-primary/40 hover:bg-primary/5'
              )}
            >
              {tag.label}
            </button>
          )
        })}
      </div>

      {/* ── Real-time intent preview ── */}
      {intentSentence && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-primary/5 border border-primary/15">
          <div className="mt-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground text-[10px] font-bold">AI</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-semibold text-primary">意図:</span>{' '}
            {intentSentence}
          </p>
        </div>
      )}
    </div>
  )
}
