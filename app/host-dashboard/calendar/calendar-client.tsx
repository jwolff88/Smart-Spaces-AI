"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AvailabilityCalendar } from "@/components/availability-calendar"
import { Calendar, Home } from "lucide-react"

interface Listing {
  id: string
  title: string
  location: string
}

interface CalendarClientProps {
  listings: Listing[]
}

export function CalendarClient({ listings }: CalendarClientProps) {
  const [selectedListing, setSelectedListing] = useState<string>(
    listings[0]?.id || ""
  )

  const currentListing = listings.find((l) => l.id === selectedListing)

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Home className="h-16 w-16 text-slate-600 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">No Listings Yet</h2>
        <p className="text-slate-400 mb-4">
          Add a property to start managing your availability
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Availability Calendar
          </h1>
          <p className="text-slate-400">
            Block dates and manage your property availability
          </p>
        </div>

        {listings.length > 1 && (
          <Select value={selectedListing} onValueChange={setSelectedListing}>
            <SelectTrigger className="w-[280px] bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select a property" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {listings.map((listing) => (
                <SelectItem key={listing.id} value={listing.id}>
                  <div className="flex flex-col">
                    <span>{listing.title}</span>
                    <span className="text-xs text-slate-400">
                      {listing.location}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Instructions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-medium">How to use:</span>
            </div>
            <div>1. Click on dates to select them</div>
            <div>2. Choose a reason for blocking</div>
            <div>3. Click &quot;Block Dates&quot; to save</div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      {currentListing && (
        <AvailabilityCalendar
          listingId={currentListing.id}
          listingTitle={currentListing.title}
        />
      )}
    </div>
  )
}
