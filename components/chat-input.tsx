'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, ChevronDown, ChevronUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading?: boolean
  placeholder?: string
}



const TAG_GROUPS: TagGroup[] = [
  {
    label: 'エリア',
    tags: [
      { label: '三島駅近く', value: '三島駅 5km以内' },
      { label: '駅前', value: '駅前' },
      { label: '箱根エリア', value: '箱根エリア' },
      { label: '静岡市内', value: '静岡市内' },
    ],
  },
  {
    label: '食事',
    tags: [
      { label: '朝食付き', value: '朝食付き' },
      { label: '夕食付き', value: '夕食付き' },
      { label: '2食付き', value: '2食付き' },
      { label: '食事なし', value: '食事なし' },
    ],
  },
  {
    label: '部屋',
    tags: [
      { label: 'ダブルベッド', value: 'ダブルベッド' },
      { label: 'ツインルーム', value: 'ツインルーム' },
      { label: '和室', value: '和室' },
      { label: '禁煙室', value: '禁煙室' },
    ],
  },
  {
    label: '設備',
    tags: [
      { label: 'WiFi完備', value: 'WiFi完備' },
      { label: '温泉・スパ', value: '温泉スパ完備' },
      { label: '駐車場あり', value: '駐車場あり' },
      { label: 'ペット可', value: 'ペット可' },
    ],
  },
  {
    label: '予算',
    tags: [
      { label: '格安 〜¥5,000', value: '格安 予算5000円以下' },
      { label: 'お手頃 〜¥10,000', value: '予算1万円以下' },
      { label: '贅沢 ¥15,000〜', value: '贅沢 予算1万5千円以上' },
    ],
  },
]

export function ChatInput({ onSend, isLoading = false, placeholder }: ChatInputProps) {
  const [text, setText] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagsOpen, setTagsOpen] = useState(false)
  const [activeGroup, setActiveGroup] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [text])

  const toggleTag = (value: string) => {
    setSelectedTags(prev =>
      prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
    )
  }

  const removeTag = (value: string) => {
    setSelectedTags(prev => prev.filter(t => t !== value))
  }

  const buildMessage = () => {
    const parts = [...selectedTags]
    if (text.trim()) parts.push(text.trim())
    return parts.join(' ')
  }

  const canSend = (selectedTags.length > 0 || text.trim().length > 0) && !isLoading

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = buildMessage()
    if (message && !isLoading) {
      onSend(message)
      setText('')
      setSelectedTags([])
      setTagsOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="border-t border-border bg-background">

        {/* Tag Panel */}
        {tagsOpen && (
          <div className="px-4 pt-3 pb-2 space-y-3 border-b border-border bg-secondary/20">
            {/* Group Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {TAG_GROUPS.map((group, i) => (
                <button
                  key={group.label}
                  type="button"
                  onClick={() => setActiveGroup(i)}
                  className={cn(
                    'shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-all',
                    activeGroup === i
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-background'
                  )}
                >
                  {group.label}
                </button>
              ))}
            </div>

            {/* Tags in active group */}
            <div className="flex flex-wrap gap-2">
              {TAG_GROUPS[activeGroup].tags.map((tag) => {
                const active = selectedTags.includes(tag.value)
                return (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() => toggleTag(tag.value)}
                    className={cn(
                      'text-xs font-medium px-3 py-1.5 rounded-full border transition-all',
                      active
                        ? 'bg-primary/10 text-primary border-primary/50'
                        : 'border-border text-foreground hover:border-primary/30 hover:bg-primary/5 bg-background'
                    )}
                  >
                    {active && <span className="mr-1">✓</span>}
                    {tag.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Selected Tags Preview */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-4 pt-3">
            {selectedTags.map((value) => {
              const tag = TAG_GROUPS.flatMap(g => g.tags).find(t => t.value === value)
              return (
                <span
                  key={value}
                  className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/30 rounded-full px-2.5 py-1 font-medium"
                >
                  {tag?.label ?? value}
                  <button
                    type="button"
                    onClick={() => removeTag(value)}
                    className="hover:text-primary/60 transition-colors ml-0.5"
                    aria-label={`${tag?.label}を削除`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )
            })}
          </div>
        )}

        {/* Input Row */}
        <div className="flex items-end gap-2 px-4 py-3">
          {/* Tag Toggle Button */}
          <button
            type="button"
            onClick={() => setTagsOpen(v => !v)}
            className={cn(
              'shrink-0 h-10 w-10 rounded-full border flex items-center justify-center transition-all',
              tagsOpen
                ? 'bg-primary/10 border-primary/50 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground bg-background'
            )}
            aria-label="条件タグを追加"
          >
            {tagsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
              placeholder={selectedTags.length > 0 ? '他の条件を追加...' : (placeholder ?? '条件を入力またはタグで選択...')}
              className="w-full resize-none px-4 py-2.5 rounded-2xl border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm leading-relaxed"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            size="icon"
            disabled={!canSend}
            className="shrink-0 h-10 w-10 rounded-full"
          >
            <Send className="w-4 h-4" />
            <span className="sr-only">送信</span>
          </Button>
        </div>
      </div>
    </form>
  )
}
