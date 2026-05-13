'use client'

import { Card, CardContent } from '@/components/ui/card'

interface ParsedCriteria {
  location?: string
  distance?: string
  meals?: string
  bedType?: string
  amenities?: string[]
  priceRange?: string
}

interface CriteriaParserProps {
  query: string
}

export function CriteriaParser({ query }: CriteriaParserProps) {
  // Simple semantic parsing - in a real app, this would call an AI backend
  const parseCriteria = (): ParsedCriteria => {
    const criteria: ParsedCriteria = {}
    const queryLower = query.toLowerCase()

    // Location detection
    if (queryLower.includes('三島')) {
      criteria.location = '三島駅'
    } else if (queryLower.includes('駅')) {
      criteria.location = '駅周辺'
    }

    // Distance detection
    if (queryLower.includes('5km')) {
      criteria.distance = '5km以内'
    } else if (queryLower.includes('10km')) {
      criteria.distance = '10km以内'
    } else if (queryLower.includes('徒歩')) {
      criteria.distance = '徒歩圏内'
    }

    // Meals detection
    if (queryLower.includes('朝食')) {
      criteria.meals = '朝食付き'
    } else if (queryLower.includes('2食')) {
      criteria.meals = '朝夕食付き'
    }

    // Bed type detection
    if (queryLower.includes('ダブル')) {
      criteria.bedType = 'ダブルベッド'
    } else if (queryLower.includes('シングル')) {
      criteria.bedType = 'シングルベッド'
    } else if (queryLower.includes('ツイン')) {
      criteria.bedType = 'ツインベッド'
    }

    // Amenities detection
    criteria.amenities = []
    if (queryLower.includes('wifi') || queryLower.includes('ワイファイ')) {
      criteria.amenities.push('WiFi')
    }
    if (queryLower.includes('スパ') || queryLower.includes('温泉')) {
      criteria.amenities.push('スパ/温泉')
    }
    if (queryLower.includes('駐車場') || queryLower.includes('パーキング')) {
      criteria.amenities.push('駐車場')
    }

    // Price detection
    if (queryLower.includes('格安') || queryLower.includes('安い')) {
      criteria.priceRange = '〜5000円'
    } else if (queryLower.includes('お手頃')) {
      criteria.priceRange = '5000〜8000円'
    }

    return criteria
  }

  const criteria = parseCriteria()

  if (Object.keys(criteria).length === 0) {
    return null
  }

  return (
    <Card className="mb-6 bg-primary/5 border-primary/20">
      <CardContent className="pt-4">
        <p className="text-xs font-semibold text-muted-foreground mb-3">
          検出された条件
        </p>
        <div className="flex flex-wrap gap-2">
          {criteria.location && (
            <div className="px-3 py-1 rounded-full bg-background border border-border text-sm">
              📍 {criteria.location}
            </div>
          )}
          {criteria.distance && (
            <div className="px-3 py-1 rounded-full bg-background border border-border text-sm">
              🚗 {criteria.distance}
            </div>
          )}
          {criteria.meals && (
            <div className="px-3 py-1 rounded-full bg-background border border-border text-sm">
              🍽️ {criteria.meals}
            </div>
          )}
          {criteria.bedType && (
            <div className="px-3 py-1 rounded-full bg-background border border-border text-sm">
              🛏️ {criteria.bedType}
            </div>
          )}
          {criteria.priceRange && (
            <div className="px-3 py-1 rounded-full bg-background border border-border text-sm">
              💰 {criteria.priceRange}
            </div>
          )}
          {criteria.amenities?.map((amenity) => (
            <div
              key={amenity}
              className="px-3 py-1 rounded-full bg-background border border-border text-sm"
            >
              ⭐ {amenity}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
