"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Search, X, SlidersHorizontal, Wifi, Car, Waves, Dumbbell,
  UtensilsCrossed, Tv, Wind, Briefcase, Sparkles
} from "lucide-react"

const AMENITY_OPTIONS = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "parking", label: "Parking", icon: Car },
  { id: "pool", label: "Pool", icon: Waves },
  { id: "gym", label: "Gym", icon: Dumbbell },
  { id: "kitchen", label: "Kitchen", icon: UtensilsCrossed },
  { id: "tv", label: "TV", icon: Tv },
  { id: "ac", label: "A/C", icon: Wind },
]

interface SearchFiltersProps {
  initialLocation?: string
  initialType?: string
  initialMinPrice?: string
  initialMaxPrice?: string
  initialBedrooms?: string
  initialAmenities?: string
  initialWorkFriendly?: string
}

export function SearchFilters({
  initialLocation = "",
  initialType = "all",
  initialMinPrice = "",
  initialMaxPrice = "",
  initialBedrooms = "any",
  initialAmenities = "",
  initialWorkFriendly = "",
}: SearchFiltersProps) {
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(false)

  const [location, setLocation] = useState(initialLocation)
  const [type, setType] = useState(initialType)
  const [minPrice, setMinPrice] = useState(initialMinPrice)
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice)
  const [bedrooms, setBedrooms] = useState(initialBedrooms)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialAmenities ? initialAmenities.split(",") : []
  )
  const [workFriendly, setWorkFriendly] = useState(initialWorkFriendly === "true")

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (location) params.set("location", location)
    if (type && type !== "all") params.set("type", type)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    if (bedrooms && bedrooms !== "any") params.set("bedrooms", bedrooms)
    if (selectedAmenities.length > 0) params.set("amenities", selectedAmenities.join(","))
    if (workFriendly) params.set("workFriendly", "true")

    router.push(`/search?${params.toString()}`)
    setShowFilters(false)
  }

  const handleClear = () => {
    setLocation("")
    setType("all")
    setMinPrice("")
    setMaxPrice("")
    setBedrooms("any")
    setSelectedAmenities([])
    setWorkFriendly(false)
    router.push("/search")
  }

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(a => a !== amenityId)
        : [...prev, amenityId]
    )
  }

  const hasFilters = location || type !== "all" || minPrice || maxPrice || bedrooms !== "any" || selectedAmenities.length > 0 || workFriendly
  const filterCount = [
    location,
    type !== "all",
    minPrice,
    maxPrice,
    bedrooms !== "any",
    selectedAmenities.length > 0,
    workFriendly
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Mobile: Search bar with filter toggle */}
      <div className="flex gap-2 md:hidden">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9 h-11"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 relative"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {filterCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </Button>
        <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 h-11 px-4">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile: Collapsible filters */}
      {showFilters && (
        <div className="p-4 bg-gray-50 rounded-lg md:hidden space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Condo">Condo</SelectItem>
                  <SelectItem value="Studio">Studio</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Bedrooms</label>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1 Bed</SelectItem>
                  <SelectItem value="2">2 Beds</SelectItem>
                  <SelectItem value="3">3 Beds</SelectItem>
                  <SelectItem value="4+">4+ Beds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Min Price</label>
              <Input
                type="number"
                placeholder="$0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min={0}
                className="h-10"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Max Price</label>
              <Input
                type="number"
                placeholder="Any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min={0}
                className="h-10"
              />
            </div>
          </div>

          {/* Work-Friendly Toggle */}
          <div
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              workFriendly ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
            }`}
            onClick={() => setWorkFriendly(!workFriendly)}
          >
            <Briefcase className={`h-5 w-5 ${workFriendly ? "text-blue-600" : "text-gray-400"}`} />
            <div className="flex-1">
              <p className={`text-sm font-medium ${workFriendly ? "text-blue-900" : "text-gray-700"}`}>
                Work-Friendly
              </p>
              <p className="text-xs text-gray-500">Fast WiFi, desk space</p>
            </div>
            <Checkbox checked={workFriendly} />
          </div>

          {/* Amenities */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleAmenity(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedAmenities.includes(id)
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-blue-300"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <Button variant="ghost" onClick={handleClear} className="w-full text-gray-500">
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Desktop: Inline filters */}
      <div className="hidden md:block space-y-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Location Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-gray-500 mb-1 block">Location</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="City, state, or address..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9"
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="w-[140px]">
            <label className="text-xs font-medium text-gray-500 mb-1 block">Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Condo">Condo</SelectItem>
                <SelectItem value="Studio">Studio</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="flex gap-2 items-end">
            <div className="w-[100px]">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Min Price</label>
              <Input
                type="number"
                placeholder="$0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min={0}
              />
            </div>
            <span className="text-gray-400 pb-2">-</span>
            <div className="w-[100px]">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Max Price</label>
              <Input
                type="number"
                placeholder="Any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min={0}
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div className="w-[120px]">
            <label className="text-xs font-medium text-gray-500 mb-1 block">Bedrooms</label>
            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4+">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Work-Friendly Toggle */}
          <button
            type="button"
            onClick={() => setWorkFriendly(!workFriendly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
              workFriendly
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span className="text-sm font-medium">Work-Friendly</span>
          </button>

          {/* Actions */}
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>

          {hasFilters && (
            <Button variant="ghost" onClick={handleClear} className="text-gray-500">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Amenities Row */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Amenities:</span>
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => toggleAmenity(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedAmenities.includes(id)
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
