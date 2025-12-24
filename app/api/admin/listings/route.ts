import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const listings = await db.listing.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        host: { select: { name: true, email: true } },
        _count: { select: { bookings: true } },
      },
    })

    return NextResponse.json(listings)
  } catch (error) {
    console.error("Error fetching listings:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get("id")

    if (!listingId) {
      return NextResponse.json({ error: "Listing ID required" }, { status: 400 })
    }

    await db.listing.delete({
      where: { id: listingId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting listing:", error)
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 })
  }
}
