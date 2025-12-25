import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

interface MatchedListing {
  listing: any
  matchScore: number
  matchReasons: string[]
}

// Calculate match score between traveler profile and listing
function calculateMatchScore(profile: any, listing: any): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []
  const maxScore = 100

  // 1. Travel Intent Match (25 points)
  if (profile.travelIntent && listing.idealFor?.includes(profile.travelIntent)) {
    score += 25
    reasons.push(`Perfect for ${profile.travelIntent.replace("_", " ")}`)
  } else if (profile.travelIntent === "remote_work" && listing.workFriendly) {
    score += 20
    reasons.push("Work-friendly space")
  }

  // 2. Vibe Match (20 points)
  if (profile.preferredVibes?.length > 0 && listing.vibes?.length > 0) {
    const vibeMatches = profile.preferredVibes.filter((v: string) => listing.vibes?.includes(v))
    const vibeScore = Math.min(20, (vibeMatches.length / profile.preferredVibes.length) * 20)
    score += vibeScore
    if (vibeMatches.length > 0) {
      reasons.push(`Matches your vibe: ${vibeMatches.slice(0, 2).join(", ")}`)
    }
  }

  // 3. Work Amenities Match (15 points - only for remote workers)
  if (profile.travelIntent === "remote_work" && profile.workNeeds?.length > 0) {
    const workMatches = profile.workNeeds.filter((w: string) => listing.workAmenities?.includes(w))
    const workScore = Math.min(15, (workMatches.length / profile.workNeeds.length) * 15)
    score += workScore

    // WiFi speed bonus
    if (profile.workNeeds.includes("fast_wifi") && listing.wifiSpeed && listing.wifiSpeed >= 50) {
      score += 5
      reasons.push(`Fast WiFi: ${listing.wifiSpeed} Mbps`)
    }
  } else {
    // Non-remote workers get these points automatically
    score += 15
  }

  // 4. Amenities Match (20 points)
  if (profile.mustHaveAmenities?.length > 0 && listing.amenities?.length > 0) {
    const amenityMatches = profile.mustHaveAmenities.filter((a: string) =>
      listing.amenities?.some((la: string) => la.toLowerCase().includes(a.toLowerCase()))
    )
    const amenityScore = Math.min(20, (amenityMatches.length / profile.mustHaveAmenities.length) * 20)
    score += amenityScore
    if (amenityMatches.length > 0) {
      reasons.push(`Has ${amenityMatches.length}/${profile.mustHaveAmenities.length} must-have amenities`)
    }
  }

  // 5. Budget Match (10 points)
  if (profile.budgetRange) {
    const price = listing.currentPrice || listing.price
    let budgetMatch = false

    switch (profile.budgetRange) {
      case "budget":
        budgetMatch = price < 100
        break
      case "moderate":
        budgetMatch = price >= 100 && price <= 250
        break
      case "luxury":
        budgetMatch = price > 250
        break
    }

    if (budgetMatch) {
      score += 10
      reasons.push("Within your budget")
    }
  }

  // 6. Property Type Match (10 points)
  if (profile.preferredTypes?.length > 0) {
    const typeMatch = profile.preferredTypes.some((t: string) =>
      listing.type?.toLowerCase().includes(t.toLowerCase())
    )
    if (typeMatch) {
      score += 10
      reasons.push(`${listing.type} - your preferred type`)
    }
  }

  // Normalize to 100
  const normalizedScore = Math.round(Math.min(100, score))

  return { score: normalizedScore, reasons }
}

export async function GET(req: Request) {
  try {
    const session = await auth()
    const { searchParams } = new URL(req.url)

    const location = searchParams.get("location")
    const checkIn = searchParams.get("checkIn")
    const checkOut = searchParams.get("checkOut")
    const guests = searchParams.get("guests")
    const limit = parseInt(searchParams.get("limit") || "10")

    // Get traveler profile if authenticated
    let profile = null
    if (session?.user?.id) {
      profile = await db.travelerProfile.findUnique({
        where: { userId: session.user.id },
      })
    }

    // Base query for listings
    const whereClause: any = {}

    if (location) {
      whereClause.location = {
        contains: location,
        mode: "insensitive",
      }
    }

    if (guests) {
      whereClause.maxGuests = {
        gte: parseInt(guests),
      }
    }

    // Fetch listings
    const listings = await db.listing.findMany({
      where: whereClause,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      take: limit * 2, // Fetch more to allow for sorting
    })

    // If no profile, return listings with default scores
    if (!profile) {
      const results = listings.map((listing) => ({
        ...listing,
        matchScore: listing.matchScore || 85,
        matchReasons: ["Popular choice"],
      }))

      return NextResponse.json({
        listings: results.slice(0, limit),
        hasProfile: false,
        message: "Complete your travel profile for personalized matches",
      })
    }

    // Calculate match scores for each listing
    const matchedListings: MatchedListing[] = listings.map((listing) => {
      const { score, reasons } = calculateMatchScore(profile, listing)
      return {
        listing,
        matchScore: score,
        matchReasons: reasons,
      }
    })

    // Sort by match score (highest first)
    matchedListings.sort((a, b) => b.matchScore - a.matchScore)

    // Take top results and flatten
    const results = matchedListings.slice(0, limit).map((m) => ({
      ...m.listing,
      matchScore: m.matchScore,
      matchReasons: m.matchReasons,
    }))

    return NextResponse.json({
      listings: results,
      hasProfile: true,
      profileIntent: profile.travelIntent,
    })
  } catch (error) {
    console.error("AI Match error:", error)
    return NextResponse.json(
      { error: "Failed to get matches" },
      { status: 500 }
    )
  }
}

// POST - Get matches for specific criteria (used by search)
export async function POST(req: Request) {
  try {
    const session = await auth()
    const body = await req.json()

    const { listingIds, location, minPrice, maxPrice, amenities } = body

    // Get traveler profile if authenticated
    let profile = null
    if (session?.user?.id) {
      profile = await db.travelerProfile.findUnique({
        where: { userId: session.user.id },
      })
    }

    // Build query
    const whereClause: any = {}

    if (listingIds?.length > 0) {
      whereClause.id = { in: listingIds }
    }

    if (location) {
      whereClause.location = {
        contains: location,
        mode: "insensitive",
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.price = {}
      if (minPrice !== undefined) whereClause.price.gte = minPrice
      if (maxPrice !== undefined) whereClause.price.lte = maxPrice
    }

    if (amenities?.length > 0) {
      whereClause.amenities = {
        hasSome: amenities,
      }
    }

    const listings = await db.listing.findMany({
      where: whereClause,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Calculate match scores
    const results = listings.map((listing) => {
      if (!profile) {
        return {
          ...listing,
          matchScore: listing.matchScore || 85,
          matchReasons: ["Popular choice"],
        }
      }

      const { score, reasons } = calculateMatchScore(profile, listing)
      return {
        ...listing,
        matchScore: score,
        matchReasons: reasons,
      }
    })

    // Sort by match score
    results.sort((a, b) => b.matchScore - a.matchScore)

    return NextResponse.json({
      listings: results,
      hasProfile: !!profile,
    })
  } catch (error) {
    console.error("AI Match POST error:", error)
    return NextResponse.json(
      { error: "Failed to get matches" },
      { status: 500 }
    )
  }
}
