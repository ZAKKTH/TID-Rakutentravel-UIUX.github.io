'use client'

import { useState } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading?: boolean
  placeholder?: string
}

export function ChatInput({ onSend, isLoading = false, placeholder }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSend(message)
      setMessage('')
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
      <div className="flex items-end gap-3 p-4 bg-background border-t border-border">
        <div className="relative flex-1">
          <textarea
            placeholder={placeholder || '条件を入力してください...'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            className="w-full resize-none px-4 py-3 pr-12 rounded-2xl border border-border bg-secondary/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <div className="absolute right-3 bottom-2.5">
            <Sparkles className="w-4 h-4 text-muted-foreground/50" />
          </div>
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isLoading}
          className="h-12 w-12 rounded-full shrink-0"
        >
          <Send className="w-5 h-5" />
          <span className="sr-only">送信</span>
        </Button>
      </div>
    </form>
  )
}
