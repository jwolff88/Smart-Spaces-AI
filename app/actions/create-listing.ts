"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

// Define the shape of the data we expect
interface ListingData {
  title: string
  description: string
  price: number
  smartPricing?: boolean
  location: string
  type: string
  bedrooms: string
  amenities: string[]
  images?: string[]
  imageSrc?: string | null
  // AI Matching Attributes
  vibes?: string[]
  workFriendly?: boolean
  workAmenities?: string[]
  wifiSpeed?: number | null
  idealFor?: string[]
}

export async function createListing(data: ListingData) {
  // 1. Get current user session
  const session = await auth()

  if (!session?.user?.id) {
    return { error: "You must be logged in to create a listing" }
  }

  try {
    // 2. Save to Database with the User ID (hostId)
    const newListing = await db.listing.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        basePrice: data.price, // Store original price for dynamic pricing
        currentPrice: data.price, // Initially same as base
        smartPricing: data.smartPricing ?? true, // Default to true if not specified
        location: data.location,
        type: data.type,
        bedrooms: data.bedrooms,
        amenities: data.amenities || [],
        images: data.images || [],
        imageSrc: data.imageSrc || null,
        hostId: session.user.id, // Links listing to the logged-in user
        // AI Matching Attributes
        vibes: data.vibes || [],
        workFriendly: data.workFriendly || false,
        workAmenities: data.workAmenities || [],
        wifiSpeed: data.wifiSpeed || null,
        idealFor: data.idealFor || [],
      }
    })

    // 3. Refresh the dashboard so the new listing shows up immediately
    revalidatePath("/host-dashboard")
    
    return { success: true, listingId: newListing.id }

  } catch (error) {
    console.error("Database Save Error:", error)
    return { error: "Failed to save listing to database" }
  }
}