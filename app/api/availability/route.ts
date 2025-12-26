import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/availability - Check availability for a listing
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const listingId = searchParams.get("listingId")
    const checkIn = searchParams.get("checkIn")
    const checkOut = searchParams.get("checkOut")

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID required" },
        { status: 400 }
      )
    }

    // If specific dates provided, check availability
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)

      // Check for conflicting bookings
      const conflictingBooking = await db.booking.findFirst({
        where: {
          listingId,
          status: { in: ["pending", "confirmed"] },
          OR: [
            {
              AND: [
                { checkIn: { lte: checkInDate } },
                { checkOut: { gt: checkInDate } },
              ],
            },
            {
              AND: [
                { checkIn: { lt: checkOutDate } },
                { checkOut: { gte: checkOutDate } },
              ],
            },
            {
              AND: [
                { checkIn: { gte: checkInDate } },
                { checkOut: { lte: checkOutDate } },
              ],
            },
          ],
        },
      })

      // Check for blocked dates
      const blockedDate = await db.blockedDate.findFirst({
        where: {
          listingId,
          date: {
            gte: checkInDate,
            lt: checkOutDate,
          },
        },
      })

      return NextResponse.json({
        available: !conflictingBooking && !blockedDate,
        reason: conflictingBooking
          ? "dates_booked"
          : blockedDate
          ? "dates_blocked"
          : null,
      })
    }

    // Return all unavailable dates for the next 6 months
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 6)

    // Get blocked dates
    const blockedDates = await db.blockedDate.findMany({
      where: {
        listingId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: { date: true },
    })

    // Get booked dates from confirmed/pending bookings
    const bookings = await db.booking.findMany({
      where: {
        listingId,
        status: { in: ["pending", "confirmed"] },
        checkOut: { gte: startDate },
        checkIn: { lte: endDate },
      },
      select: {
        checkIn: true,
        checkOut: true,
      },
    })

    // Generate array of booked dates
    const bookedDates: string[] = []
    for (const booking of bookings) {
      const current = new Date(booking.checkIn)
      while (current < booking.checkOut) {
        bookedDates.push(current.toISOString().split("T")[0])
        current.setDate(current.getDate() + 1)
      }
    }

    // Combine all unavailable dates
    const unavailableDates = [
      ...blockedDates.map((bd) => bd.date.toISOString().split("T")[0]),
      ...bookedDates,
    ]

    // Remove duplicates
    const uniqueUnavailable = [...new Set(unavailableDates)]

    return NextResponse.json({
      unavailableDates: uniqueUnavailable,
    })
  } catch (error) {
    console.error("GET /api/availability error:", error)
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    )
  }
}
