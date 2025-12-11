import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, price, location, bedrooms, amenities, type } = body

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required and must be a non-empty string" },
        { status: 400 }
      )
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json(
        { error: "Description is required and must be a non-empty string" },
        { status: 400 }
      )
    }

    if (!location || typeof location !== 'string' || location.trim().length === 0) {
      return NextResponse.json(
        { error: "Location is required and must be a non-empty string" },
        { status: 400 }
      )
    }

    const parsedPrice = parseFloat(price)
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { error: "Price must be a valid positive number" },
        { status: 400 }
      )
    }

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

    // 2. Save the Listing to Database
    const newListing = await prisma.listing.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        price: parsedPrice,
        location: location.trim(),
        hostId: user.id,
        smartPricing: true, 
        maintenanceHealth: "Good",
        matchScore: 95
      }
    })

    return NextResponse.json(newListing)
  } catch (error: any) {
    console.error("Database Error:", error)
    
    // Provide more specific error messages
    let errorMessage = "Failed to create listing"
    let statusCode = 500

    if (error?.code === 'P2002') {
      errorMessage = "A listing with this information already exists"
      statusCode = 409
    } else if (error?.code === 'P2003') {
      errorMessage = "Invalid host reference"
      statusCode = 400
    } else if (error?.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? error?.message : undefined },
      { status: statusCode }
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