'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface EssentialQuestionsProps {
  onAnswered: (answer: string) => void
}

export function EssentialQuestions({ onAnswered }: EssentialQuestionsProps) {
  return (
    <Card className="mb-6 border-primary/30 bg-amber-50 dark:bg-amber-950/20">
      <CardContent className="pt-4">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
            ⚠️ 宿泊日が未指定です。いつ宿泊しますか？
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAnswered('今日')}
              className="bg-background hover:bg-primary hover:text-primary-foreground"
            >
              今日
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAnswered('今週末')}
              className="bg-background hover:bg-primary hover:text-primary-foreground"
            >
              今週末
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAnswered('来週')}
              className="bg-background hover:bg-primary hover:text-primary-foreground"
            >
              来週
            </Button>
            <input
              type="date"
              onChange={(e) => {
                if (e.target.value) {
                  onAnswered(e.target.value)
                }
              }}
              className="px-3 py-1.5 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
