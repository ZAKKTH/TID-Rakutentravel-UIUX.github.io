'use client'

interface ParsedCriteria {
  location?: string
  distance?: string
  meals?: string
  bedType?: string
  amenities?: string[]
  priceRange?: string
  date?: string
}

interface ParsedCriteriaDisplayProps {
  criteria: ParsedCriteria
}

export function ParsedCriteriaDisplay({ criteria }: ParsedCriteriaDisplayProps) {
  const hasCriteria = Object.values(criteria).some(v => v && (Array.isArray(v) ? v.length > 0 : true))
  
  if (!hasCriteria) return null

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">検出した条件:</p>
      <div className="flex flex-wrap gap-1.5">
        {criteria.location && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background border border-border text-xs">
            <span>📍</span> {criteria.location}
          </span>
        )}
        {criteria.distance && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background border border-border text-xs">
            <span>🚗</span> {criteria.distance}
          </span>
        )}
        {criteria.meals && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background border border-border text-xs">
            <span>🍽️</span> {criteria.meals}
          </span>
        )}
        {criteria.bedType && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background border border-border text-xs">
            <span>🛏️</span> {criteria.bedType}
          </span>
        )}
        {criteria.priceRange && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background border border-border text-xs">
            <span>💰</span> {criteria.priceRange}
          </span>
        )}
        {criteria.date && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background border border-border text-xs">
            <span>📅</span> {criteria.date}
          </span>
        )}
        {criteria.amenities?.map((amenity) => (
          <span
            key={amenity}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background border border-border text-xs"
          >
            <span>✨</span> {amenity}
          </span>
        ))}
      </div>
    </div>
  )
}

export function parseCriteria(query: string) {
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

  // Date detection
  if (queryLower.includes('今日')) {
    criteria.date = '今日'
  } else if (queryLower.includes('今週末')) {
    criteria.date = '今週末'
  } else if (queryLower.includes('来週')) {
    criteria.date = '来週'
  }

  return criteria
}
