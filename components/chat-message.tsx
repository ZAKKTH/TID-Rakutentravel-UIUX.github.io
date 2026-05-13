'use client'

import { cn } from '@/lib/utils'

interface ChatMessageProps {
  type: 'user' | 'ai'
  children: React.ReactNode
  className?: string
}

export function ChatMessage({ type, children, className }: ChatMessageProps) {
  return (
    <div
      className={cn(
        'flex w-full',
        type === 'user' ? 'justify-end' : 'justify-start',
        className
      )}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3',
          type === 'user'
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-secondary text-foreground rounded-bl-md'
        )}
      >
        {type === 'ai' && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs">AI</span>
            </div>
            <span className="text-xs font-medium text-muted-foreground">Rakuten Travel AI</span>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
