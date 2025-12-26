import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

// GET availability for a listing
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const listingId = searchParams.get("listingId")
    const month = searchParams.get("month") // YYYY-MM format
    const year = searchParams.get("year")

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID required" },
        { status: 400 }
      )
    }

    // Calculate date range
    let startDate: Date
    let endDate: Date

    if (month) {
      const [y, m] = month.split("-").map(Number)
      startDate = new Date(y, m - 1, 1)
      endDate = new Date(y, m, 0) // Last day of month
    } else if (year) {
      startDate = new Date(parseInt(year), 0, 1)
      endDate = new Date(parseInt(year), 11, 31)
    } else {
      // Default: current month + next 3 months
      startDate = new Date()
      startDate.setDate(1)
      endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 4)
      endDate.setDate(0)
    }

    // Get blocked dates
    const blockedDates = await db.blockedDate.findMany({
      where: {
        listingId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "asc" },
    })

    // Get confirmed bookings
    const bookings = await db.booking.findMany({
      where: {
        listingId,
        status: { in: ["confirmed", "pending"] },
        OR: [
          {
            checkIn: { gte: startDate, lte: endDate },
          },
          {
            checkOut: { gte: startDate, lte: endDate },
          },
          {
            AND: [
              { checkIn: { lte: startDate } },
              { checkOut: { gte: endDate } },
            ],
          },
        ],
      },
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
        status: true,
        guest: {
          select: { name: true },
        },
      },
      orderBy: { checkIn: "asc" },
    })

    return NextResponse.json({
      blockedDates: blockedDates.map((bd) => ({
        id: bd.id,
        date: bd.date.toISOString().split("T")[0],
        reason: bd.reason,
      })),
      bookings: bookings.map((b) => ({
        id: b.id,
        checkIn: b.checkIn.toISOString().split("T")[0],
        checkOut: b.checkOut.toISOString().split("T")[0],
        status: b.status,
        guestName: b.guest.name,
      })),
    })
  } catch (error) {
    console.error("Failed to fetch calendar:", error)
    return NextResponse.json(
      { error: "Failed to fetch calendar" },
      { status: 500 }
    )
  }
}

// POST block/unblock dates
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { listingId, dates, reason, action } = body

    if (!listingId || !dates || !Array.isArray(dates)) {
      return NextResponse.json(
        { error: "Listing ID and dates array required" },
        { status: 400 }
      )
    }

    // Verify ownership
    const listing = await db.listing.findUnique({
      where: { id: listingId },
      select: { hostId: true },
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    if (listing.hostId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to modify this listing" },
        { status: 403 }
      )
    }

    if (action === "unblock") {
      // Remove blocked dates
      await db.blockedDate.deleteMany({
        where: {
          listingId,
          date: {
            in: dates.map((d: string) => new Date(d)),
          },
        },
      })

      return NextResponse.json({ success: true, action: "unblocked" })
    }

    // Block dates
    const blockedDates = await Promise.all(
      dates.map(async (dateStr: string) => {
        const date = new Date(dateStr)

        // Check if date already has a booking
        const existingBooking = await db.booking.findFirst({
          where: {
            listingId,
            status: { in: ["confirmed", "pending"] },
            checkIn: { lte: date },
            checkOut: { gt: date },
          },
        })

        if (existingBooking) {
          return { date: dateStr, error: "Date has existing booking" }
        }

        // Upsert blocked date
        try {
          const blocked = await db.blockedDate.upsert({
            where: {
              listingId_date: {
                listingId,
                date,
              },
            },
            update: { reason: reason || null },
            create: {
              listingId,
              date,
              reason: reason || null,
            },
          })
          return { date: dateStr, id: blocked.id, success: true }
        } catch (e) {
          return { date: dateStr, error: "Failed to block" }
        }
      })
    )

    return NextResponse.json({
      success: true,
      action: "blocked",
      results: blockedDates,
    })
  } catch (error) {
    console.error("Failed to update calendar:", error)
    return NextResponse.json(
      { error: "Failed to update calendar" },
      { status: 500 }
    )
  }
}

// DELETE remove a specific blocked date
export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Blocked date ID required" },
        { status: 400 }
      )
    }

    // Get the blocked date and verify ownership
    const blockedDate = await db.blockedDate.findUnique({
      where: { id },
      include: {
        listing: {
          select: { hostId: true },
        },
      },
    })

    if (!blockedDate) {
      return NextResponse.json(
        { error: "Blocked date not found" },
        { status: 404 }
      )
    }

    if (blockedDate.listing.hostId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    await db.blockedDate.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete blocked date:", error)
    return NextResponse.json(
      { error: "Failed to delete blocked date" },
      { status: 500 }
    )
  }
}
