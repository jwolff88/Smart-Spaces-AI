import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

// GET /api/bookings/[id] - Get a specific booking
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            description: true,
            location: true,
            price: true,
            imageSrc: true,
            images: true,
            amenities: true,
            host: { select: { id: true, name: true, email: true, image: true } },
          },
        },
        guest: { select: { id: true, name: true, email: true, image: true } },
        payment: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Only allow guest or host to view
    const isGuest = booking.guestId === session.user.id
    const isHost = booking.listing.host.id === session.user.id

    if (!isGuest && !isHost) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("GET /api/bookings/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}

// PATCH /api/bookings/[id] - Update booking status
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { status } = body

    const validStatuses = ["pending", "confirmed", "cancelled", "completed"]
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      )
    }

    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        listing: { select: { hostId: true } },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const isGuest = booking.guestId === session.user.id
    const isHost = booking.listing.hostId === session.user.id

    // Authorization rules:
    // - Guest can cancel their own booking
    // - Host can confirm, cancel, or complete bookings for their listings
    if (status === "cancelled" && !isGuest && !isHost) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if ((status === "confirmed" || status === "completed") && !isHost) {
      return NextResponse.json(
        { error: "Only the host can confirm or complete bookings" },
        { status: 403 }
      )
    }

    const updatedBooking = await db.booking.update({
      where: { id },
      data: { status },
      include: {
        listing: { select: { id: true, title: true } },
      },
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error("PATCH /api/bookings/[id] error:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}

// DELETE /api/bookings/[id] - Cancel and delete booking (only if pending)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        listing: { select: { hostId: true } },
        payment: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const isGuest = booking.guestId === session.user.id
    const isHost = booking.listing.hostId === session.user.id

    if (!isGuest && !isHost) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Can only delete pending bookings without payment
    if (booking.status !== "pending") {
      return NextResponse.json(
        { error: "Can only delete pending bookings. Use PATCH to cancel instead." },
        { status: 400 }
      )
    }

    if (booking.payment && booking.payment.status === "succeeded") {
      return NextResponse.json(
        { error: "Cannot delete booking with completed payment. Cancel instead." },
        { status: 400 }
      )
    }

    await db.booking.delete({ where: { id } })

    return NextResponse.json({ message: "Booking deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/bookings/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
  }
}
