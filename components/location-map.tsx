import { MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface LocationMapProps {
  title: string
  location: string
  coordinates: { lat: number; lng: number }
}

export function LocationMap({ title, location, coordinates }: LocationMapProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {/* Map Placeholder */}
        <Card className="h-64 bg-gray-100 dark:bg-gray-800">
          <CardContent className="h-full flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Interactive map would be here</p>
              <p className="text-xs text-muted-foreground mt-1">
                Coordinates: {coordinates.lat}, {coordinates.lng}
              </p>
            </div>
          </CardContent>
        </Card>

        <div>
          <h4 className="font-medium mb-2">{location}</h4>
          <p className="text-sm text-muted-foreground">
            Located in the heart of downtown Seattle, this property offers easy access to Pike Place Market, the
            waterfront, and major tech companies. Public transportation is just steps away with multiple bus lines and
            light rail access.
          </p>
        </div>

        {/* AI Location Insights */}
        <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
          <CardContent className="p-4">
            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">AI Location Score</h4>
            <div className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
              <div>🚶 Walk Score: 95/100 - Walker's Paradise</div>
              <div>🚌 Transit Score: 88/100 - Excellent Transit</div>
              <div>🍽️ 47 restaurants within 0.5 miles</div>
              <div>☕ 12 coffee shops within 0.3 miles</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
