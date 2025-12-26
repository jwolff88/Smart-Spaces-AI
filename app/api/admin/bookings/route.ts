import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendBookingStatusUpdate } from "@/lib/email"

export async function GET() {
  try {
    const bookings = await db.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        guest: { select: { name: true, email: true } },
        listing: { select: { title: true, location: true, host: { select: { name: true } } } },
      },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: "Booking ID and status required" }, { status: 400 })
    }

    const updatedBooking = await db.booking.update({
      where: { id },
      data: { status },
      include: {
        guest: { select: { name: true, email: true } },
        listing: { select: { title: true } },
      },
    })

    // Send status update email to guest (non-blocking)
    if (updatedBooking.guest?.email) {
      sendBookingStatusUpdate(
        updatedBooking.guest.email,
        updatedBooking.guest.name || "Guest",
        status,
        updatedBooking.listing?.title || "Your booking",
        updatedBooking.id
      ).catch((err) => console.error("Email send error:", err))
    }

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get("id")

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 })
    }

    await db.booking.delete({
      where: { id: bookingId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting booking:", error)
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
  }
}
