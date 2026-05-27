'use client'

import { useRef, useCallback } from 'react'
import { X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SemanticTag {
  id: string
  label: string
  value: string
  color: string
}

const TAG_DEFINITIONS: SemanticTag[] = [
  { id: 'hotspring',  label: '温泉',        value: '温泉',        color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'budget',     label: '格安',        value: '格安',        color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'station',    label: '駅近',        value: '駅近',        color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'quiet',      label: '静か',        value: '静か',        color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { id: 'breakfast',  label: '朝食付き',    value: '朝食付き',    color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'wifi',       label: 'WiFi無料',    value: 'WiFi無料',    color: 'bg-sky-100 text-sky-700 border-sky-200' },
  { id: 'ocean',      label: '海が見える',  value: '海が見える',  color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  { id: 'nature',     label: '自然豊か',    value: '自然豊か',    color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'luxury',     label: '贅沢',        value: '贅沢',        color: 'bg-violet-100 text-violet-700 border-violet-200' },
  { id: 'relaxation', label: 'リラックス',  value: 'リラックス',  color: 'bg-pink-100 text-pink-700 border-pink-200' },
  { id: 'business',   label: 'ビジネス向け', value: 'ビジネス向け', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { id: 'parking',    label: '駐車場あり',  value: '駐車場あり',  color: 'bg-stone-100 text-stone-700 border-stone-200' },
  { id: 'spa',        label: 'スパ',        value: 'スパ',        color: 'bg-rose-100 text-rose-700 border-rose-200' },
  { id: '5km',        label: '5km以内',     value: '5km以内',     color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
]

export { TAG_DEFINITIONS }

interface Token {
  type: 'text' | 'tag'
  value: string
  tagDef?: SemanticTag
  key: string
}

function tokenize(text: string): Token[] {
  const tokens: Token[] = []
  let remaining = text
  let idx = 0

  while (remaining.length > 0) {
    let matched = false
    for (const tag of TAG_DEFINITIONS) {
      if (remaining.startsWith(tag.value)) {
        tokens.push({ type: 'tag', value: tag.value, tagDef: tag, key: `tag-${idx}` })
        remaining = remaining.slice(tag.value.length)
        idx++
        matched = true
        break
      }
    }
    if (!matched) {
      // Group non-tag chars into text token
      const lastToken = tokens[tokens.length - 1]
      if (lastToken?.type === 'text') {
        lastToken.value += remaining[0]
      } else {
        tokens.push({ type: 'text', value: remaining[0], key: `text-${idx}` })
        idx++
      }
      remaining = remaining.slice(1)
    }
  }
  return tokens
}

interface SemanticInputProps {
  value: string
  onChange: (val: string) => void
  onSearch: (val: string) => void
  isLoading?: boolean
  placeholder?: string
}

export function SemanticInput({ value, onChange, onSearch, isLoading, placeholder }: SemanticInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const tokens = tokenize(value)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && value.trim()) {
      onSearch(value.trim())
    }
  }

  const removeTag = useCallback((tagValue: string) => {
    onChange(value.replace(tagValue, '').replace(/\s+/g, ' ').trim())
    inputRef.current?.focus()
  }, [value, onChange])

  const isEmpty = value.trim() === ''

  return (
    <div
      className={cn(
        'flex items-center gap-2 min-h-[52px] w-full px-3 py-2 rounded-xl border-2 bg-background cursor-text transition-colors',
        'border-border focus-within:border-primary',
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Token display */}
      <div className="flex flex-wrap items-center gap-1 flex-1 min-w-0">
        {tokens.map((token) =>
          token.type === 'tag' && token.tagDef ? (
            <span
              key={token.key}
              className={cn(
                'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md border text-xs font-medium shrink-0 animate-in fade-in',
                token.tagDef.color
              )}
            >
              {token.tagDef.label}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeTag(token.value) }}
                className="hover:opacity-70 transition-opacity ml-0.5"
                tabIndex={-1}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ) : (
            <span key={token.key} className="text-sm text-foreground">
              {token.value}
            </span>
          )
        )}

        {/* Actual invisible input overlaid */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            'absolute opacity-0 inset-0 w-full h-full cursor-text',
          )}
          placeholder={isEmpty ? placeholder : ''}
          disabled={isLoading}
          aria-label="ホテル検索"
        />

        {/* Placeholder shown when empty */}
        {isEmpty && (
          <span className="text-sm text-muted-foreground pointer-events-none select-none">
            {placeholder}
          </span>
        )}
      </div>

      {/* Search button */}
      <button
        type="button"
        onClick={() => { if (!isLoading && value.trim()) onSearch(value.trim()) }}
        disabled={isLoading || isEmpty}
        className={cn(
          'shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all',
          isLoading || isEmpty
            ? 'bg-border text-muted-foreground cursor-not-allowed'
            : 'bg-primary text-primary-foreground hover:opacity-90 active:scale-95'
        )}
        aria-label="検索"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Search className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}
