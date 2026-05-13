'use client'

import { Star, MapPin, Wifi, UtensilsCrossed, Wind } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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

interface HotelCardProps {
  hotel: Hotel
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  breakfast: <UtensilsCrossed className="w-4 h-4" />,
  ac: <Wind className="w-4 h-4" />,
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-muted to-muted-foreground/20 flex items-center justify-center text-muted-foreground text-sm">
          {hotel.image}
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-balance">{hotel.name}</h3>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{hotel.distance}km</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 justify-end">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="font-semibold text-sm">{hotel.rating}</span>
              <span className="text-xs text-muted-foreground">({hotel.reviews})</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{hotel.description}</p>

        <div className="flex flex-wrap gap-2">
          {hotel.amenities.map((amenity) => (
            <div
              key={amenity}
              className="flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2.5 py-1.5 rounded-md"
            >
              {amenityIcons[amenity.toLowerCase()] || amenityIcons.wifi}
              <span>{amenity}</span>
            </div>
          ))}
        </div>

        <div className="flex items-baseline justify-between pt-2 border-t border-border">
          <div>
            <span className="text-xs text-muted-foreground">1泊から</span>
            <div className="text-2xl font-bold text-primary">¥{hotel.price.toLocaleString()}</div>
          </div>
          <Button variant="default" className="font-semibold">
            詳細を見る
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
