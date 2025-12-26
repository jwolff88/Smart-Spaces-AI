import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic()

// GET /api/ai/maintenance - Get AI analysis of maintenance data
export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const listingId = searchParams.get("listingId")

    // Get host's listings
    const listings = await db.listing.findMany({
      where: { hostId: session.user.id },
      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true,
        bedrooms: true,
        bathrooms: true,
      },
    })

    if (listings.length === 0) {
      return NextResponse.json({
        analysis: null,
        message: "No listings found"
      })
    }

    const listingIds = listingId ? [listingId] : listings.map((l) => l.id)

    // Get all maintenance items with their logs
    const maintenanceItems = await db.maintenanceItem.findMany({
      where: { listingId: { in: listingIds } },
      include: {
        listing: { select: { id: true, title: true, type: true, bedrooms: true } },
        logs: {
          orderBy: { performedAt: "desc" },
          take: 10,
        },
      },
      orderBy: { nextServiceDate: "asc" },
    })

    // Get booking data to understand usage patterns
    const bookings = await db.booking.findMany({
      where: {
        listingId: { in: listingIds },
        status: { in: ["confirmed", "completed"] },
        checkIn: { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }, // Last year
      },
      select: {
        listingId: true,
        checkIn: true,
        checkOut: true,
        guests: true,
      },
    })

    // Calculate usage statistics per listing
    const usageStats = listingIds.map((id) => {
      const listingBookings = bookings.filter((b) => b.listingId === id)
      const totalNights = listingBookings.reduce((sum, b) => {
        const nights = Math.ceil(
          (b.checkOut.getTime() - b.checkIn.getTime()) / (1000 * 60 * 60 * 24)
        )
        return sum + nights
      }, 0)
      const totalGuests = listingBookings.reduce((sum, b) => sum + b.guests, 0)
      const listing = listings.find((l) => l.id === id)

      return {
        listingId: id,
        listingTitle: listing?.title || "Unknown",
        listingType: listing?.type || "Unknown",
        bedrooms: listing?.bedrooms || "Unknown",
        totalBookings: listingBookings.length,
        totalNightsBooked: totalNights,
        averageGuests: listingBookings.length > 0
          ? Math.round(totalGuests / listingBookings.length * 10) / 10
          : 0,
        occupancyRate: Math.round((totalNights / 365) * 100),
      }
    })

    // Prepare data summary for AI
    const now = new Date()
    const maintenanceSummary = maintenanceItems.map((item) => {
      const daysSinceService = item.lastServiceDate
        ? Math.floor((now.getTime() - item.lastServiceDate.getTime()) / (1000 * 60 * 60 * 24))
        : null
      const daysUntilDue = item.nextServiceDate
        ? Math.floor((item.nextServiceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null

      // Calculate average service interval from logs
      let avgActualInterval = null
      if (item.logs.length >= 2) {
        const intervals: number[] = []
        for (let i = 0; i < item.logs.length - 1; i++) {
          const interval = Math.floor(
            (new Date(item.logs[i].performedAt).getTime() -
             new Date(item.logs[i + 1].performedAt).getTime()) / (1000 * 60 * 60 * 24)
          )
          intervals.push(interval)
        }
        avgActualInterval = Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length)
      }

      // Calculate total maintenance cost
      const totalCost = item.logs.reduce((sum, log) => sum + (log.cost || 0), 0)

      return {
        name: item.name,
        category: item.category,
        listing: item.listing.title,
        listingType: item.listing.type,
        quantity: item.quantity,
        location: item.location,
        scheduledInterval: item.intervalDays,
        actualAverageInterval: avgActualInterval,
        daysSinceLastService: daysSinceService,
        daysUntilNextService: daysUntilDue,
        status: item.status,
        serviceCount: item.logs.length,
        totalCostToDate: totalCost,
        recentServices: item.logs.slice(0, 3).map((l) => ({
          action: l.action,
          date: l.performedAt,
          cost: l.cost,
          performedBy: l.performedBy,
        })),
      }
    })

    // Call Claude for AI analysis
    const prompt = `You are a property maintenance AI analyst. Analyze the following maintenance data and provide actionable insights.

## Property Usage Data (Last 12 Months)
${JSON.stringify(usageStats, null, 2)}

## Maintenance Items & History
${JSON.stringify(maintenanceSummary, null, 2)}

## Today's Date
${now.toISOString().split("T")[0]}

Based on this data, provide a JSON response with the following structure:
{
  "healthScore": <0-100 overall maintenance health>,
  "riskLevel": "<low|medium|high>",
  "estimatedAnnualSavings": <dollar amount from preventive maintenance>,
  "urgentItems": [
    {
      "item": "<item name>",
      "listing": "<listing name>",
      "reason": "<why urgent>",
      "recommendation": "<what to do>",
      "estimatedCost": <dollar amount or null>
    }
  ],
  "predictions": [
    {
      "item": "<item name>",
      "listing": "<listing name>",
      "prediction": "<what might happen>",
      "confidence": "<high|medium|low>",
      "timeframe": "<when>",
      "preventiveAction": "<recommended action>"
    }
  ],
  "optimizations": [
    {
      "category": "<category>",
      "insight": "<observation>",
      "recommendation": "<what to change>",
      "potentialSavings": <dollar amount or null>
    }
  ],
  "usageImpact": {
    "summary": "<how usage patterns affect maintenance>",
    "highWearItems": ["<items that need more frequent service due to high usage>"],
    "recommendations": ["<usage-based recommendations>"]
  },
  "summary": "<2-3 sentence overall summary>"
}

Consider:
1. High occupancy = more wear on HVAC, appliances, cleaning needs
2. More guests = faster degradation of filters, more frequent deep cleans needed
3. Seasonal patterns (if detectable)
4. Items overdue or approaching due dates
5. Cost trends and potential savings
6. Missing maintenance items that should be tracked based on property type

Respond ONLY with valid JSON, no markdown or explanation.`

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    })

    // Parse AI response
    const responseText = message.content[0].type === "text"
      ? message.content[0].text
      : ""

    let analysis
    try {
      analysis = JSON.parse(responseText)
    } catch {
      // If parsing fails, return a structured error response
      analysis = {
        healthScore: 75,
        riskLevel: "medium",
        summary: "Unable to fully analyze maintenance data. Please ensure maintenance items are added with service history.",
        urgentItems: maintenanceItems
          .filter((i) => i.status === "overdue")
          .slice(0, 3)
          .map((i) => ({
            item: i.name,
            listing: i.listing.title,
            reason: "Overdue for service",
            recommendation: "Schedule service soon",
          })),
        predictions: [],
        optimizations: [],
      }
    }

    return NextResponse.json({
      analysis,
      dataPoints: {
        totalItems: maintenanceItems.length,
        overdueCount: maintenanceItems.filter((i) => i.status === "overdue").length,
        dueSoonCount: maintenanceItems.filter((i) => i.status === "due_soon").length,
        totalServiceLogs: maintenanceItems.reduce((sum, i) => sum + i.logs.length, 0),
        listingsAnalyzed: listingIds.length,
      },
    })
  } catch (error) {
    console.error("GET /api/ai/maintenance error:", error)
    return NextResponse.json(
      { error: "Failed to analyze maintenance data" },
      { status: 500 }
    )
  }
}
