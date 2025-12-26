import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

// GET /api/listings/[id] - Get a specific listing
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const listing = await db.listing.findUnique({
      where: { id },
      include: {
        host: { select: { id: true, name: true, email: true, image: true } },
      },
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json(listing)
  } catch (error) {
    console.error("GET /api/listings/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 })
  }
}

// DELETE /api/listings/[id] - Delete a listing (host only)
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

    const listing = await db.listing.findUnique({
      where: { id },
      include: {
        bookings: {
          where: {
            status: { in: ["pending", "confirmed"] },
            checkOut: { gte: new Date() },
          },
        },
      },
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    // Only the host can delete their own listing
    if (listing.hostId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check for active bookings
    if (listing.bookings.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete listing with active bookings. Please cancel or complete all bookings first." },
        { status: 400 }
      )
    }

    // Delete the listing (cascades to reviews, messages, etc. based on schema)
    await db.listing.delete({ where: { id } })

    return NextResponse.json({ message: "Listing deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/listings/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 })
  }
}
