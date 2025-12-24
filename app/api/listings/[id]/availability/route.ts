import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/listings/[id]/availability - Get booked dates for a listing
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)

    // Optional date range filter
    const startDate = searchParams.get("start")
    const endDate = searchParams.get("end")

    // Verify listing exists
    const listing = await db.listing.findUnique({
      where: { id },
      select: { id: true, price: true },
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    // Get confirmed and pending bookings
    const bookings = await db.booking.findMany({
      where: {
        listingId: id,
        status: { in: ["pending", "confirmed"] },
        ...(startDate && endDate && {
          OR: [
            {
              AND: [
                { checkIn: { lte: new Date(endDate) } },
                { checkOut: { gte: new Date(startDate) } },
              ],
            },
          ],
        }),
      },
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
        status: true,
      },
      orderBy: { checkIn: "asc" },
    })

    // Generate list of booked date ranges
    const bookedRanges = bookings.map((booking) => ({
      start: booking.checkIn.toISOString().split("T")[0],
      end: booking.checkOut.toISOString().split("T")[0],
      status: booking.status,
    }))

    return NextResponse.json({
      listingId: id,
      pricePerNight: listing.price,
      bookedRanges,
    })
  } catch (error) {
    console.error("GET /api/listings/[id]/availability error:", error)
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    )
  }
}
