import { db } from "@/lib/db"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Home, BedDouble, ArrowLeft, Sparkles, Briefcase, Wifi, Heart, User, Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { SearchFilters } from "./search-filters"

export const dynamic = 'force-dynamic'

// Match score calculation (duplicated from API for server-side use)
function calculateMatchScore(profile: any, listing: any): { score: number; reasons: string[] } {
  if (!profile) return { score: 85, reasons: ["Popular choice"] }

  let score = 0
  const reasons: string[] = []

  // Travel Intent Match (25 points)
  if (profile.travelIntent && listing.idealFor?.includes(profile.travelIntent)) {
    score += 25
    reasons.push(`Perfect for ${profile.travelIntent.replace("_", " ")}`)
  } else if (profile.travelIntent === "remote_work" && listing.workFriendly) {
    score += 20
    reasons.push("Work-friendly space")
  }

  // Vibe Match (20 points)
  if (profile.preferredVibes?.length > 0 && listing.vibes?.length > 0) {
    const vibeMatches = profile.preferredVibes.filter((v: string) => listing.vibes?.includes(v))
    score += Math.min(20, (vibeMatches.length / profile.preferredVibes.length) * 20)
    if (vibeMatches.length > 0) {
      reasons.push(`Matches your vibe: ${vibeMatches.slice(0, 2).join(", ")}`)
    }
  }

  // Work Amenities (15 points for remote workers)
  if (profile.travelIntent === "remote_work" && profile.workNeeds?.length > 0) {
    const workMatches = profile.workNeeds.filter((w: string) => listing.workAmenities?.includes(w))
    score += Math.min(15, (workMatches.length / profile.workNeeds.length) * 15)
    if (listing.wifiSpeed && listing.wifiSpeed >= 50) {
      score += 5
      reasons.push(`Fast WiFi: ${listing.wifiSpeed} Mbps`)
    }
  } else {
    score += 15
  }

  // Amenities Match (20 points)
  if (profile.mustHaveAmenities?.length > 0 && listing.amenities?.length > 0) {
    const amenityMatches = profile.mustHaveAmenities.filter((a: string) =>
      listing.amenities?.some((la: string) => la.toLowerCase().includes(a.toLowerCase()))
    )
    score += Math.min(20, (amenityMatches.length / profile.mustHaveAmenities.length) * 20)
    if (amenityMatches.length > 0) {
      reasons.push(`Has ${amenityMatches.length}/${profile.mustHaveAmenities.length} must-haves`)
    }
  }

  // Budget Match (10 points)
  if (profile.budgetRange) {
    const price = listing.currentPrice || listing.price
    const budgetMatch =
      (profile.budgetRange === "budget" && price < 100) ||
      (profile.budgetRange === "moderate" && price >= 100 && price <= 250) ||
      (profile.budgetRange === "luxury" && price > 250)
    if (budgetMatch) {
      score += 10
      reasons.push("Within budget")
    }
  }

  // Property Type Match (10 points)
  if (profile.preferredTypes?.length > 0) {
    const typeMatch = profile.preferredTypes.some((t: string) =>
      listing.type?.toLowerCase().includes(t.toLowerCase())
    )
    if (typeMatch) {
      score += 10
    }
  }

  return { score: Math.round(Math.min(100, score)), reasons }
}

interface SearchParams {
  location?: string
  type?: string
  minPrice?: string
  maxPrice?: string
  bedrooms?: string
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const session = await auth()

  // Fetch traveler profile if logged in
  let travelerProfile = null
  if (session?.user?.id) {
    travelerProfile = await db.travelerProfile.findUnique({
      where: { userId: session.user.id },
    })
  }

  // Build filter conditions
  const where: Record<string, unknown> = {}

  if (params.location) {
    where.location = {
      contains: params.location,
      mode: "insensitive",
    }
  }

  if (params.type && params.type !== "all") {
    where.type = params.type
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {}
    if (params.minPrice) {
      (where.price as Record<string, number>).gte = parseFloat(params.minPrice)
    }
    if (params.maxPrice) {
      (where.price as Record<string, number>).lte = parseFloat(params.maxPrice)
    }
  }

  if (params.bedrooms && params.bedrooms !== "any") {
    where.bedrooms = params.bedrooms
  }

  const rawListings = await db.listing.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })

  // Calculate match scores and sort by score
  const listings = rawListings.map((listing) => {
    const { score, reasons } = calculateMatchScore(travelerProfile, listing)
    return { ...listing, matchScore: score, matchReasons: reasons }
  }).sort((a, b) => b.matchScore - a.matchScore)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="font-bold text-xl">Explore Stays</h1>
          </div>
          <div className="flex items-center gap-3">
            {session?.user ? (
              <>
                <Link href="/onboarding">
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    <Settings className="h-4 w-4 mr-1" />
                    Preferences
                  </Button>
                </Link>
                <Link href="/guest-dashboard">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-1" />
                    {session.user.name || "Dashboard"}
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/login?role=traveler">
                <Button variant="outline">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white border-b py-4">
        <div className="max-w-7xl mx-auto px-6">
          <SearchFilters
            initialLocation={params.location}
            initialType={params.type}
            initialMinPrice={params.minPrice}
            initialMaxPrice={params.maxPrice}
            initialBedrooms={params.bedrooms}
          />
        </div>
      </div>

      {/* Smart Matching Banner */}
      {session?.user && !travelerProfile && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium">
                Complete your travel profile for personalized matches
              </span>
            </div>
            <Link href="/onboarding">
              <Button size="sm" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Set Up Profile
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Active Matching Indicator */}
      {travelerProfile && (
        <div className="bg-green-50 border-b border-green-100 py-2">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-green-700 text-sm">
            <Sparkles className="h-4 w-4" />
            <span>
              AI Matching Active - Showing best matches for{" "}
              <strong className="font-medium">{travelerProfile.travelIntent?.replace("_", " ") || "your preferences"}</strong>
            </span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-6">
        {/* Results count */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {listings.length} {listings.length === 1 ? "property" : "properties"} found
            {params.location && ` in "${params.location}"`}
          </span>
          {travelerProfile && (
            <span className="text-xs text-gray-400">Sorted by match score</span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-transparent hover:border-gray-200">
              
              {/* IMAGE SECTION - UPDATED */}
              <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden rounded-t-xl">
                {listing.imageSrc ? (
                  <Image
                    src={listing.imageSrc}
                    alt={listing.title || "Listing Image"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100 group-hover:scale-105 transition-transform duration-500">
                    <Home className="h-12 w-12 opacity-20" />
                  </div>
                )}

                {/* Match Score Badge */}
                <div className="absolute top-3 left-3">
                  <Badge
                    className={`font-bold backdrop-blur-sm shadow-sm ${
                      listing.matchScore >= 90
                        ? "bg-green-500 text-white"
                        : listing.matchScore >= 75
                        ? "bg-blue-500 text-white"
                        : "bg-white/90 text-gray-700"
                    }`}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {listing.matchScore}% Match
                  </Badge>
                </div>

                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="font-bold bg-white/90 backdrop-blur-sm shadow-sm">
                    ${listing.currentPrice || listing.price} <span className="font-normal text-xs ml-1 text-gray-500">/ night</span>
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {listing.title}
                  </h3>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="line-clamp-1">{listing.location}</span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                    <BedDouble className="h-3 w-3" />
                    {listing.bedrooms} Beds
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                    <Home className="h-3 w-3" />
                    {listing.type}
                  </div>
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
                {listing.matchReasons && listing.matchReasons.length > 0 && listing.matchScore >= 70 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {listing.matchReasons.slice(0, 2).join(" • ")}
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full bg-slate-900 group-hover:bg-blue-600 transition-colors">
                  <Link href={`/listings/${listing.id}`}>
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          {listings.length === 0 && (
            <div className="col-span-full text-center py-20">
              <h3 className="text-xl font-medium text-gray-900">No listings found</h3>
              <p className="text-gray-500 mt-2">Be the first to host a property!</p>
              <Link href="/host-dashboard/add-property" className="mt-6 inline-block">
                <Button>Create Listing</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}