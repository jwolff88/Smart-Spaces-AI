import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

// GET - Fetch traveler profile
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await db.travelerProfile.findUnique({
      where: { userId: session.user.id },
    })

    return NextResponse.json(profile || null)
  } catch (error) {
    console.error("Error fetching traveler profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

// POST - Create or update traveler profile
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      travelIntent,
      preferredVibes,
      workNeeds,
      mustHaveAmenities,
      budgetRange,
      preferredTypes,
      typicalStayLength,
      travelFrequency,
      preferredLocations,
    } = body

    // Upsert the profile
    const profile = await db.travelerProfile.upsert({
      where: { userId: session.user.id },
      update: {
        travelIntent,
        preferredVibes: preferredVibes || [],
        workNeeds: workNeeds || [],
        mustHaveAmenities: mustHaveAmenities || [],
        budgetRange,
        preferredTypes: preferredTypes || [],
        typicalStayLength,
        travelFrequency,
        preferredLocations: preferredLocations || [],
      },
      create: {
        userId: session.user.id,
        travelIntent,
        preferredVibes: preferredVibes || [],
        workNeeds: workNeeds || [],
        mustHaveAmenities: mustHaveAmenities || [],
        budgetRange,
        preferredTypes: preferredTypes || [],
        typicalStayLength,
        travelFrequency,
        preferredLocations: preferredLocations || [],
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error saving traveler profile:", error)
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    )
  }
}
