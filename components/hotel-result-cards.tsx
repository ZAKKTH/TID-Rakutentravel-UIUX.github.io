'use client'

import { Star, MapPin, Wifi, Coffee, Waves, Sparkles, Car } from 'lucide-react'
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
  noiseScore: number
  cleanScore: number
  serviceScore: number
  matchScore: number
  badge?: string
}

interface CompRow {
  key: string
  label: string
  render: (h: HotelData) => { display: React.ReactNode; raw: number }
  higherIsBetter: boolean
}

const ALL_ROWS: CompRow[] = [
  {
    key: 'price', label: '料金 / 泊',
    render: h => ({ display: `¥${h.price.toLocaleString()}`, raw: h.price }),
    higherIsBetter: false,
  },
  {
    key: 'rating', label: '総合評価',
    render: h => ({
      display: (
        <span className="inline-flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          {h.rating.toFixed(1)}
          <span className="text-muted-foreground text-[10px]">({h.reviews})</span>
        </span>
      ),
      raw: h.rating,
    }),
    higherIsBetter: true,
  },
  {
    key: 'distance', label: '三島駅から',
    render: h => ({ display: `${h.distance} km`, raw: h.distance }),
    higherIsBetter: false,
  },
  {
    key: 'wifi', label: 'WiFi',
    render: h => ({
      display: (
        <span className={cn('inline-flex items-center gap-1', h.hasWifi ? 'text-emerald-600 font-semibold' : 'text-muted-foreground')}>
          <Wifi className="w-3.5 h-3.5" />{h.hasWifi ? '完備' : '—'}
        </span>
      ),
      raw: h.hasWifi ? 1 : 0,
    }),
    higherIsBetter: true,
  },
  {
    key: 'breakfast', label: '朝食',
    render: h => ({
      display: (
        <span className={cn('inline-flex items-center gap-1', h.hasBreakfast ? 'text-emerald-600 font-semibold' : 'text-muted-foreground')}>
          <Coffee className="w-3.5 h-3.5" />{h.hasBreakfast ? '付き' : '—'}
        </span>
      ),
      raw: h.hasBreakfast ? 1 : 0,
    }),
    higherIsBetter: true,
  },
  {
    key: 'hotspring', label: '温泉',
    render: h => ({
      display: (
        <span className={cn('inline-flex items-center gap-1', h.hasHotSpring ? 'text-emerald-600 font-semibold' : 'text-muted-foreground')}>
          <Waves className="w-3.5 h-3.5" />{h.hasHotSpring ? 'あり' : '—'}
        </span>
      ),
      raw: h.hasHotSpring ? 1 : 0,
    }),
    higherIsBetter: true,
  },
  {
    key: 'noise', label: '静粛性',
    render: h => ({ display: `${h.noiseScore}/10`, raw: h.noiseScore }),
    higherIsBetter: true,
  },
  {
    key: 'clean', label: '清潔感',
    render: h => ({ display: `${h.cleanScore}/10`, raw: h.cleanScore }),
    higherIsBetter: true,
  },
  {
    key: 'service', label: 'サービス',
    render: h => ({ display: `${h.serviceScore}/10`, raw: h.serviceScore }),
    higherIsBetter: true,
  },
  {
    key: 'parking', label: '駐車場',
    render: h => ({
      display: (
        <span className={cn('inline-flex items-center gap-1', h.hasParking ? 'text-emerald-600 font-semibold' : 'text-muted-foreground')}>
          <Car className="w-3.5 h-3.5" />{h.hasParking ? 'あり' : '—'}
        </span>
      ),
      raw: h.hasParking ? 1 : 0,
    }),
    higherIsBetter: true,
  },
  {
    key: 'match', label: 'マッチ度',
    render: h => ({
      display: (
        <span className="inline-flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="font-semibold text-primary">{h.matchScore}%</span>
        </span>
      ),
      raw: h.matchScore,
    }),
    higherIsBetter: true,
  },
]

const TAG_TO_ROWS: Record<string, string[]> = {
  budget:    ['price', 'match'],
  station:   ['distance', 'match'],
  mishima:   ['distance', 'match'],
  dist5:     ['distance', 'price'],
  wifi:      ['wifi', 'price', 'distance'],
  onsen:     ['hotspring', 'noise', 'rating'],
  quiet:     ['noise', 'hotspring', 'rating'],
  luxury:    ['rating', 'service', 'clean'],
  breakfast: ['breakfast', 'price', 'rating'],
  relax:     ['hotspring', 'noise', 'service'],
  business:  ['wifi', 'distance', 'service'],
  parking:   ['parking', 'price', 'distance'],
  dinner:    ['breakfast', 'price', 'rating'],
  spa:       ['hotspring', 'noise', 'rating'],
}

function selectRows(matchedKeys: string[]): CompRow[] {
  const selected = new Set(['price', 'rating', 'distance', 'match'])
  for (const key of matchedKeys) {
    ;(TAG_TO_ROWS[key] ?? []).forEach(k => selected.add(k))
  }
  return ALL_ROWS.filter(r => selected.has(r.key))
}

function getBestColIdx(hotels: HotelData[], row: CompRow): number {
  const vals = hotels.map(h => row.render(h).raw)
  const best = row.higherIsBetter ? Math.max(...vals) : Math.min(...vals)
  return vals.indexOf(best)
}

interface HotelResultCardsProps {
  hotels: HotelData[]
  matchedKeys?: string[]
}

export function HotelResultCards({ hotels, matchedKeys = [] }: HotelResultCardsProps) {
  const rows = selectRows(matchedKeys)
  const displayHotels = hotels.slice(0, 4)
  const bestMatchIdx = displayHotels.reduce(
    (best, h, i) => (h.matchScore > displayHotels[best].matchScore ? i : best),
    0
  )

  return (
    <div className="space-y-3 w-full">
      <p className="text-sm font-medium">{hotels.length}件のホテルが見つかりました</p>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-secondary/60 border-b border-border px-4 py-2 text-left text-xs font-medium text-muted-foreground w-28 min-w-28" />
              {displayHotels.map((hotel, i) => (
                <th
                  key={hotel.id}
                  className={cn(
                    'border-b border-border px-4 py-3 text-center min-w-36',
                    i === bestMatchIdx ? 'bg-primary/5' : 'bg-card'
                  )}
                >
                  <div className="space-y-1.5 flex flex-col items-center">
                    {(hotel.badge || i === bestMatchIdx) && (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                        {hotel.badge ?? 'BEST MATCH'}
                      </span>
                    )}
                    <div className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center text-2xl',
                      i === bestMatchIdx ? 'bg-primary/10' : 'bg-secondary'
                    )}>
                      {hotel.image}
                    </div>
                    <p className="text-xs font-semibold leading-tight text-balance max-w-32">
                      {hotel.name}
                    </p>
                    <p className={cn('text-base font-bold', i === bestMatchIdx ? 'text-primary' : 'text-foreground')}>
                      ¥{hotel.price.toLocaleString()}
                      <span className="text-[10px] font-normal text-muted-foreground"> / 泊</span>
                    </p>
                    <button className={cn(
                      'w-full text-xs py-1.5 rounded-lg font-medium border transition-colors',
                      i === bestMatchIdx
                        ? 'bg-primary text-primary-foreground border-primary hover:bg-accent'
                        : 'bg-background border-border text-foreground hover:border-primary/40'
                    )}>
                      詳細を見る
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => {
              const bestIdx = getBestColIdx(displayHotels, row)
              return (
                <tr key={row.key} className={rowIdx % 2 === 0 ? 'bg-background' : 'bg-secondary/20'}>
                  <td className="sticky left-0 z-10 bg-inherit border-b border-border/60 px-4 py-2.5 text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {row.label}
                  </td>
                  {displayHotels.map((hotel, colIdx) => {
                    const { display } = row.render(hotel)
                    const isBest = colIdx === bestIdx
                    return (
                      <td
                        key={hotel.id}
                        className={cn(
                          'border-b border-border/60 px-4 py-2.5 text-center text-xs',
                          colIdx === bestMatchIdx && 'bg-primary/5',
                          isBest && 'font-bold text-primary'
                        )}
                      >
                        {display}
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
  )
}
