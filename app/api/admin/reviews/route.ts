import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const minRating = searchParams.get("minRating")
    const maxRating = searchParams.get("maxRating")

    const reviews = await db.review.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { comment: { contains: search, mode: "insensitive" } },
              { listing: { title: { contains: search, mode: "insensitive" } } },
              { guest: { name: { contains: search, mode: "insensitive" } } },
            ],
          } : {},
          minRating ? { rating: { gte: parseInt(minRating) } } : {},
          maxRating ? { rating: { lte: parseInt(maxRating) } } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        guest: { select: { id: true, name: true, email: true } },
        listing: { select: { id: true, title: true, host: { select: { name: true } } } },
      },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get("id")

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 })
    }

    await db.review.delete({
      where: { id: reviewId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}
