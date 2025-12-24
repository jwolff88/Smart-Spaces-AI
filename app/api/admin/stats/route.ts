import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Fetch all stats in parallel
    const [
      totalUsers,
      hostCount,
      guestCount,
      totalListings,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      revenueData,
      recentUsers,
      recentBookings,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: "host" } }),
      db.user.count({ where: { role: "guest" } }),
      db.listing.count(),
      db.booking.count(),
      db.booking.count({ where: { status: "pending" } }),
      db.booking.count({ where: { status: "confirmed" } }),
      db.booking.aggregate({
        where: { status: { in: ["confirmed", "completed"] } },
        _sum: { totalPrice: true, serviceFee: true },
      }),
      db.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      db.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          guest: { select: { name: true, email: true } },
          listing: { select: { title: true } },
        },
      }),
    ])

    const totalRevenue = revenueData._sum.totalPrice || 0
    const platformRevenue = revenueData._sum.serviceFee || 0

    return NextResponse.json({
      users: {
        total: totalUsers,
        hosts: hostCount,
        guests: guestCount,
      },
      listings: {
        total: totalListings,
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
      },
      revenue: {
        total: totalRevenue,
        platform: platformRevenue,
      },
      recentUsers,
      recentBookings,
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
