import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

// GET /api/bookings - Get user's bookings (as guest or host)
export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const role = searchParams.get("role") || "guest" // guest or host
    const status = searchParams.get("status") // optional filter

    let bookings

    if (role === "host") {
      // Get bookings for listings owned by this user
      bookings = await db.booking.findMany({
        where: {
          listing: { hostId: session.user.id },
          ...(status && { status }),
        },
        include: {
          listing: { select: { id: true, title: true, location: true, price: true, imageSrc: true } },
          guest: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      // Get bookings made by this user
      bookings = await db.booking.findMany({
        where: {
          guestId: session.user.id,
          ...(status && { status }),
        },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              location: true,
              price: true,
              imageSrc: true,
              host: { select: { id: true, name: true, email: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    }

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("GET /api/bookings error:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

// POST /api/bookings - Create a new booking
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { listingId, checkIn, checkOut, guests } = body

    // Validate required fields
    if (!listingId || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Missing required fields: listingId, checkIn, checkOut" },
        { status: 400 }
      )
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)

    // Validate dates
    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { error: "Check-out must be after check-in" },
        { status: 400 }
      )
    }

    if (checkInDate < new Date()) {
      return NextResponse.json(
        { error: "Check-in date cannot be in the past" },
        { status: 400 }
      )
    }

    // Get listing details
    const listing = await db.listing.findUnique({
      where: { id: listingId },
      select: { id: true, price: true, hostId: true, maxGuests: true, title: true },
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    // Prevent booking own listing
    if (listing.hostId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot book your own listing" },
        { status: 400 }
      )
    }

    // Check guest count
    const guestCount = guests || 1
    if (guestCount > listing.maxGuests) {
      return NextResponse.json(
        { error: `Maximum ${listing.maxGuests} guests allowed` },
        { status: 400 }
      )
    }

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

    if (conflictingBooking) {
      return NextResponse.json(
        { error: "Listing is not available for selected dates" },
        { status: 409 }
      )
    }

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

    if (blockedDate) {
      return NextResponse.json(
        { error: "Some dates in your selection are blocked by the host" },
        { status: 409 }
      )
    }

    // Calculate pricing
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    const subtotal = listing.price * nights
    const serviceFee = Math.round(subtotal * 0.1 * 100) / 100 // 10% platform fee
    const totalPrice = Math.round((subtotal + serviceFee) * 100) / 100

    // Create booking
    const booking = await db.booking.create({
      data: {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: guestCount,
        totalPrice,
        serviceFee,
        status: "pending",
        guestId: session.user.id,
        listingId,
      },
      include: {
        listing: { select: { id: true, title: true, location: true, price: true } },
      },
    })

    return NextResponse.json({
      booking,
      breakdown: {
        nights,
        pricePerNight: listing.price,
        subtotal,
        serviceFee,
        totalPrice,
      },
    }, { status: 201 })
  } catch (error) {
    console.error("POST /api/bookings error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
