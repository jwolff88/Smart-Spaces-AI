"use client"

/*
  SEARCH FILTERS
  Philosophy: Minimal, functional, no visual noise

  - Clean inputs with consistent styling
  - Toggle buttons instead of pill badges
  - No filter count badges
  - Restrained color usage
*/

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, SlidersHorizontal } from "lucide-react"

const AMENITY_OPTIONS = [
  { id: "wifi", label: "WiFi" },
  { id: "parking", label: "Parking" },
  { id: "pool", label: "Pool" },
  { id: "gym", label: "Gym" },
  { id: "kitchen", label: "Kitchen" },
  { id: "tv", label: "TV" },
  { id: "ac", label: "A/C" },
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9 h-11 bg-background"
          />
        </div>
        <button
          type="button"
          className={`h-11 w-11 inline-flex items-center justify-center rounded-md border transition-colors ${
            hasFilters
              ? "border-primary bg-primary/5 text-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
        <Button
          onClick={handleSearch}
          className="h-11 px-4 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile: Collapsible filters */}
      {showFilters && (
        <div className="p-4 bg-secondary/50 rounded-md md:hidden space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-10 bg-background">
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
              <label className="text-xs text-muted-foreground mb-1.5 block">Bedrooms</label>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="h-10 bg-background">
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
              <label className="text-xs text-muted-foreground mb-1.5 block">Min price</label>
              <Input
                type="number"
                placeholder="$0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min={0}
                className="h-10 bg-background"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Max price</label>
              <Input
                type="number"
                placeholder="Any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min={0}
                className="h-10 bg-background"
              />
            </div>
          </div>

          {/* Work-Friendly Toggle */}
          <button
            type="button"
            onClick={() => setWorkFriendly(!workFriendly)}
            className={`w-full h-10 px-3 rounded-md border text-sm font-medium transition-colors ${
              workFriendly
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-background text-muted-foreground"
            }`}
          >
            Work-friendly only
          </button>

          {/* Amenities */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleAmenity(id)}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    selectedAmenities.includes(id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Desktop: Inline filters */}
      <div className="hidden md:block space-y-3">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Location Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted-foreground mb-1.5 block">Location</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="City, state, or address..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9 bg-background"
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="w-[140px]">
            <label className="text-xs text-muted-foreground mb-1.5 block">Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-background">
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
              <label className="text-xs text-muted-foreground mb-1.5 block">Min price</label>
              <Input
                type="number"
                placeholder="$0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min={0}
                className="bg-background"
              />
            </div>
            <span className="text-muted-foreground pb-2.5">–</span>
            <div className="w-[100px]">
              <label className="text-xs text-muted-foreground mb-1.5 block">Max price</label>
              <Input
                type="number"
                placeholder="Any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min={0}
                className="bg-background"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div className="w-[110px]">
            <label className="text-xs text-muted-foreground mb-1.5 block">Bedrooms</label>
            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger className="bg-background">
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
            className={`h-10 px-4 rounded-md border text-sm font-medium transition-colors ${
              workFriendly
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            Work-friendly
          </button>

          {/* Actions */}
          <Button
            onClick={handleSearch}
            className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Search
          </Button>

          {hasFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="h-10 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Amenities Row */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Amenities:</span>
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => toggleAmenity(id)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  selectedAmenities.includes(id)
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
