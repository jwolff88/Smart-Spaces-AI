import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const statusFilter = searchParams.get("status") || ""
    const featuredFilter = searchParams.get("featured") || ""

    const listings = await db.listing.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { location: { contains: search, mode: "insensitive" } },
            ],
          } : {},
          statusFilter ? { status: statusFilter } : {},
          featuredFilter === "true" ? { isFeatured: true } :
          featuredFilter === "false" ? { isFeatured: false } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        host: { select: { id: true, name: true, email: true } },
        _count: { select: { bookings: true, reviews: true } },
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

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status, isFeatured } = body

    if (!id) {
      return NextResponse.json({ error: "Listing ID required" }, { status: 400 })
    }

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured

    const updatedListing = await db.listing.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updatedListing)
  } catch (error) {
    console.error("Error updating listing:", error)
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 })
  }
}
