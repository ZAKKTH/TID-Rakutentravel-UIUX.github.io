'use client'

import {
  MapPin, Star, Wifi, Coffee, Waves, Volume2, Zap, Trophy, CheckCircle2, XCircle,
  ExternalLink, TrendingUp, DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface HotelData {
  id: string
  name: string
  price: number
  rating: number
  reviews: number
  distance: number
  image: string
  hasBreakfast: boolean
  hasWifi: boolean
  hasHotSpring: boolean
  hasSpa: boolean
  hasParking: boolean
  noiseScore: number      // 1-10, higher = quieter
  cleanScore: number      // 1-10
  serviceScore: number    // 1-10
  matchScore: number      // 0-100
  badge?: string
}

type DimensionKey =
  | 'price' | 'rating' | 'distance' | 'breakfast' | 'wifi'
  | 'hotSpring' | 'noiseScore' | 'cleanScore' | 'serviceScore' | 'matchScore'
  | 'parking' | 'spa'

interface Dimension {
  key: DimensionKey
  label: string
  icon: React.ReactNode
  format: (hotel: HotelData) => React.ReactNode
  highlight: 'lowest' | 'highest' | 'boolean'
  highlightColor: string
}

const ALL_DIMENSIONS: Dimension[] = [
  {
    key: 'price',
    label: '価格',
    icon: <DollarSign className="w-3.5 h-3.5" />,
    format: (h) => <span className="font-semibold">¥{h.price.toLocaleString()}<span className="text-[10px] font-normal text-muted-foreground">/泊</span></span>,
    highlight: 'lowest',
    highlightColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    key: 'rating',
    label: '評価',
    icon: <Star className="w-3.5 h-3.5" />,
    format: (h) => (
      <span className="flex items-center gap-1 justify-center">
        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
        <span className="font-semibold">{h.rating}</span>
        <span className="text-[10px] text-muted-foreground">({h.reviews})</span>
      </span>
    ),
    highlight: 'highest',
    highlightColor: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  {
    key: 'distance',
    label: '距離',
    icon: <MapPin className="w-3.5 h-3.5" />,
    format: (h) => <span className="font-semibold">{h.distance}<span className="text-[10px] font-normal text-muted-foreground">km</span></span>,
    highlight: 'lowest',
    highlightColor: 'text-sky-600 bg-sky-50 border-sky-200',
  },
  {
    key: 'matchScore',
    label: 'マッチ度',
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    format: (h) => (
      <div className="flex flex-col items-center gap-1">
        <span className="font-bold text-sm">{h.matchScore}%</span>
        <div className="w-12 h-1 rounded-full bg-border overflow-hidden">
          <div className="h-full rounded-full bg-violet-500" style={{ width: `${h.matchScore}%` }} />
        </div>
      </div>
    ),
    highlight: 'highest',
    highlightColor: 'text-violet-600 bg-violet-50 border-violet-200',
  },
  {
    key: 'breakfast',
    label: '朝食',
    icon: <Coffee className="w-3.5 h-3.5" />,
    format: (h) => h.hasBreakfast
      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
      : <XCircle className="w-5 h-5 text-border mx-auto" />,
    highlight: 'boolean',
    highlightColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    key: 'wifi',
    label: 'WiFi',
    icon: <Wifi className="w-3.5 h-3.5" />,
    format: (h) => h.hasWifi
      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
      : <XCircle className="w-5 h-5 text-border mx-auto" />,
    highlight: 'boolean',
    highlightColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    key: 'hotSpring',
    label: '温泉',
    icon: <Waves className="w-3.5 h-3.5" />,
    format: (h) => h.hasHotSpring
      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
      : <XCircle className="w-5 h-5 text-border mx-auto" />,
    highlight: 'boolean',
    highlightColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    key: 'spa',
    label: 'スパ',
    icon: <Zap className="w-3.5 h-3.5" />,
    format: (h) => h.hasSpa
      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
      : <XCircle className="w-5 h-5 text-border mx-auto" />,
    highlight: 'boolean',
    highlightColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    key: 'parking',
    label: '駐車場',
    icon: <MapPin className="w-3.5 h-3.5" />,
    format: (h) => h.hasParking
      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
      : <XCircle className="w-5 h-5 text-border mx-auto" />,
    highlight: 'boolean',
    highlightColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    key: 'noiseScore',
    label: '静粛性',
    icon: <Volume2 className="w-3.5 h-3.5" />,
    format: (h) => (
      <div className="flex flex-col items-center gap-1">
        <span className="font-semibold text-sm">{h.noiseScore}<span className="text-[10px] text-muted-foreground">/10</span></span>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn('w-1.5 h-1.5 rounded-full', i < Math.round(h.noiseScore / 2) ? 'bg-sky-400' : 'bg-border')} />
          ))}
        </div>
      </div>
    ),
    highlight: 'highest',
    highlightColor: 'text-sky-600 bg-sky-50 border-sky-200',
  },
  {
    key: 'serviceScore',
    label: 'サービス',
    icon: <Trophy className="w-3.5 h-3.5" />,
    format: (h) => (
      <div className="flex flex-col items-center gap-1">
        <span className="font-semibold text-sm">{h.serviceScore}<span className="text-[10px] text-muted-foreground">/10</span></span>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn('w-1.5 h-1.5 rounded-full', i < Math.round(h.serviceScore / 2) ? 'bg-amber-400' : 'bg-border')} />
          ))}
        </div>
      </div>
    ),
    highlight: 'highest',
    highlightColor: 'text-amber-600 bg-amber-50 border-amber-200',
  },
]

// Map search query keywords → which dimension keys to surface
const TAG_TO_DIMENSIONS: Record<string, DimensionKey[]> = {
  '格安': ['price', 'matchScore'],
  '予算': ['price', 'matchScore'],
  '駅': ['distance', 'matchScore'],
  '駅前': ['distance', 'matchScore'],
  '5km': ['distance'],
  '朝食': ['breakfast', 'matchScore'],
  'wifi': ['wifi', 'matchScore'],
  'ワイファイ': ['wifi'],
  '温泉': ['hotSpring', 'noiseScore', 'matchScore'],
  'スパ': ['spa', 'hotSpring', 'matchScore'],
  '静か': ['noiseScore', 'matchScore'],
  '評価': ['rating', 'serviceScore', 'matchScore'],
  '高評価': ['rating', 'serviceScore', 'matchScore'],
  '贅沢': ['rating', 'serviceScore', 'spa', 'matchScore'],
  '駐車場': ['parking', 'matchScore'],
}

const BASE_DIMENSIONS: DimensionKey[] = ['price', 'rating', 'distance', 'matchScore']

function inferDimensions(query: string): DimensionKey[] {
  const lower = query.toLowerCase()
  const keys = new Set<DimensionKey>(BASE_DIMENSIONS)

  for (const [tag, dims] of Object.entries(TAG_TO_DIMENSIONS)) {
    if (lower.includes(tag.toLowerCase())) {
      dims.forEach(d => keys.add(d))
    }
  }

  // Preserve order from ALL_DIMENSIONS
  return ALL_DIMENSIONS.map(d => d.key).filter(k => keys.has(k))
}

function getBestValues(hotels: HotelData[], key: DimensionKey, highlight: 'lowest' | 'highest' | 'boolean'): Set<string> {
  if (highlight === 'boolean') {
    return new Set(hotels.filter(h => h[key as keyof HotelData] === true).map(h => h.id))
  }
  if (highlight === 'lowest') {
    const min = Math.min(...hotels.map(h => h[key as keyof HotelData] as number))
    return new Set(hotels.filter(h => (h[key as keyof HotelData] as number) === min).map(h => h.id))
  }
  if (highlight === 'highest') {
    const max = Math.max(...hotels.map(h => h[key as keyof HotelData] as number))
    return new Set(hotels.filter(h => (h[key as keyof HotelData] as number) === max).map(h => h.id))
  }
  return new Set()
}

interface HotelComparisonTableProps {
  hotels: HotelData[]
  query: string
}

export function HotelComparisonTable({ hotels, query }: HotelComparisonTableProps) {
  const dimensionKeys = inferDimensions(query)
  const dimensions = ALL_DIMENSIONS.filter(d => dimensionKeys.includes(d.key))

  const displayHotels = hotels.slice(0, 4)

  // Find overall best hotel by matchScore
  const bestHotel = [...displayHotels].sort((a, b) => b.matchScore - a.matchScore)[0]

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          {displayHotels.length}件の比較結果
        </p>
        <span className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
          横スクロール可
        </span>
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto -mx-1 px-1 pb-2">
        <div className="min-w-max">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {/* Row label column */}
                <th className="w-28 min-w-[7rem]" />

                {/* Hotel columns */}
                {displayHotels.map((hotel) => (
                  <th key={hotel.id} className="min-w-[9rem] w-36 px-2 pb-3">
                    <div className={cn(
                      'rounded-xl border p-3 flex flex-col items-center gap-2 text-center relative',
                      hotel.id === bestHotel.id
                        ? 'border-violet-300 bg-violet-50 shadow-sm'
                        : 'border-border bg-background'
                    )}>
                      {hotel.id === bestHotel.id && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-violet-500 rounded-full px-2 py-0.5 whitespace-nowrap">
                          BEST MATCH
                        </span>
                      )}
                      {hotel.badge && hotel.id !== bestHotel.id && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-primary rounded-full px-2 py-0.5 whitespace-nowrap">
                          {hotel.badge}
                        </span>
                      )}

                      {/* Hotel image placeholder */}
                      <div className="w-14 h-14 rounded-lg bg-secondary border border-border flex items-center justify-center text-2xl shrink-0">
                        {hotel.image}
                      </div>

                      {/* Name */}
                      <p className="text-xs font-semibold leading-tight text-balance line-clamp-2">
                        {hotel.name}
                      </p>

                      {/* Price */}
                      <p className="text-sm font-bold text-primary">
                        ¥{hotel.price.toLocaleString()}
                        <span className="text-[10px] font-normal text-muted-foreground">/泊</span>
                      </p>

                      {/* CTA */}
                      <Button size="sm" className="w-full h-7 text-[11px] rounded-lg gap-1">
                        詳細を見る
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {dimensions.map((dim, rowIdx) => {
                const bestIds = getBestValues(displayHotels, dim.key, dim.highlight)

                return (
                  <tr
                    key={dim.key}
                    className={cn('border-t border-border', rowIdx % 2 === 0 ? 'bg-background' : 'bg-secondary/30')}
                  >
                    {/* Row label */}
                    <td className="py-3 pr-3 pl-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        {dim.icon}
                        <span className="text-xs font-medium">{dim.label}</span>
                      </div>
                    </td>

                    {/* Hotel cells */}
                    {displayHotels.map((hotel) => {
                      const isBest = bestIds.has(hotel.id)
                      return (
                        <td key={hotel.id} className="px-2 py-2">
                          <div className={cn(
                            'rounded-lg px-2 py-2 text-center text-sm transition-colors',
                            isBest
                              ? `border ${dim.highlightColor}`
                              : 'text-foreground'
                          )}>
                            {dim.format(hotel)}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-1 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-200 inline-block" />
          最安値 / あり
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-200 inline-block" />
          最高評価
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-sky-100 border border-sky-200 inline-block" />
          最短距離 / 最高静粛性
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-violet-100 border border-violet-200 inline-block" />
          最高マッチ度
        </span>
      </div>
    </div>
  )
}
