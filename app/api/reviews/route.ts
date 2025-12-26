import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

// GET reviews for a listing
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const listingId = searchParams.get("listingId")

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID required" },
        { status: 400 }
      )
    }

    const reviews = await db.review.findMany({
      where: { listingId },
      include: {
        guest: {
          select: { name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Calculate average ratings
    const stats = {
      count: reviews.length,
      average: 0,
      cleanliness: 0,
      accuracy: 0,
      checkIn: 0,
      communication: 0,
      location: 0,
      value: 0,
    }

    if (reviews.length > 0) {
      stats.average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      stats.cleanliness = reviews.reduce((sum, r) => sum + (r.cleanliness || 0), 0) / reviews.length
      stats.accuracy = reviews.reduce((sum, r) => sum + (r.accuracy || 0), 0) / reviews.length
      stats.checkIn = reviews.reduce((sum, r) => sum + (r.checkIn || 0), 0) / reviews.length
      stats.communication = reviews.reduce((sum, r) => sum + (r.communication || 0), 0) / reviews.length
      stats.location = reviews.reduce((sum, r) => sum + (r.location || 0), 0) / reviews.length
      stats.value = reviews.reduce((sum, r) => sum + (r.value || 0), 0) / reviews.length
    }

    return NextResponse.json({ reviews, stats })
  } catch (error) {
    console.error("Failed to fetch reviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}

// POST create a review
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      bookingId,
      rating,
      comment,
      cleanliness,
      accuracy,
      checkIn,
      communication,
      location,
      value,
    } = body

    if (!bookingId || !rating) {
      return NextResponse.json(
        { error: "Booking ID and rating required" },
        { status: 400 }
      )
    }

    // Verify the booking belongs to this user and is completed
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { review: true },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (booking.guestId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only review your own bookings" },
        { status: 403 }
      )
    }

    if (booking.review) {
      return NextResponse.json(
        { error: "You have already reviewed this booking" },
        { status: 400 }
      )
    }

    // Check if checkout date has passed
    if (new Date(booking.checkOut) > new Date()) {
      return NextResponse.json(
        { error: "You can only review after your stay" },
        { status: 400 }
      )
    }

    const review = await db.review.create({
      data: {
        bookingId,
        listingId: booking.listingId,
        guestId: session.user.id,
        rating: Math.min(5, Math.max(1, rating)),
        comment,
        cleanliness: cleanliness ? Math.min(5, Math.max(1, cleanliness)) : null,
        accuracy: accuracy ? Math.min(5, Math.max(1, accuracy)) : null,
        checkIn: checkIn ? Math.min(5, Math.max(1, checkIn)) : null,
        communication: communication ? Math.min(5, Math.max(1, communication)) : null,
        location: location ? Math.min(5, Math.max(1, location)) : null,
        value: value ? Math.min(5, Math.max(1, value)) : null,
      },
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error("Failed to create review:", error)
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    )
  }
}
