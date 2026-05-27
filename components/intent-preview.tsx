'use client'

import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IntentPreviewProps {
  query: string
  className?: string
}

function buildSentence(query: string): string {
  if (!query.trim()) return ''

  const q = query.toLowerCase()

  // Extract location
  let location = ''
  if (q.includes('三島')) location = '三島駅周辺'
  else if (q.includes('新宿')) location = '新宿'
  else if (q.includes('渋谷')) location = '渋谷'
  else if (q.includes('京都')) location = '京都'
  else if (q.includes('大阪')) location = '大阪'
  else if (q.includes('駅近') || q.includes('駅前')) location = '駅近く'

  // Extract distance
  const distMatch = query.match(/(\d+)\s*km/i)
  const distance = distMatch ? `${distMatch[1]}km以内` : ''

  // Extract features
  const features: string[] = []
  if (q.includes('朝食')) features.push('朝食付き')
  if (q.includes('温泉')) features.push('温泉')
  if (q.includes('静か')) features.push('静かな環境')
  if (q.includes('wifi') || q.includes('wi-fi') || q.includes('ワイファイ')) features.push('WiFi完備')
  if (q.includes('スパ')) features.push('スパ施設')
  if (q.includes('贅沢') || q.includes('luxury')) features.push('贅沢な設備')
  if (q.includes('格安') || q.includes('budget')) features.push('お得な価格')
  if (q.includes('リラックス')) features.push('リラクゼーション設備')
  if (q.includes('ビジネス')) features.push('ビジネス設備')
  if (q.includes('駐車場')) features.push('駐車場')
  if (q.includes('海')) features.push('海の景色')
  if (q.includes('自然')) features.push('自然環境')

  // Compose sentence
  const parts: string[] = []
  if (location && distance) parts.push(`${location}${distance}`)
  else if (location) parts.push(location)
  else if (distance) parts.push(distance)

  if (features.length > 0) {
    parts.push(features.join('・') + 'のホテル')
  } else {
    parts.push('ホテル')
  }

  if (parts.length === 1 && parts[0] === 'ホテル') {
    return query.length > 2
      ? `「${query.trim()}」の条件でホテルを探しています。`
      : ''
  }

  return `${parts.join('、')}をお探しですね。最適な宿泊施設を提案します。`
}

export function IntentPreview({ query, className }: IntentPreviewProps) {
  const sentence = buildSentence(query)

  if (!sentence) return null

  return (
    <div className={cn(
      'flex items-start gap-2 px-3 py-2.5 rounded-lg bg-primary/5 border border-primary/20',
      className
    )}>
      <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
      <p className="text-xs text-foreground leading-relaxed">
        <span className="font-semibold text-primary">AI: </span>
        {sentence}
      </p>
    </div>
  )
}
