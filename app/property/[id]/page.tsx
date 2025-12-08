"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Car, Heart, MapPin, Share, Star, Users, Wifi, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { BookingWidget } from "@/components/booking-widget"
import { ImageGallery } from "@/components/image-gallery"
import { ReviewsSection } from "@/components/reviews-section"
import { AmenitiesGrid } from "@/components/amenities-grid"
import { LocationMap } from "@/components/location-map"

// Mock property data
const property = {
  id: "1",
  title: "Modern Downtown Loft with City Views",
  location: "Downtown Seattle, WA",
  coordinates: { lat: 47.6062, lng: -122.3321 },
  price: 185,
  originalPrice: 220,
  rating: 4.9,
  reviewCount: 127,
  bedrooms: 2,
  bathrooms: 2,
  guests: 4,
  host: {
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "Joined in 2019",
    responseRate: "100%",
    responseTime: "Within an hour",
    isSuperhost: true,
  },
  description: `Experience the heart of Seattle from this stunning modern loft featuring floor-to-ceiling windows with breathtaking city views. This thoughtfully designed space combines contemporary luxury with urban convenience, perfect for business travelers and city explorers alike.

The open-concept living area flows seamlessly into a fully equipped gourmet kitchen with premium appliances and a spacious dining area. Both bedrooms offer comfortable queen beds with high-quality linens, while the master suite includes an en-suite bathroom with a rainfall shower.

Located in the vibrant downtown core, you'll be steps away from Pike Place Market, world-class dining, shopping, and major tech companies. The building offers 24/7 concierge service and a rooftop terrace with panoramic city views.`,
  amenities: [
    { icon: Wifi, name: "High-speed WiFi", category: "Internet" },
    { icon: Car, name: "Free parking", category: "Parking" },
    { icon: Zap, name: "Air conditioning", category: "Climate" },
    { icon: Users, name: "Workspace", category: "Work" },
  ],
  images: [
    "/placeholder.svg?height=600&width=800&text=Living Room",
    "/placeholder.svg?height=600&width=800&text=Kitchen",
    "/placeholder.svg?height=600&width=800&text=Bedroom",
    "/placeholder.svg?height=600&width=800&text=Bathroom",
    "/placeholder.svg?height=600&width=800&text=City View",
  ],
  aiInsights: {
    priceOptimization: "AI optimized pricing - 16% below market average",
    demandForecast: "High demand expected this weekend",
    matchScore: 95,
  },
}

export default function PropertyListing() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4">
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Share className="h-4 w-4" />
              Share
            </Button>
            <Button variant="ghost" size="sm" className="gap-2" onClick={() => setIsLiked(!isLiked)}>
              <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              Save
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        {/* Property Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-2 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold">{property.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{property.rating}</span>
                <span>({property.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{property.location}</span>
              </div>
            </div>
          </div>

          {/* AI Insights Banner */}
          <div className="mb-6">
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">AI Insights</span>
                </div>
                <div className="grid gap-2 md:grid-cols-3 text-sm">
                  <div className="text-green-700 dark:text-green-300">💰 {property.aiInsights.priceOptimization}</div>
                  <div className="text-green-700 dark:text-green-300">📈 {property.aiInsights.demandForecast}</div>
                  <div className="text-green-700 dark:text-green-300">
                    🎯 {property.aiInsights.matchScore}% match for your preferences
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery images={property.images} />

            {/* Property Details */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Entire loft hosted by {property.host.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{property.guests} guests</span>
                    <span>•</span>
                    <span>{property.bedrooms} bedrooms</span>
                    <span>•</span>
                    <span>{property.bathrooms} bathrooms</span>
                  </div>
                </div>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={property.host.avatar || "/placeholder.svg"} alt={property.host.name} />
                  <AvatarFallback>
                    {property.host.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>

              {property.host.isSuperhost && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                    ⭐ Superhost
                  </Badge>
                  <span className="text-sm text-muted-foreground">Superhosts are experienced, highly rated hosts.</span>
                </div>
              )}

              <Separator />

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">About this place</h3>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {property.description.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Amenities */}
              <AmenitiesGrid amenities={property.amenities} />

              <Separator />

              {/* Location */}
              <LocationMap title="Where you'll be" location={property.location} coordinates={property.coordinates} />
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingWidget
                price={property.price}
                originalPrice={property.originalPrice}
                rating={property.rating}
                reviewCount={property.reviewCount}
              />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <ReviewsSection rating={property.rating} reviewCount={property.reviewCount} />
        </div>

        {/* Host Information */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={property.host.avatar || "/placeholder.svg"} alt={property.host.name} />
                  <AvatarFallback>
                    {property.host.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Hosted by {property.host.name}</CardTitle>
                  <CardDescription>{property.host.joinDate}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">Response rate: {property.host.responseRate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Response time: {property.host.responseTime}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline">Contact host</Button>
                <Button variant="outline">Show phone number</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
