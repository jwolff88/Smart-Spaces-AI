import { db } from "@/lib/db"
import { auth } from "@/auth"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, User } from "lucide-react"
import { SearchFilters } from "./search-filters"
import { Metadata } from "next"

/*
  SEARCH PAGE
  Philosophy: Neon Futuristic Holographic

  - Dark background with cyan grid
  - Glowing cards on hover
  - Neon accent colors
  - Glass morphism header
*/

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Search Vacation Rentals",
  description: "Find your perfect vacation rental with AI-powered matching. Filter by location, price, amenities, and more. Work-friendly spaces available.",
  openGraph: {
    title: "Search Vacation Rentals | Smart Spaces",
    description: "Find your perfect vacation rental with AI-powered matching.",
  },
}

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
  amenities?: string
  workFriendly?: string
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

  // Build filter conditions - only show active listings
  const where: Record<string, unknown> = {
    status: "active",
  }

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

  // Filter by work-friendly
  if (params.workFriendly === "true") {
    where.workFriendly = true
  }

  // Filter by amenities (case-insensitive partial match)
  if (params.amenities) {
    const requestedAmenities = params.amenities.split(",")
    where.AND = requestedAmenities.map(amenity => ({
      amenities: {
        hasSome: [amenity]
      }
    }))
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
    <div className="min-h-screen bg-background bg-grid relative">
      {/* Ambient glow */}
      <div className="fixed top-0 right-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-neon">
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="hover:glow-cyan transition-all">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <span className="text-lg font-bold tracking-wider text-foreground text-glow-cyan">
                EXPLORE
              </span>
            </div>
            <div className="flex items-center gap-3">
              {session?.user ? (
                <>
                  <Link href="/onboarding">
                    <Button variant="ghost" size="sm" className="hover:text-primary transition-all">
                      <Settings className="h-4 w-4 mr-1" />
                      Preferences
                    </Button>
                  </Link>
                  <Link href="/guest-dashboard">
                    <Button variant="outline" size="sm" className="border-primary/50 hover:glow-cyan transition-all">
                      <User className="h-4 w-4 mr-1" />
                      {session.user.name || "Dashboard"}
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/login?role=traveler">
                  <Button className="bg-primary hover:bg-primary/80 glow-cyan transition-all">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Filters */}
      <div className="border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <SearchFilters
            initialLocation={params.location}
            initialType={params.type}
            initialMinPrice={params.minPrice}
            initialMaxPrice={params.maxPrice}
            initialBedrooms={params.bedrooms}
            initialAmenities={params.amenities}
            initialWorkFriendly={params.workFriendly}
          />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Results header */}
        <div className="mb-8">
          <h1 className="text-title text-foreground mb-2">
            {params.location ? `Stays in ${params.location}` : "All stays"}
          </h1>
          <p className="text-body text-muted-foreground">
            {listings.length} {listings.length === 1 ? "property" : "properties"}
            {travelerProfile && " · Sorted by match"}
          </p>
        </div>

        {/* Listings Grid - Editorial cards */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="group block"
              >
                <article>
                  {/* Image - Clean, no overlays */}
                  <div className="aspect-[4/3] bg-secondary rounded-md overflow-hidden mb-4 relative">
                    {listing.imageSrc ? (
                      <Image
                        src={listing.imageSrc}
                        alt={listing.title || "Property"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                        <span className="text-4xl">⌂</span>
                      </div>
                    )}
                  </div>

                  {/* Content - Typography-driven */}
                  <div className="space-y-2">
                    {/* Title and price on same line */}
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="text-base font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {listing.title}
                      </h2>
                      <span className="text-sm font-medium text-foreground flex-shrink-0">
                        ${listing.currentPrice || listing.price}
                        <span className="text-muted-foreground font-normal">/night</span>
                      </span>
                    </div>

                    {/* Location */}
                    <p className="text-sm text-muted-foreground">
                      {listing.location}
                    </p>

                    {/* Details line */}
                    <p className="text-sm text-muted-foreground">
                      {listing.bedrooms} {listing.bedrooms === 1 ? "bedroom" : "bedrooms"} · {listing.type}
                      {listing.workFriendly && " · Work-friendly"}
                    </p>

                    {/* Match score - Subtle, contextual */}
                    {listing.matchScore >= 70 && (
                      <p className="text-sm text-primary">
                        {listing.matchScore}% match
                        {listing.matchReasons?.[0] && (
                          <span className="text-muted-foreground"> · {listing.matchReasons[0]}</span>
                        )}
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-muted-foreground mb-2">No properties found</p>
            <p className="text-sm text-muted-foreground/70 mb-6">
              Try adjusting your filters or search in a different area.
            </p>
            <Link
              href="/search"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Clear all filters
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}