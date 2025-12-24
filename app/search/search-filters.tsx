"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface SearchFiltersProps {
  initialLocation?: string
  initialType?: string
  initialMinPrice?: string
  initialMaxPrice?: string
  initialBedrooms?: string
}

export function SearchFilters({
  initialLocation = "",
  initialType = "all",
  initialMinPrice = "",
  initialMaxPrice = "",
  initialBedrooms = "any",
}: SearchFiltersProps) {
  const router = useRouter()

  const [location, setLocation] = useState(initialLocation)
  const [type, setType] = useState(initialType)
  const [minPrice, setMinPrice] = useState(initialMinPrice)
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice)
  const [bedrooms, setBedrooms] = useState(initialBedrooms)

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (location) params.set("location", location)
    if (type && type !== "all") params.set("type", type)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    if (bedrooms && bedrooms !== "any") params.set("bedrooms", bedrooms)

    router.push(`/search?${params.toString()}`)
  }

  const handleClear = () => {
    setLocation("")
    setType("all")
    setMinPrice("")
    setMaxPrice("")
    setBedrooms("any")
    router.push("/search")
  }

  const hasFilters = location || type !== "all" || minPrice || maxPrice || bedrooms !== "any"

  return (
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
  )
}
