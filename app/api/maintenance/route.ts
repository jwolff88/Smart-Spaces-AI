import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

// Common maintenance item templates
const MAINTENANCE_TEMPLATES = [
  { name: "HVAC Filter", category: "hvac", intervalDays: 90 },
  { name: "Smoke Detector Batteries", category: "safety", intervalDays: 180 },
  { name: "Carbon Monoxide Detector", category: "safety", intervalDays: 180 },
  { name: "Fire Extinguisher", category: "safety", intervalDays: 365 },
  { name: "Water Heater Flush", category: "appliance", intervalDays: 365 },
  { name: "Dryer Vent Cleaning", category: "appliance", intervalDays: 365 },
  { name: "Refrigerator Coils", category: "appliance", intervalDays: 365 },
  { name: "Deep Clean", category: "cleaning", intervalDays: 90 },
  { name: "Gutter Cleaning", category: "exterior", intervalDays: 180 },
  { name: "HVAC Service", category: "hvac", intervalDays: 365 },
]

// GET /api/maintenance - Get all maintenance items for host's listings
export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const listingId = searchParams.get("listingId")

    // Get host's listings
    const listings = await db.listing.findMany({
      where: { hostId: session.user.id },
      select: { id: true, title: true },
    })

    if (listings.length === 0) {
      return NextResponse.json({ items: [], listings: [], templates: MAINTENANCE_TEMPLATES })
    }

    const listingIds = listings.map((l) => l.id)

    // Get maintenance items
    const items = await db.maintenanceItem.findMany({
      where: {
        listingId: listingId ? listingId : { in: listingIds },
      },
      include: {
        listing: { select: { id: true, title: true } },
        logs: {
          orderBy: { performedAt: "desc" },
          take: 5,
        },
      },
      orderBy: [{ status: "asc" }, { nextServiceDate: "asc" }],
    })

    // Update statuses based on dates
    const now = new Date()
    const updatedItems = items.map((item) => {
      let status = item.status
      if (item.nextServiceDate) {
        const daysUntil = Math.ceil(
          (item.nextServiceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (daysUntil < 0) {
          status = "overdue"
        } else if (daysUntil <= 14) {
          status = "due_soon"
        } else {
          status = "good"
        }
      }
      return { ...item, status }
    })

    return NextResponse.json({
      items: updatedItems,
      listings,
      templates: MAINTENANCE_TEMPLATES,
    })
  } catch (error) {
    console.error("GET /api/maintenance error:", error)
    return NextResponse.json({ error: "Failed to fetch maintenance items" }, { status: 500 })
  }
}

// POST /api/maintenance - Create a new maintenance item
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { listingId, name, category, location, quantity, notes, intervalDays, lastServiceDate } = body

    if (!listingId || !name || !category) {
      return NextResponse.json(
        { error: "listingId, name, and category are required" },
        { status: 400 }
      )
    }

    // Verify ownership
    const listing = await db.listing.findUnique({
      where: { id: listingId },
      select: { hostId: true },
    })

    if (!listing || listing.hostId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Calculate next service date
    let nextServiceDate = null
    if (lastServiceDate && intervalDays) {
      const last = new Date(lastServiceDate)
      nextServiceDate = new Date(last.getTime() + intervalDays * 24 * 60 * 60 * 1000)
    }

    const item = await db.maintenanceItem.create({
      data: {
        listingId,
        name,
        category,
        location: location || null,
        quantity: quantity || 1,
        notes: notes || null,
        intervalDays: intervalDays || null,
        lastServiceDate: lastServiceDate ? new Date(lastServiceDate) : null,
        nextServiceDate,
        status: "good",
      },
      include: {
        listing: { select: { id: true, title: true } },
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("POST /api/maintenance error:", error)
    return NextResponse.json({ error: "Failed to create maintenance item" }, { status: 500 })
  }
}

// PATCH /api/maintenance - Log maintenance performed
export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { itemId, action, notes, cost, performedBy, performedAt } = body

    if (!itemId || !action) {
      return NextResponse.json(
        { error: "itemId and action are required" },
        { status: 400 }
      )
    }

    // Get the item and verify ownership
    const item = await db.maintenanceItem.findUnique({
      where: { id: itemId },
      include: { listing: { select: { hostId: true } } },
    })

    if (!item || item.listing.hostId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const serviceDate = performedAt ? new Date(performedAt) : new Date()

    // Calculate next service date
    let nextServiceDate = null
    if (item.intervalDays) {
      nextServiceDate = new Date(serviceDate.getTime() + item.intervalDays * 24 * 60 * 60 * 1000)
    }

    // Create log and update item
    await db.maintenanceLog.create({
      data: {
        maintenanceItemId: itemId,
        action,
        notes: notes || null,
        cost: cost || null,
        performedBy: performedBy || null,
        performedAt: serviceDate,
      },
    })

    const updatedItem = await db.maintenanceItem.update({
      where: { id: itemId },
      data: {
        lastServiceDate: serviceDate,
        nextServiceDate,
        status: "good",
      },
      include: {
        listing: { select: { id: true, title: true } },
        logs: {
          orderBy: { performedAt: "desc" },
          take: 5,
        },
      },
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("PATCH /api/maintenance error:", error)
    return NextResponse.json({ error: "Failed to log maintenance" }, { status: 500 })
  }
}

// DELETE /api/maintenance - Delete a maintenance item
export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const itemId = searchParams.get("itemId")

    if (!itemId) {
      return NextResponse.json({ error: "itemId is required" }, { status: 400 })
    }

    // Verify ownership
    const item = await db.maintenanceItem.findUnique({
      where: { id: itemId },
      include: { listing: { select: { hostId: true } } },
    })

    if (!item || item.listing.hostId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await db.maintenanceItem.delete({ where: { id: itemId } })

    return NextResponse.json({ message: "Deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/maintenance error:", error)
    return NextResponse.json({ error: "Failed to delete maintenance item" }, { status: 500 })
  }
}
