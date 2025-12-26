"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Home, BedDouble, Sparkles, Briefcase, Wifi } from "lucide-react"
import { memo } from "react"

interface ListingCardProps {
  listing: {
    id: string
    title: string
    location: string
    price: number
    currentPrice?: number
    bedrooms?: string
    type?: string
    imageSrc?: string
    matchScore?: number
    matchReasons?: string[]
    workFriendly?: boolean
    wifiSpeed?: number
  }
}

function ListingCardComponent({ listing }: ListingCardProps) {
  const displayPrice = listing.currentPrice || listing.price
  const matchScore = listing.matchScore || 85

  return (
    <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-transparent hover:border-gray-200 overflow-hidden">
      {/* Image */}
      <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
        {listing.imageSrc ? (
          <Image
            src={listing.imageSrc}
            alt={listing.title || "Listing Image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIRAAAgIBAwUBAAAAAAAAAAAAAQIDEQAEEiEFEzFBUWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBf/EABkRAAIDAQAAAAAAAAAAAAAAAAECABEhA//aAAwDAQACEQMRAD8AwWTqOrTUdtI5pDGsZZQ7bgoq6B8DyfrE/wBz2GJNmBYWdsWn/9k="
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
            <Home className="h-12 w-12 opacity-20" />
          </div>
        )}

        {/* Match Score Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            className={`font-bold backdrop-blur-sm shadow-sm ${
              matchScore >= 90
                ? "bg-green-500 text-white"
                : matchScore >= 75
                ? "bg-blue-500 text-white"
                : "bg-white/90 text-gray-700"
            }`}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            {matchScore}% Match
          </Badge>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="font-bold bg-white/90 backdrop-blur-sm shadow-sm">
            ${displayPrice}{" "}
            <span className="font-normal text-xs ml-1 text-gray-500">/ night</span>
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
          {listing.title}
        </h3>

        <div className="flex items-center text-gray-500 text-sm mb-3 mt-1">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{listing.location}</span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          {listing.bedrooms && (
            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
              <BedDouble className="h-3 w-3" />
              {listing.bedrooms} Beds
            </div>
          )}
          {listing.type && (
            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
              <Home className="h-3 w-3" />
              {listing.type}
            </div>
          )}
          {listing.workFriendly && (
            <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
              <Briefcase className="h-3 w-3" />
              Work-Friendly
            </div>
          )}
          {listing.wifiSpeed && listing.wifiSpeed >= 50 && (
            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-md">
              <Wifi className="h-3 w-3" />
              {listing.wifiSpeed}Mbps
            </div>
          )}
        </div>

        {/* Match Reasons */}
        {listing.matchReasons && listing.matchReasons.length > 0 && matchScore >= 70 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 line-clamp-2">
              {listing.matchReasons.slice(0, 2).join(" • ")}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full bg-slate-900 group-hover:bg-blue-600 transition-colors">
          <Link href={`/listings/${listing.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Memoize to prevent unnecessary re-renders
export const ListingCard = memo(ListingCardComponent)
