import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "6months" // 6months, year, all

    // Calculate date range
    let startDate = new Date()
    if (period === "6months") {
      startDate.setMonth(startDate.getMonth() - 6)
    } else if (period === "year") {
      startDate.setFullYear(startDate.getFullYear() - 1)
    } else {
      startDate = new Date(0) // All time
    }

    // Get host's listings
    const listings = await db.listing.findMany({
      where: { hostId: session.user.id },
      select: { id: true, title: true, price: true },
    })

    const listingIds = listings.map((l) => l.id)

    if (listingIds.length === 0) {
      return NextResponse.json({
        summary: {
          totalEarnings: 0,
          totalBookings: 0,
          avgBookingValue: 0,
          occupancyRate: 0,
          totalNights: 0,
        },
        monthlyEarnings: [],
        bookingsByStatus: [],
        topListings: [],
        recentBookings: [],
      })
    }

    // Get all bookings for host's listings
    const bookings = await db.booking.findMany({
      where: {
        listingId: { in: listingIds },
        createdAt: { gte: startDate },
      },
      include: {
        listing: { select: { id: true, title: true } },
        guest: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    // Calculate summary stats
    const confirmedBookings = bookings.filter(
      (b) => b.status === "confirmed" || b.status === "completed"
    )
    const totalEarnings = confirmedBookings.reduce(
      (sum, b) => sum + (b.totalPrice - b.serviceFee),
      0
    )
    const totalBookings = bookings.length
    const avgBookingValue =
      confirmedBookings.length > 0
        ? totalEarnings / confirmedBookings.length
        : 0

    // Calculate total nights booked
    const totalNights = confirmedBookings.reduce((sum, b) => {
      const nights = Math.ceil(
        (b.checkOut.getTime() - b.checkIn.getTime()) / (1000 * 60 * 60 * 24)
      )
      return sum + nights
    }, 0)

    // Calculate occupancy rate (nights booked / total possible nights)
    const daysSinceStart = Math.ceil(
      (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    const totalPossibleNights = daysSinceStart * listings.length
    const occupancyRate =
      totalPossibleNights > 0
        ? Math.round((totalNights / totalPossibleNights) * 100)
        : 0

    // Monthly earnings breakdown
    const monthlyData: Record<string, number> = {}
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      })
      monthlyData[key] = 0
    }

    confirmedBookings.forEach((b) => {
      const key = b.createdAt.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      })
      if (monthlyData[key] !== undefined) {
        monthlyData[key] += b.totalPrice - b.serviceFee
      }
    })

    const monthlyEarnings = Object.entries(monthlyData).map(
      ([month, earnings]) => ({
        month,
        earnings: Math.round(earnings * 100) / 100,
      })
    )

    // Bookings by status
    const statusCounts: Record<string, number> = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    }
    bookings.forEach((b) => {
      if (statusCounts[b.status] !== undefined) {
        statusCounts[b.status]++
      }
    })
    const bookingsByStatus = Object.entries(statusCounts).map(
      ([status, count]) => ({ status, count })
    )

    // Top performing listings
    const listingEarnings: Record<string, { title: string; earnings: number; bookings: number }> = {}
    confirmedBookings.forEach((b) => {
      if (!listingEarnings[b.listingId]) {
        listingEarnings[b.listingId] = {
          title: b.listing.title,
          earnings: 0,
          bookings: 0,
        }
      }
      listingEarnings[b.listingId].earnings += b.totalPrice - b.serviceFee
      listingEarnings[b.listingId].bookings++
    })

    const topListings = Object.entries(listingEarnings)
      .map(([id, data]) => ({
        id,
        title: data.title,
        earnings: Math.round(data.earnings * 100) / 100,
        bookings: data.bookings,
      }))
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 5)

    // Recent bookings
    const recentBookings = bookings.slice(0, 10).map((b) => ({
      id: b.id,
      listingTitle: b.listing.title,
      guestName: b.guest.name || "Guest",
      checkIn: b.checkIn.toISOString().split("T")[0],
      checkOut: b.checkOut.toISOString().split("T")[0],
      totalPrice: b.totalPrice,
      earnings: Math.round((b.totalPrice - b.serviceFee) * 100) / 100,
      status: b.status,
      createdAt: b.createdAt.toISOString(),
    }))

    return NextResponse.json({
      summary: {
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        totalBookings,
        avgBookingValue: Math.round(avgBookingValue * 100) / 100,
        occupancyRate,
        totalNights,
      },
      monthlyEarnings,
      bookingsByStatus,
      topListings,
      recentBookings,
    })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
