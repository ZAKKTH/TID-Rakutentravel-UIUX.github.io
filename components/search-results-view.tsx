'use client'

import {
  MapPin, Star, Wifi, Coffee, Waves, Volume2, Trophy,
  CheckCircle2, XCircle, ExternalLink, TrendingUp, DollarSign,
  Zap, ParkingCircle, Lock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Tag } from '@/components/tag-pool-builder'

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
  noiseScore: number
  cleanScore: number
  serviceScore: number
  matchScore: number
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
  highlight: 'lowest' | 'highest' | 'boolean' | 'none'
  highlightColor: string
}

const ALL_DIMENSIONS: Dimension[] = [
  {
    key: 'price',
    label: '価格 / 泊',
    icon: <DollarSign className="w-3.5 h-3.5" />,
    format: (h) => <span className="font-bold text-sm">¥{h.price.toLocaleString()}</span>,
    highlight: 'lowest',
    highlightColor: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300',
  },
  {
    key: 'rating',
    label: '評価',
    icon: <Star className="w-3.5 h-3.5" />,
    format: (h) => (
      <span className="flex items-center gap-1 justify-center">
        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
        <span className="font-bold">{h.rating}</span>
        <span className="text-[10px] text-muted-foreground">({h.reviews})</span>
      </span>
    ),
    highlight: 'highest',
    highlightColor: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300',
  },
  {
    key: 'distance',
    label: '駅からの距離',
    icon: <MapPin className="w-3.5 h-3.5" />,
    format: (h) => <span className="font-bold">{h.distance}<span className="text-[10px] font-normal text-muted-foreground"> km</span></span>,
    highlight: 'lowest',
    highlightColor: 'text-sky-700 bg-sky-50 border-sky-200 dark:bg-sky-950 dark:border-sky-800 dark:text-sky-300',
  },
  {
    key: 'matchScore',
    label: 'マッチ度',
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    format: (h) => (
      <div className="flex flex-col items-center gap-1.5">
        <span className="font-bold text-sm">{h.matchScore}%</span>
        <div className="w-14 h-1.5 rounded-full bg-border overflow-hidden">
          <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${h.matchScore}%` }} />
        </div>
      </div>
    ),
    highlight: 'highest',
    highlightColor: 'text-violet-700 bg-violet-50 border-violet-200 dark:bg-violet-950 dark:border-violet-800 dark:text-violet-300',
  },
  {
    key: 'breakfast',
    label: '朝食',
    icon: <Coffee className="w-3.5 h-3.5" />,
    format: (h) => h.hasBreakfast
      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
      : <XCircle className="w-5 h-5 text-border mx-auto" />,
    highlight: 'boolean',
    highlightColor: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800',
  },
  {
    key: 'wifi',
    label: 'WiFi',
    icon: <Wifi className="w-3.5 h-3.5" />,
    format: (h) => h.hasWifi
      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
      : <XCircle className="w-5 h-5 text-border mx-auto" />,
    highlight: 'boolean',
    highlightColor: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800',
  },
  {
    key: 'hotSpring',
    label: '温泉',
    icon: <Waves className="w-3.5 h-3.5" />,
    format: (h) => h.hasHotSpring
      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
      : <XCircle className="w-5 h-5 text-border mx-auto" />,
    highlight: 'boolean',
    highlightColor: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800',
  },
  {
    key: 'spa',
    label: 'スパ',
    icon: <Zap className="w-3.5 h-3.5" />,
    format: (h) => h.hasSpa
      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
      : <XCircle className="w-5 h-5 text-border mx-auto" />,
    highlight: 'boolean',
    highlightColor: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800',
  },
  {
    key: 'parking',
    label: '駐車場',
    icon: <ParkingCircle className="w-3.5 h-3.5" />,
    format: (h) => h.hasParking
      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
      : <XCircle className="w-5 h-5 text-border mx-auto" />,
    highlight: 'boolean',
    highlightColor: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800',
  },
  {
    key: 'noiseScore',
    label: '静粛性',
    icon: <Volume2 className="w-3.5 h-3.5" />,
    format: (h) => (
      <div className="flex flex-col items-center gap-1">
        <span className="font-bold text-sm">{h.noiseScore}<span className="text-[10px] text-muted-foreground">/10</span></span>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn('w-2 h-2 rounded-full', i < Math.round(h.noiseScore / 2) ? 'bg-sky-400' : 'bg-border')} />
          ))}
        </div>
      </div>
    ),
    highlight: 'highest',
    highlightColor: 'text-sky-700 bg-sky-50 border-sky-200 dark:bg-sky-950 dark:border-sky-800 dark:text-sky-300',
  },
  {
    key: 'serviceScore',
    label: 'サービス',
    icon: <Trophy className="w-3.5 h-3.5" />,
    format: (h) => (
      <div className="flex flex-col items-center gap-1">
        <span className="font-bold text-sm">{h.serviceScore}<span className="text-[10px] text-muted-foreground">/10</span></span>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn('w-2 h-2 rounded-full', i < Math.round(h.serviceScore / 2) ? 'bg-amber-400' : 'bg-border')} />
          ))}
        </div>
      </div>
    ),
    highlight: 'highest',
    highlightColor: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300',
  },
]

// Tag id → dimension keys to surface
const TAG_DIMENSION_MAP: Record<string, DimensionKey[]> = {
  wifi:       ['wifi', 'matchScore'],
  hotspring:  ['hotSpring', 'noiseScore', 'matchScore'],
  spa:        ['spa', 'serviceScore', 'matchScore'],
  parking:    ['parking', 'matchScore'],
  pool:       ['serviceScore'],
  gym:        ['serviceScore'],
  breakfast:  ['breakfast', 'matchScore'],
  dinner:     ['serviceScore'],
  bar:        ['serviceScore'],
  station:    ['distance', 'matchScore'],
  airport:    ['distance', 'matchScore'],
  ocean:      ['noiseScore', 'rating'],
  mountain:   ['noiseScore', 'rating'],
  city:       ['distance'],
  resort:     ['serviceScore', 'noiseScore', 'rating'],
  quiet:      ['noiseScore', 'matchScore'],
  luxury:     ['rating', 'serviceScore', 'matchScore'],
  romantic:   ['rating', 'cleanScore'],
  family:     ['serviceScore', 'matchScore'],
  business:   ['wifi', 'distance'],
  nature:     ['noiseScore', 'cleanScore'],
  budget:     ['price', 'matchScore'],
  midrange:   ['price', 'rating'],
  premium:    ['rating', 'serviceScore', 'matchScore'],
  pets:       ['serviceScore'],
}

const BASE_DIMENSIONS: DimensionKey[] = ['price', 'rating', 'distance', 'matchScore']

function inferDimensions(tags: Tag[]): DimensionKey[] {
  const keys = new Set<DimensionKey>(BASE_DIMENSIONS)
  for (const tag of tags) {
    const dims = TAG_DIMENSION_MAP[tag.id] ?? []
    dims.forEach(d => keys.add(d))
  }
  return ALL_DIMENSIONS.map(d => d.key).filter(k => keys.has(k))
}

function getBestIds(hotels: HotelData[], key: DimensionKey, highlight: Dimension['highlight']): Set<string> {
  if (highlight === 'boolean') {
    return new Set(hotels.filter(h => (h as unknown as Record<string, unknown>)[key] === true).map(h => h.id))
  }
  const vals = hotels.map(h => (h as unknown as Record<string, unknown>)[key] as number)
  const target = highlight === 'lowest' ? Math.min(...vals) : Math.max(...vals)
  return new Set(hotels.filter(h => (h as unknown as Record<string, unknown>)[key] === target).map(h => h.id))
}

const MOCK_HOTELS: HotelData[] = [
  {
    id: '1', name: 'プレミアムシティホテル三島', price: 8500, rating: 4.6, reviews: 248,
    distance: 2.5, image: '🏨', hasBreakfast: true, hasWifi: true, hasHotSpring: false,
    hasSpa: false, hasParking: true, noiseScore: 7, cleanScore: 9, serviceScore: 8, matchScore: 88,
  },
  {
    id: '2', name: 'シティホテルミシマ', price: 6200, rating: 4.2, reviews: 156,
    distance: 3.8, image: '🏩', hasBreakfast: true, hasWifi: true, hasHotSpring: false,
    hasSpa: false, hasParking: false, noiseScore: 6, cleanScore: 7, serviceScore: 7, matchScore: 70, badge: '格安',
  },
  {
    id: '3', name: 'グランドホテル静岡', price: 9800, rating: 4.4, reviews: 312,
    distance: 4.2, image: '🏰', hasBreakfast: true, hasWifi: true, hasHotSpring: true,
    hasSpa: false, hasParking: true, noiseScore: 8, cleanScore: 9, serviceScore: 9, matchScore: 82,
  },
  {
    id: '4', name: 'ビジネスホテル駅前', price: 4800, rating: 3.9, reviews: 89,
    distance: 0.3, image: '🏢', hasBreakfast: false, hasWifi: true, hasHotSpring: false,
    hasSpa: false, hasParking: false, noiseScore: 5, cleanScore: 7, serviceScore: 6, matchScore: 65, badge: '最寄',
  },
  {
    id: '5', name: 'リゾートスパ三島', price: 12500, rating: 4.8, reviews: 421,
    distance: 4.5, image: '🌿', hasBreakfast: true, hasWifi: true, hasHotSpring: true,
    hasSpa: true, hasParking: true, noiseScore: 10, cleanScore: 10, serviceScore: 10, matchScore: 96, badge: '人気No.1',
  },
]

interface SearchResultsViewProps {
  tags: Tag[]
  prefecture: string
  area: string
}

export function SearchResultsView({ tags, prefecture, area }: SearchResultsViewProps) {
  const dimensionKeys = inferDimensions(tags)
  const dimensions = ALL_DIMENSIONS.filter(d => dimensionKeys.includes(d.key))
  const hotels = MOCK_HOTELS.slice(0, 4)
  const bestHotel = [...hotels].sort((a, b) => b.matchScore - a.matchScore)[0]

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-56px)]">
      {/* Results header */}
      <div className="px-5 py-4 border-b border-border bg-background flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">検索プラン確定</span>
          </div>
          <p className="text-sm font-semibold text-foreground">
            {prefecture}{area && ` › ${area}`}
            <span className="text-muted-foreground font-normal">
              {' '}— {tags.map(t => `${t.icon} ${t.label}`).join('・')}
            </span>
          </p>
        </div>
        <div className="shrink-0 text-xs text-muted-foreground">
          {hotels.length}件
        </div>
      </div>

      {/* Comparison table */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="overflow-x-auto pb-2">
          <table className="border-collapse" style={{ minWidth: `${180 + hotels.length * 168}px` }}>
            <thead>
              <tr>
                {/* label col */}
                <th className="w-44 min-w-[11rem]" />
                {hotels.map(hotel => (
                  <th key={hotel.id} className="w-40 min-w-[10rem] px-2 pb-4 align-bottom">
                    <div className={cn(
                      'relative rounded-xl border p-3.5 flex flex-col items-center gap-2 text-center',
                      hotel.id === bestHotel.id
                        ? 'border-violet-300 bg-violet-50 shadow-md dark:bg-violet-950/40 dark:border-violet-700'
                        : 'border-border bg-background'
                    )}>
                      {hotel.id === bestHotel.id && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-violet-500 rounded-full px-2.5 py-0.5 whitespace-nowrap shadow-sm">
                          BEST MATCH
                        </span>
                      )}
                      {hotel.badge && hotel.id !== bestHotel.id && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-primary rounded-full px-2.5 py-0.5 whitespace-nowrap shadow-sm">
                          {hotel.badge}
                        </span>
                      )}
                      <div className="w-16 h-16 rounded-xl bg-secondary border border-border flex items-center justify-center text-3xl shrink-0">
                        {hotel.image}
                      </div>
                      <p className="text-xs font-semibold leading-snug text-balance line-clamp-2 w-full">
                        {hotel.name}
                      </p>
                      <p className="text-base font-bold text-primary leading-none">
                        ¥{hotel.price.toLocaleString()}
                        <span className="text-[10px] font-normal text-muted-foreground"> /泊</span>
                      </p>
                      <button className="w-full flex items-center justify-center gap-1 h-7 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition-colors">
                        詳細を見る
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dimensions.map((dim, rowIdx) => {
                const bestIds = getBestIds(hotels, dim.key, dim.highlight)
                return (
                  <tr
                    key={dim.key}
                    className={cn('border-t border-border', rowIdx % 2 === 0 ? 'bg-background' : 'bg-secondary/20')}
                  >
                    <td className="py-3 pr-4 pl-1 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {dim.icon}
                        <span className="text-xs font-medium">{dim.label}</span>
                      </div>
                    </td>
                    {hotels.map(hotel => {
                      const isBest = bestIds.has(hotel.id) && dim.highlight !== 'none'
                      return (
                        <td key={hotel.id} className="px-2 py-2">
                          <div className={cn(
                            'rounded-lg px-2 py-2.5 text-center text-sm transition-colors',
                            isBest ? `border ${dim.highlightColor}` : 'text-foreground'
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

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 text-[11px] text-muted-foreground">
          {[
            { color: 'bg-emerald-100 border-emerald-200', label: '最安値 / 設備あり' },
            { color: 'bg-amber-100 border-amber-200',     label: '最高評価 / サービス最高' },
            { color: 'bg-sky-100 border-sky-200',         label: '最短距離 / 最高静粛性' },
            { color: 'bg-violet-100 border-violet-200',   label: '最高マッチ度' },
          ].map(item => (
            <span key={item.label} className="flex items-center gap-1.5">
              <span className={cn('w-3.5 h-3.5 rounded border inline-block', item.color)} />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
