import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, price, location, bedrooms, amenities, type } = body

    // 1. Find or Create a Demo User (Required because Listings must belong to a Host)
    // In a real app, this ID would come from the session (NextAuth)
    let user = await prisma.user.findFirst({
      where: { email: "demo@smartspaces.ai" }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "demo@smartspaces.ai",
          name: "Demo Host",
          role: "host"
        }
      })
    }

    // 2. Save the Listing to Supabase
    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        location,
        hostId: user.id,
        smartPricing: true, 
        maintenanceHealth: "Good",
        matchScore: 95
      }
    })

    return NextResponse.json(newListing)
  } catch (error) {
    console.error("Database Error:", error)
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const listings = await prisma.listing.findMany({
      // We retrieve all listings for this demo
      orderBy: {
        title: 'asc' // Optional: Sorts them alphabetically
      }
    })

    return NextResponse.json(listings)
  } catch (error) {
    console.error("Fetch Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    )
  }
}