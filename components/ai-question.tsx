'use client'

import { Button } from '@/components/ui/button'

interface AIQuestionProps {
  question: string
  options: { label: string; value: string }[]
  onSelect: (value: string) => void
  showDatePicker?: boolean
}

export function AIQuestion({ question, options, onSelect, showDatePicker }: AIQuestionProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm">{question}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            size="sm"
            onClick={() => onSelect(option.value)}
            className="rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-all"
          >
            {option.label}
          </Button>
        ))}
        {showDatePicker && (
          <input
            type="date"
            onChange={(e) => {
              if (e.target.value) {
                onSelect(e.target.value)
              }
            }}
            className="px-3 py-1.5 rounded-full border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          />
        )}
      </div>
    </div>
  )
}
