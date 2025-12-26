import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const roleFilter = searchParams.get("role") || ""
    const statusFilter = searchParams.get("status") || ""

    const users = await db.user.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          } : {},
          roleFilter ? { role: roleFilter } : {},
          statusFilter === "active" ? { isActive: true } :
          statusFilter === "suspended" ? { isActive: false } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        isAdmin: true,
        createdAt: true,
        _count: {
          select: {
            listings: true,
            bookings: true,
          },
        },
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    await db.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, role, isActive, isAdmin } = body

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const updateData: any = {}
    if (role !== undefined) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive
    if (isAdmin !== undefined) updateData.isAdmin = isAdmin

    const updatedUser = await db.user.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
