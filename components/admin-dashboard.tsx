"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Building,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Settings,
  LogOut,
  BarChart3,
  UserCheck,
  Home,
  RefreshCw,
} from "lucide-react"

interface AdminDashboardProps {
  onLogout: () => void
}

interface Stats {
  users: { total: number; hosts: number; guests: number }
  listings: { total: number }
  bookings: { total: number; pending: number; confirmed: number }
  revenue: { total: number; platform: number }
  recentUsers: Array<{ id: string; name: string; email: string; role: string; createdAt: string }>
  recentBookings: Array<{
    id: string
    status: string
    totalPrice: number
    createdAt: string
    guest: { name: string; email: string }
    listing: { title: string }
  }>
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [listings, setListings] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats")
      const data = await res.json()
      if (data.error) {
        console.error("Stats API error:", data.error)
        return
      }
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  const fetchListings = async () => {
    try {
      const res = await fetch("/api/admin/listings")
      const data = await res.json()
      setListings(data)
    } catch (error) {
      console.error("Failed to fetch listings:", error)
    }
  }

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings")
      const data = await res.json()
      setBookings(data)
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    }
  }

  const refreshAll = async () => {
    setLoading(true)
    await Promise.all([fetchStats(), fetchUsers(), fetchListings(), fetchBookings()])
    setLoading(false)
  }

  useEffect(() => {
    refreshAll()
  }, [])

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" })
    fetchUsers()
    fetchStats()
  }

  const deleteListing = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return
    await fetch(`/api/admin/listings?id=${id}`, { method: "DELETE" })
    fetchListings()
    fetchStats()
  }

  const updateBookingStatus = async (id: string, status: string) => {
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    fetchBookings()
    fetchStats()
  }

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return
    await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" })
    fetchBookings()
    fetchStats()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <Home className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold">Smart Spaces Admin</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={refreshAll} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              System Online
            </Badge>
            <Button variant="outline" size="sm" onClick={onLogout} className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab("overview")}
            >
              <BarChart3 className="h-4 w-4" />
              Overview
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-4 w-4" />
              Users
            </Button>
            <Button
              variant={activeTab === "listings" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab("listings")}
            >
              <Building className="h-4 w-4" />
              Listings
            </Button>
            <Button
              variant={activeTab === "bookings" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab("bookings")}
            >
              <Calendar className="h-4 w-4" />
              Bookings
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                <p className="text-muted-foreground">Welcome to Smart Spaces Admin Panel</p>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.users.total || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats?.users.hosts || 0} hosts, {stats?.users.guests || 0} guests
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.listings.total || 0}</div>
                    <p className="text-xs text-muted-foreground">Properties listed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.bookings.total || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats?.bookings.pending || 0} pending, {stats?.bookings.confirmed || 0} confirmed
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${(stats?.revenue.platform || 0).toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      Total: ${(stats?.revenue.total || 0).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>Latest user registrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                      <div className="space-y-3">
                        {stats.recentUsers.map((user) => (
                          <div key={user.id} className="flex items-center justify-between text-sm">
                            <div>
                              <p className="font-medium">{user.name || user.email}</p>
                              <p className="text-muted-foreground text-xs">{user.email}</p>
                            </div>
                            <Badge variant={user.role === "host" ? "default" : "secondary"}>
                              {user.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No users yet</p>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>Latest booking activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats?.recentBookings && stats.recentBookings.length > 0 ? (
                      <div className="space-y-3">
                        {stats.recentBookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between text-sm">
                            <div>
                              <p className="font-medium">{booking.listing.title}</p>
                              <p className="text-muted-foreground text-xs">
                                {booking.guest.name || booking.guest.email}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${booking.totalPrice.toFixed(2)}</p>
                              <Badge
                                variant={
                                  booking.status === "confirmed"
                                    ? "default"
                                    : booking.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                                }
                                className="text-xs"
                              >
                                {booking.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No bookings yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Users Management</h2>
              <Card>
                <CardContent className="pt-6">
                  {users.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Name</th>
                            <th className="text-left p-2">Email</th>
                            <th className="text-left p-2">Role</th>
                            <th className="text-left p-2">Listings</th>
                            <th className="text-left p-2">Bookings</th>
                            <th className="text-left p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id} className="border-b">
                              <td className="p-2">{user.name || "-"}</td>
                              <td className="p-2">{user.email}</td>
                              <td className="p-2">
                                <Badge variant={user.role === "host" ? "default" : "secondary"}>
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="p-2">{user._count?.listings || 0}</td>
                              <td className="p-2">{user._count?.bookings || 0}</td>
                              <td className="p-2">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteUser(user.id)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No users found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "listings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Listings Management</h2>
              <Card>
                <CardContent className="pt-6">
                  {listings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Title</th>
                            <th className="text-left p-2">Location</th>
                            <th className="text-left p-2">Host</th>
                            <th className="text-left p-2">Price</th>
                            <th className="text-left p-2">Bookings</th>
                            <th className="text-left p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listings.map((listing) => (
                            <tr key={listing.id} className="border-b">
                              <td className="p-2 max-w-[200px] truncate">{listing.title}</td>
                              <td className="p-2">{listing.location}</td>
                              <td className="p-2">{listing.host?.name || listing.host?.email}</td>
                              <td className="p-2">${listing.price}/night</td>
                              <td className="p-2">{listing._count?.bookings || 0}</td>
                              <td className="p-2">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteListing(listing.id)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No listings found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Bookings Management</h2>
              <Card>
                <CardContent className="pt-6">
                  {bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Listing</th>
                            <th className="text-left p-2">Guest</th>
                            <th className="text-left p-2">Dates</th>
                            <th className="text-left p-2">Total</th>
                            <th className="text-left p-2">Status</th>
                            <th className="text-left p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking) => (
                            <tr key={booking.id} className="border-b">
                              <td className="p-2 max-w-[150px] truncate">{booking.listing?.title}</td>
                              <td className="p-2">{booking.guest?.name || booking.guest?.email}</td>
                              <td className="p-2 text-xs">
                                {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                                {new Date(booking.checkOut).toLocaleDateString()}
                              </td>
                              <td className="p-2">${booking.totalPrice.toFixed(2)}</td>
                              <td className="p-2">
                                <Badge
                                  variant={
                                    booking.status === "confirmed"
                                      ? "default"
                                      : booking.status === "pending"
                                      ? "secondary"
                                      : "destructive"
                                  }
                                >
                                  {booking.status}
                                </Badge>
                              </td>
                              <td className="p-2">
                                <div className="flex gap-2">
                                  {booking.status === "pending" && (
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => updateBookingStatus(booking.id, "confirmed")}
                                    >
                                      Confirm
                                    </Button>
                                  )}
                                  {booking.status !== "cancelled" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateBookingStatus(booking.id, "cancelled")}
                                    >
                                      Cancel
                                    </Button>
                                  )}
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteBooking(booking.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No bookings found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
