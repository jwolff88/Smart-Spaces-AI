"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  Waves,
  Mountain,
  Building,
  Home,
  Sparkles,
  TrendingUp,
  Heart,
  Filter,
  Search,
  Bot,
  Zap,
} from "lucide-react"

interface Property {
  id: string
  title: string
  location: string
  price: number
  rating: number
  reviews: number
  image: string
  type: string
  amenities: string[]
  aiScore: number
  aiReason: string
  isNew?: boolean
  isTrending?: boolean
}

const mockProperties: Property[] = [
  {
    id: "1",
    title: "Modern Downtown Loft with City Views",
    location: "San Francisco, CA",
    price: 185,
    rating: 4.9,
    reviews: 127,
    image: "/placeholder.svg?height=200&width=300",
    type: "Apartment",
    amenities: ["Wifi", "Kitchen", "Parking", "Gym"],
    aiScore: 95,
    aiReason: "Perfect match for your urban lifestyle preferences and budget range",
    isTrending: true,
  },
  {
    id: "2",
    title: "Cozy Beach House with Ocean Access",
    location: "Malibu, CA",
    price: 220,
    rating: 4.8,
    reviews: 89,
    image: "/placeholder.svg?height=200&width=300",
    type: "House",
    amenities: ["Wifi", "Beach Access", "Hot Tub", "BBQ"],
    aiScore: 92,
    aiReason: "Matches your preference for waterfront properties and relaxation",
    isNew: true,
  },
  {
    id: "3",
    title: "Mountain Cabin Retreat",
    location: "Lake Tahoe, CA",
    price: 165,
    rating: 4.7,
    reviews: 156,
    image: "/placeholder.svg?height=200&width=300",
    type: "Cabin",
    amenities: ["Fireplace", "Hiking Trails", "Lake View", "Wifi"],
    aiScore: 88,
    aiReason: "Great for your interest in nature and outdoor activities",
  },
  {
    id: "4",
    title: "Luxury Penthouse Suite",
    location: "Beverly Hills, CA",
    price: 350,
    rating: 5.0,
    reviews: 43,
    image: "/placeholder.svg?height=200&width=300",
    type: "Penthouse",
    amenities: ["Pool", "Concierge", "Spa", "Valet"],
    aiScore: 85,
    aiReason: "Premium option matching your luxury accommodation interests",
  },
  {
    id: "5",
    title: "Historic Victorian Home",
    location: "Napa Valley, CA",
    price: 195,
    rating: 4.6,
    reviews: 78,
    image: "/placeholder.svg?height=200&width=300",
    type: "House",
    amenities: ["Wine Cellar", "Garden", "Fireplace", "Kitchen"],
    aiScore: 90,
    aiReason: "Perfect for your wine country getaway preferences",
  },
  {
    id: "6",
    title: "Minimalist Studio in Arts District",
    location: "Los Angeles, CA",
    price: 125,
    rating: 4.5,
    reviews: 92,
    image: "/placeholder.svg?height=200&width=300",
    type: "Studio",
    amenities: ["Wifi", "Art Galleries", "Cafes", "Public Transit"],
    aiScore: 87,
    aiReason: "Matches your creative interests and budget-conscious approach",
  },
]

export default function RecommendationsPage() {
  const [preferences, setPreferences] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    priceRange: [100, 300],
    propertyType: "any",
    amenities: [] as string[],
  })

  const [filteredProperties, setFilteredProperties] = useState(mockProperties)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  const amenityOptions = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "parking", label: "Parking", icon: Car },
    { id: "kitchen", label: "Kitchen", icon: Coffee },
    { id: "pool", label: "Pool", icon: Waves },
    { id: "mountain", label: "Mountain View", icon: Mountain },
    { id: "city", label: "City View", icon: Building },
  ]

  const runAIAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  useEffect(() => {
    // Simulate initial AI analysis
    runAIAnalysis()
  }, [])

  const PropertyCard = ({ property }: { property: Property }) => (
    <Link href={`/property/${property.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm hover:shadow-xl">
        <div className="relative">
          <img
            src={property.image || "/placeholder.svg"}
            alt={property.title}
            className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {property.isNew && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
            {property.isTrending && (
              <Badge className="bg-orange-500 hover:bg-orange-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending
              </Badge>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">{property.aiScore}%</span>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
              {property.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 text-gray-600 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{property.location}</span>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{property.rating}</span>
              <span className="text-sm text-gray-500">({property.reviews})</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {property.type}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {property.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {property.amenities.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{property.amenities.length - 3} more
              </Badge>
            )}
          </div>

          <div className="bg-primary/5 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI Insight</span>
            </div>
            <p className="text-xs text-gray-600">{property.aiReason}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">${property.price}</span>
              <span className="text-sm text-gray-500">/ night</span>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">🏡</span>
                </div>
                <span className="text-xl font-bold">Smart Spaces AI</span>
              </Link>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>AI-Powered Recommendations</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* AI Analysis Status */}
        {isAnalyzing && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-2">AI is analyzing your preferences...</h3>
                  <Progress value={analysisProgress} className="h-2" />
                  <p className="text-sm text-gray-600 mt-2">
                    Finding the perfect properties based on your preferences and behavior patterns
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Find Your Perfect Stay
            </CardTitle>
            <CardDescription>Our AI analyzes thousands of properties to find your ideal match</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="location">Where to?</Label>
                <Input
                  id="location"
                  placeholder="City, region, or landmark"
                  value={preferences.location}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkin">Check-in</Label>
                <Input
                  id="checkin"
                  type="date"
                  value={preferences.checkIn}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, checkIn: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkout">Check-out</Label>
                <Input
                  id="checkout"
                  type="date"
                  value={preferences.checkOut}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, checkOut: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guests">Guests</Label>
                <Select
                  value={preferences.guests.toString()}
                  onValueChange={(value) => setPreferences((prev) => ({ ...prev, guests: Number.parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button onClick={runAIAnalysis} className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Get AI Recommendations
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t space-y-6">
                <div className="space-y-4">
                  <Label>Price Range (per night)</Label>
                  <div className="px-4">
                    <Slider
                      value={preferences.priceRange}
                      onValueChange={(value) => setPreferences((prev) => ({ ...prev, priceRange: value }))}
                      max={500}
                      min={50}
                      step={25}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>${preferences.priceRange[0]}</span>
                      <span>${preferences.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Property Type</Label>
                  <Select
                    value={preferences.propertyType}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, propertyType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any type</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="cabin">Cabin</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenityOptions.map((amenity) => (
                      <div key={amenity.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity.id}
                          checked={preferences.amenities.includes(amenity.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPreferences((prev) => ({
                                ...prev,
                                amenities: [...prev.amenities, amenity.id],
                              }))
                            } else {
                              setPreferences((prev) => ({
                                ...prev,
                                amenities: prev.amenities.filter((a) => a !== amenity.id),
                              }))
                            }
                          }}
                        />
                        <Label htmlFor={amenity.id} className="flex items-center gap-2 cursor-pointer">
                          <amenity.icon className="w-4 h-4" />
                          {amenity.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <Tabs defaultValue="recommended" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommended" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Recommended
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              All Properties
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommended" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Recommended for You</h2>
                <p className="text-gray-600">Properties selected by our AI based on your preferences</p>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Bot className="w-4 h-4" />
                AI Powered
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties
                .sort((a, b) => b.aiScore - a.aiScore)
                .map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Trending Properties</h2>
              <p className="text-gray-600">Popular choices among travelers this week</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties
                .filter((p) => p.isTrending || p.isNew)
                .map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">All Properties</h2>
                <p className="text-gray-600">Browse our complete collection</p>
              </div>
              <div className="text-sm text-gray-600">{filteredProperties.length} properties found</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
