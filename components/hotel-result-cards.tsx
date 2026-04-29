'use client'

import { MapPin, Star, Wifi, Coffee, Wind } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Hotel {
  id: string
  name: string
  distance: number
  rating: number
  reviews: number
  price: number
  image: string
  amenities: string[]
  description: string
}

interface HotelResultCardsProps {
  hotels: Hotel[]
}

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-3 h-3" />,
  Breakfast: <Coffee className="w-3 h-3" />,
  AC: <Wind className="w-3 h-3" />,
}

export function HotelResultCards({ hotels }: HotelResultCardsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{hotels.length}件の宿泊施設が見つかりました</p>
      <div className="space-y-2">
        {hotels.slice(0, 3).map((hotel) => (
          <div
            key={hotel.id}
            className="p-3 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex gap-3">
              <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center text-2xl shrink-0">
                {hotel.image}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate">{hotel.name}</h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {hotel.distance}km
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {hotel.rating}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  {hotel.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-secondary text-[10px] text-muted-foreground"
                    >
                      {amenityIcons[amenity]}
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-primary">
                  {hotel.price.toLocaleString()}円
                </p>
                <p className="text-[10px] text-muted-foreground">/ 泊</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" className="flex-1 text-xs h-8 rounded-lg">
                詳細を見る
              </Button>
              <Button size="sm" className="flex-1 text-xs h-8 rounded-lg">
                予約する
              </Button>
            </div>
          </div>
        ))}
      </div>
      {hotels.length > 3 && (
        <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
          他{hotels.length - 3}件を表示
        </Button>
      )}
    </div>
  )
}
