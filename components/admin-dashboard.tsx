"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Users,
  Building,
  Calendar,
  DollarSign,
  TrendingUp,
  LogOut,
  BarChart3,
  Home,
  RefreshCw,
  Search,
  Star,
  Eye,
  UserX,
  UserCheck,
  Shield,
  Sparkles,
  Ban,
  CheckCircle,
  MessageSquare,
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
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [userSearch, setUserSearch] = useState("")
  const [userRoleFilter, setUserRoleFilter] = useState("")
  const [userStatusFilter, setUserStatusFilter] = useState("")
  const [listingSearch, setListingSearch] = useState("")
  const [listingStatusFilter, setListingStatusFilter] = useState("")
  const [bookingStatusFilter, setBookingStatusFilter] = useState("")

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
      const params = new URLSearchParams()
      if (userSearch) params.set("search", userSearch)
      if (userRoleFilter) params.set("role", userRoleFilter)
      if (userStatusFilter) params.set("status", userStatusFilter)

      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  const fetchListings = async () => {
    try {
      const params = new URLSearchParams()
      if (listingSearch) params.set("search", listingSearch)
      if (listingStatusFilter) params.set("status", listingStatusFilter)

      const res = await fetch(`/api/admin/listings?${params}`)
      const data = await res.json()
      setListings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch listings:", error)
    }
  }

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings")
      const data = await res.json()
      const filtered = bookingStatusFilter
        ? data.filter((b: any) => b.status === bookingStatusFilter)
        : data
      setBookings(Array.isArray(filtered) ? filtered : [])
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews")
      const data = await res.json()
      setReviews(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
    }
  }

  const refreshAll = async () => {
    setLoading(true)
    await Promise.all([fetchStats(), fetchUsers(), fetchListings(), fetchBookings(), fetchReviews()])
    setLoading(false)
  }

  useEffect(() => {
    refreshAll()
  }, [])

  useEffect(() => {
    if (!loading) fetchUsers()
  }, [userSearch, userRoleFilter, userStatusFilter])

  useEffect(() => {
    if (!loading) fetchListings()
  }, [listingSearch, listingStatusFilter])

  useEffect(() => {
    if (!loading) fetchBookings()
  }, [bookingStatusFilter])

  // User actions
  const updateUser = async (id: string, data: any) => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    })
    fetchUsers()
    fetchStats()
  }

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This will also delete all their listings and bookings.")) return
    await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" })
    fetchUsers()
    fetchStats()
  }

  // Listing actions
  const updateListing = async (id: string, data: any) => {
    await fetch("/api/admin/listings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    })
    fetchListings()
    fetchStats()
  }

  const deleteListing = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return
    await fetch(`/api/admin/listings?id=${id}`, { method: "DELETE" })
    fetchListings()
    fetchStats()
  }

  // Booking actions
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

  // Review actions
  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return
    await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" })
    fetchReviews()
  }

  const navItems = [
    { id: "overview", icon: BarChart3, label: "Overview" },
    { id: "users", icon: Users, label: "Users" },
    { id: "listings", icon: Building, label: "Listings" },
    { id: "bookings", icon: Calendar, label: "Bookings" },
    { id: "reviews", icon: Star, label: "Reviews" },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
                <Home className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-white">Smart Spaces Admin</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              onClick={refreshAll}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Badge className="bg-green-600 text-white border-0">
              System Online
            </Badge>
            <Button
              size="sm"
              onClick={onLogout}
              className="gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-700 bg-slate-800 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {navItems.map(({ id, icon: Icon, label }) => (
              <Button
                key={id}
                className={`w-full justify-start gap-2 ${
                  activeTab === id
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                }`}
                onClick={() => setActiveTab(id)}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-slate-900 overflow-auto">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                <p className="text-slate-400">Welcome to Smart Spaces Admin Panel</p>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats?.users.total || 0}</div>
                    <p className="text-xs text-slate-400">
                      {stats?.users.hosts || 0} hosts, {stats?.users.guests || 0} guests
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Active Listings</CardTitle>
                    <Building className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats?.listings.total || 0}</div>
                    <p className="text-xs text-slate-400">Properties listed</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Total Bookings</CardTitle>
                    <Calendar className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats?.bookings.total || 0}</div>
                    <p className="text-xs text-slate-400">
                      {stats?.bookings.pending || 0} pending, {stats?.bookings.confirmed || 0} confirmed
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Platform Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-yellow-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">${(stats?.revenue.platform || 0).toFixed(2)}</div>
                    <p className="text-xs text-slate-400">
                      Total: ${(stats?.revenue.total || 0).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Users</CardTitle>
                    <CardDescription className="text-slate-400">Latest user registrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                      <div className="space-y-3">
                        {stats.recentUsers.map((user) => (
                          <div key={user.id} className="flex items-center justify-between text-sm">
                            <div>
                              <p className="font-medium text-white">{user.name || user.email}</p>
                              <p className="text-slate-400 text-xs">{user.email}</p>
                            </div>
                            <Badge className={user.role === "host" ? "bg-blue-600 text-white" : "bg-slate-600 text-white"}>
                              {user.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-center py-4">No users yet</p>
                    )}
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Bookings</CardTitle>
                    <CardDescription className="text-slate-400">Latest booking activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats?.recentBookings && stats.recentBookings.length > 0 ? (
                      <div className="space-y-3">
                        {stats.recentBookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between text-sm">
                            <div>
                              <p className="font-medium text-white">{booking.listing.title}</p>
                              <p className="text-slate-400 text-xs">
                                {booking.guest.name || booking.guest.email}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-white">${booking.totalPrice.toFixed(2)}</p>
                              <Badge
                                className={
                                  booking.status === "confirmed"
                                    ? "bg-green-600 text-white"
                                    : booking.status === "pending"
                                    ? "bg-yellow-600 text-white"
                                    : "bg-red-600 text-white"
                                }
                              >
                                {booking.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-center py-4">No bookings yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Users Management</h2>
                <div className="text-sm text-slate-400">{users.length} users</div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                  <SelectTrigger className="w-[150px] bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All roles</SelectItem>
                    <SelectItem value="host">Hosts</SelectItem>
                    <SelectItem value="guest">Guests</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={userStatusFilter} onValueChange={setUserStatusFilter}>
                  <SelectTrigger className="w-[150px] bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6">
                  {users.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-600">
                            <th className="text-left p-2 text-slate-300">User</th>
                            <th className="text-left p-2 text-slate-300">Role</th>
                            <th className="text-left p-2 text-slate-300">Status</th>
                            <th className="text-left p-2 text-slate-300">Listings</th>
                            <th className="text-left p-2 text-slate-300">Bookings</th>
                            <th className="text-left p-2 text-slate-300">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id} className="border-b border-slate-700">
                              <td className="p-2">
                                <div>
                                  <p className="text-white font-medium flex items-center gap-2">
                                    {user.name || "-"}
                                    {user.isAdmin && <Shield className="h-3 w-3 text-yellow-400" />}
                                  </p>
                                  <p className="text-slate-400 text-xs">{user.email}</p>
                                </div>
                              </td>
                              <td className="p-2">
                                <Select
                                  value={user.role}
                                  onValueChange={(role) => updateUser(user.id, { role })}
                                >
                                  <SelectTrigger className="w-[100px] bg-slate-700 border-slate-600 text-white h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-800 border-slate-700">
                                    <SelectItem value="guest">Guest</SelectItem>
                                    <SelectItem value="host">Host</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="p-2">
                                <Badge className={user.isActive ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                                  {user.isActive ? "Active" : "Suspended"}
                                </Badge>
                              </td>
                              <td className="p-2 text-white">{user._count?.listings || 0}</td>
                              <td className="p-2 text-white">{user._count?.bookings || 0}</td>
                              <td className="p-2">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => updateUser(user.id, { isActive: !user.isActive })}
                                    className={user.isActive
                                      ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                                      : "bg-green-600 hover:bg-green-700 text-white"
                                    }
                                    title={user.isActive ? "Suspend user" : "Activate user"}
                                  >
                                    {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => deleteUser(user.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    title="Delete user"
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
                    <p className="text-center text-slate-400 py-8">No users found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* LISTINGS TAB */}
          {activeTab === "listings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Listings Management</h2>
                <div className="text-sm text-slate-400">{listings.length} listings</div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search listings..."
                    value={listingSearch}
                    onChange={(e) => setListingSearch(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <Select value={listingStatusFilter} onValueChange={setListingStatusFilter}>
                  <SelectTrigger className="w-[150px] bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6">
                  {listings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-600">
                            <th className="text-left p-2 text-slate-300">Listing</th>
                            <th className="text-left p-2 text-slate-300">Host</th>
                            <th className="text-left p-2 text-slate-300">Price</th>
                            <th className="text-left p-2 text-slate-300">Status</th>
                            <th className="text-left p-2 text-slate-300">Featured</th>
                            <th className="text-left p-2 text-slate-300">Stats</th>
                            <th className="text-left p-2 text-slate-300">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listings.map((listing) => (
                            <tr key={listing.id} className="border-b border-slate-700">
                              <td className="p-2">
                                <div>
                                  <p className="text-white font-medium max-w-[200px] truncate">{listing.title}</p>
                                  <p className="text-slate-400 text-xs">{listing.location}</p>
                                </div>
                              </td>
                              <td className="p-2 text-slate-300">
                                {listing.host?.name || listing.host?.email}
                              </td>
                              <td className="p-2 text-green-400 font-medium">${listing.price}/night</td>
                              <td className="p-2">
                                <Select
                                  value={listing.status || "active"}
                                  onValueChange={(status) => updateListing(listing.id, { status })}
                                >
                                  <SelectTrigger className="w-[130px] bg-slate-700 border-slate-600 text-white h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-800 border-slate-700">
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                    <SelectItem value="pending_review">Pending</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="p-2">
                                <Button
                                  size="sm"
                                  onClick={() => updateListing(listing.id, { isFeatured: !listing.isFeatured })}
                                  className={listing.isFeatured
                                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                                    : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                                  }
                                >
                                  <Sparkles className="h-4 w-4" />
                                </Button>
                              </td>
                              <td className="p-2 text-slate-400 text-xs">
                                <div>{listing._count?.bookings || 0} bookings</div>
                                <div>{listing._count?.reviews || 0} reviews</div>
                              </td>
                              <td className="p-2">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => window.open(`/listings/${listing.id}`, "_blank")}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    title="View listing"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => deleteListing(listing.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    title="Delete listing"
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
                    <p className="text-center text-slate-400 py-8">No listings found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* BOOKINGS TAB */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Bookings Management</h2>
                <div className="text-sm text-slate-400">{bookings.length} bookings</div>
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <Select value={bookingStatusFilter} onValueChange={setBookingStatusFilter}>
                  <SelectTrigger className="w-[150px] bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6">
                  {bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-600">
                            <th className="text-left p-2 text-slate-300">Listing</th>
                            <th className="text-left p-2 text-slate-300">Guest</th>
                            <th className="text-left p-2 text-slate-300">Dates</th>
                            <th className="text-left p-2 text-slate-300">Total</th>
                            <th className="text-left p-2 text-slate-300">Status</th>
                            <th className="text-left p-2 text-slate-300">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking) => (
                            <tr key={booking.id} className="border-b border-slate-700">
                              <td className="p-2">
                                <p className="text-white max-w-[150px] truncate">{booking.listing?.title}</p>
                                <p className="text-slate-400 text-xs">{booking.listing?.host?.name}</p>
                              </td>
                              <td className="p-2">
                                <p className="text-slate-300">{booking.guest?.name || booking.guest?.email}</p>
                              </td>
                              <td className="p-2 text-xs text-slate-400">
                                {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                                {new Date(booking.checkOut).toLocaleDateString()}
                              </td>
                              <td className="p-2 text-green-400 font-medium">${booking.totalPrice.toFixed(2)}</td>
                              <td className="p-2">
                                <Badge
                                  className={
                                    booking.status === "confirmed"
                                      ? "bg-green-600 text-white"
                                      : booking.status === "pending"
                                      ? "bg-yellow-600 text-white"
                                      : booking.status === "completed"
                                      ? "bg-blue-600 text-white"
                                      : "bg-red-600 text-white"
                                  }
                                >
                                  {booking.status}
                                </Badge>
                              </td>
                              <td className="p-2">
                                <div className="flex gap-2">
                                  {booking.status === "pending" && (
                                    <Button
                                      size="sm"
                                      onClick={() => updateBookingStatus(booking.id, "confirmed")}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {booking.status !== "cancelled" && booking.status !== "completed" && (
                                    <Button
                                      size="sm"
                                      onClick={() => updateBookingStatus(booking.id, "cancelled")}
                                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                                    >
                                      <Ban className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {booking.status === "confirmed" && (
                                    <Button
                                      size="sm"
                                      onClick={() => updateBookingStatus(booking.id, "completed")}
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                      Complete
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    onClick={() => deleteBooking(booking.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
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
                    <p className="text-center text-slate-400 py-8">No bookings found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Reviews Moderation</h2>
                <div className="text-sm text-slate-400">{reviews.length} reviews</div>
              </div>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6">
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="p-4 bg-slate-900 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-slate-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-slate-400 text-xs">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-white text-sm mb-2">
                                {review.comment || <em className="text-slate-500">No comment</em>}
                              </p>
                              <div className="flex gap-4 text-xs text-slate-400">
                                <span>Guest: {review.guest?.name || review.guest?.email}</span>
                                <span>Listing: {review.listing?.title}</span>
                                <span>Host: {review.listing?.host?.name}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => deleteReview(review.id)}
                              className="bg-red-600 hover:bg-red-700 text-white ml-4"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-slate-400 py-8">No reviews found</p>
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
