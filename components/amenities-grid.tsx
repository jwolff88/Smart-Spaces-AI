import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Amenity {
  icon: LucideIcon
  name: string
  category: string
}

interface AmenitiesGridProps {
  amenities: Amenity[]
}

const allAmenities = [
  { icon: "Wifi", name: "High-speed WiFi", category: "Internet" },
  { icon: "Car", name: "Free parking", category: "Parking" },
  { icon: "Zap", name: "Air conditioning", category: "Climate" },
  { icon: "Users", name: "Workspace", category: "Work" },
  { icon: "Tv", name: '55" Smart TV', category: "Entertainment" },
  { icon: "Coffee", name: "Coffee machine", category: "Kitchen" },
  { icon: "Waves", name: "Dishwasher", category: "Kitchen" },
  { icon: "Wind", name: "Hair dryer", category: "Bathroom" },
  { icon: "Shield", name: "Security cameras", category: "Safety" },
  { icon: "Key", name: "Self check-in", category: "Convenience" },
]

export function AmenitiesGrid({ amenities }: AmenitiesGridProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">What this place offers</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {amenities.slice(0, 6).map((amenity, index) => (
          <div key={index} className="flex items-center gap-3">
            <amenity.icon className="h-5 w-5" />
            <span>{amenity.name}</span>
          </div>
        ))}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-4 bg-transparent">
            Show all amenities
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All amenities</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {Object.entries(
              allAmenities.reduce(
                (acc, amenity) => {
                  if (!acc[amenity.category]) acc[amenity.category] = []
                  acc[amenity.category].push(amenity)
                  return acc
                },
                {} as Record<string, typeof allAmenities>,
              ),
            ).map(([category, items]) => (
              <div key={category}>
                <h4 className="font-semibold mb-3">{category}</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {items.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
