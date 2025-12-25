import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

interface PricingFactors {
  baseDemand: number      // 0-100 based on bookings
  seasonalFactor: number  // 0.8-1.5 multiplier
  dayOfWeek: number       // Weekend premium
  competitorIndex: number // Market position
  occupancyRate: number   // Host's current occupancy
}

// Calculate demand score based on recent bookings and searches
async function calculateDemandScore(listingId: string): Promise<number> {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Count recent bookings for this listing
  const recentBookings = await db.booking.count({
    where: {
      listingId,
      createdAt: { gte: thirtyDaysAgo },
      status: { in: ["confirmed", "completed"] },
    },
  })

  // Base demand on booking frequency (0-100)
  // 0 bookings = 30, 1-2 = 50, 3-5 = 70, 6+ = 90
  if (recentBookings === 0) return 30
  if (recentBookings <= 2) return 50
  if (recentBookings <= 5) return 70
  return Math.min(95, 70 + recentBookings * 3)
}

// Get seasonal multiplier based on month and location
function getSeasonalMultiplier(location: string): number {
  const month = new Date().getMonth()

  // Beach locations peak in summer
  const beachKeywords = ["beach", "coast", "ocean", "sea", "island"]
  const isBeach = beachKeywords.some((k) => location.toLowerCase().includes(k))

  // Mountain locations peak in winter and summer
  const mountainKeywords = ["mountain", "ski", "snow", "alps", "highland"]
  const isMountain = mountainKeywords.some((k) => location.toLowerCase().includes(k))

  // Summer months (June-August)
  if (month >= 5 && month <= 7) {
    if (isBeach) return 1.4
    if (isMountain) return 1.2
    return 1.15
  }

  // Winter holidays (December-January)
  if (month === 11 || month === 0) {
    if (isMountain) return 1.5
    return 1.2
  }

  // Spring break (March-April)
  if (month >= 2 && month <= 3) {
    if (isBeach) return 1.25
    return 1.1
  }

  // Off-season
  return 0.9
}

// Weekend premium
function getDayOfWeekMultiplier(): number {
  const day = new Date().getDay()
  // Friday, Saturday = premium
  if (day === 5 || day === 6) return 1.15
  // Sunday = slight premium
  if (day === 0) return 1.05
  return 1.0
}

// Calculate optimal price
function calculateOptimalPrice(
  basePrice: number,
  factors: PricingFactors
): { price: number; explanation: string[] } {
  const explanation: string[] = []

  let price = basePrice

  // Apply demand adjustment (-10% to +20%)
  const demandAdjustment = ((factors.baseDemand - 50) / 100) * 0.3
  price *= 1 + demandAdjustment
  if (demandAdjustment > 0.05) {
    explanation.push(`High demand: +${Math.round(demandAdjustment * 100)}%`)
  } else if (demandAdjustment < -0.05) {
    explanation.push(`Low demand: ${Math.round(demandAdjustment * 100)}%`)
  }

  // Apply seasonal factor
  price *= factors.seasonalFactor
  if (factors.seasonalFactor > 1.1) {
    explanation.push(`Peak season: +${Math.round((factors.seasonalFactor - 1) * 100)}%`)
  } else if (factors.seasonalFactor < 0.95) {
    explanation.push(`Off-season: ${Math.round((factors.seasonalFactor - 1) * 100)}%`)
  }

  // Apply day of week premium
  price *= factors.dayOfWeek
  if (factors.dayOfWeek > 1.05) {
    explanation.push(`Weekend premium: +${Math.round((factors.dayOfWeek - 1) * 100)}%`)
  }

  // Occupancy adjustment
  if (factors.occupancyRate < 0.3) {
    // Low occupancy - reduce price to attract bookings
    price *= 0.9
    explanation.push("Low occupancy discount: -10%")
  } else if (factors.occupancyRate > 0.8) {
    // High occupancy - can charge premium
    price *= 1.1
    explanation.push("High occupancy premium: +10%")
  }

  return {
    price: Math.round(price),
    explanation,
  }
}

// GET - Get pricing recommendations for a listing
export async function GET(req: Request) {
  try {
    const session = await auth()
    const { searchParams } = new URL(req.url)
    const listingId = searchParams.get("listingId")

    if (!listingId) {
      return NextResponse.json(
        { error: "listingId is required" },
        { status: 400 }
      )
    }

    // Fetch listing
    const listing = await db.listing.findUnique({
      where: { id: listingId },
      include: {
        bookings: {
          where: {
            status: { in: ["confirmed", "pending"] },
            checkOut: { gte: new Date() },
          },
        },
      },
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    // Verify ownership if authenticated
    if (session?.user?.id && listing.hostId !== session.user.id) {
      // Allow viewing but note it's not their listing
    }

    // Calculate factors
    const demandScore = await calculateDemandScore(listingId)
    const seasonalFactor = getSeasonalMultiplier(listing.location)
    const dayOfWeekFactor = getDayOfWeekMultiplier()

    // Calculate occupancy rate (next 30 days)
    const next30Days = new Date()
    next30Days.setDate(next30Days.getDate() + 30)

    const bookedDays = listing.bookings.reduce((total, booking) => {
      const start = new Date(booking.checkIn)
      const end = new Date(booking.checkOut)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      return total + days
    }, 0)

    const occupancyRate = Math.min(1, bookedDays / 30)

    const factors: PricingFactors = {
      baseDemand: demandScore,
      seasonalFactor,
      dayOfWeek: dayOfWeekFactor,
      competitorIndex: 1.0, // TODO: Implement competitor analysis
      occupancyRate,
    }

    const basePrice = listing.basePrice || listing.price
    const { price: suggestedPrice, explanation } = calculateOptimalPrice(basePrice, factors)

    // Get pricing history
    const pricingHistory = await db.pricingHistory.findMany({
      where: { listingId },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    return NextResponse.json({
      currentPrice: listing.currentPrice || listing.price,
      basePrice,
      suggestedPrice,
      factors: {
        demandScore,
        seasonalMultiplier: seasonalFactor,
        dayOfWeekMultiplier: dayOfWeekFactor,
        occupancyRate: Math.round(occupancyRate * 100),
      },
      explanation,
      pricingHistory,
      potentialRevenue: {
        withCurrentPrice: Math.round((listing.currentPrice || listing.price) * (1 - occupancyRate) * 30),
        withSuggestedPrice: Math.round(suggestedPrice * (1 - occupancyRate) * 30 * 0.95), // Slightly lower occupancy at higher price
      },
    })
  } catch (error) {
    console.error("Pricing API error:", error)
    return NextResponse.json(
      { error: "Failed to calculate pricing" },
      { status: 500 }
    )
  }
}

// POST - Apply new price to listing
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { listingId, newPrice, reason } = body

    if (!listingId || !newPrice) {
      return NextResponse.json(
        { error: "listingId and newPrice are required" },
        { status: 400 }
      )
    }

    // Verify ownership
    const listing = await db.listing.findFirst({
      where: {
        id: listingId,
        hostId: session.user.id,
      },
    })

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found or not owned by user" },
        { status: 404 }
      )
    }

    // Calculate demand score for history
    const demandScore = await calculateDemandScore(listingId)

    // Update listing and create history entry
    const [updatedListing] = await db.$transaction([
      db.listing.update({
        where: { id: listingId },
        data: {
          currentPrice: newPrice,
          demandScore,
        },
      }),
      db.pricingHistory.create({
        data: {
          listingId,
          price: newPrice,
          reason: reason || "manual",
          demandScore,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      listing: updatedListing,
    })
  } catch (error) {
    console.error("Pricing update error:", error)
    return NextResponse.json(
      { error: "Failed to update price" },
      { status: 500 }
    )
  }
}

// PUT - Enable/disable smart pricing for a listing
export async function PUT(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { listingId, smartPricing } = body

    // Verify ownership
    const listing = await db.listing.findFirst({
      where: {
        id: listingId,
        hostId: session.user.id,
      },
    })

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found or not owned by user" },
        { status: 404 }
      )
    }

    const updatedListing = await db.listing.update({
      where: { id: listingId },
      data: { smartPricing },
    })

    return NextResponse.json({
      success: true,
      smartPricing: updatedListing.smartPricing,
    })
  } catch (error) {
    console.error("Smart pricing toggle error:", error)
    return NextResponse.json(
      { error: "Failed to update smart pricing setting" },
      { status: 500 }
    )
  }
}
