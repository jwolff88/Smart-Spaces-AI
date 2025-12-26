"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Home,
  Users,
  BarChart3,
} from "lucide-react"

interface AnalyticsData {
  summary: {
    totalEarnings: number
    totalBookings: number
    avgBookingValue: number
    occupancyRate: number
    totalNights: number
  }
  monthlyEarnings: Array<{ month: string; earnings: number }>
  bookingsByStatus: Array<{ status: string; count: number }>
  topListings: Array<{
    id: string
    title: string
    earnings: number
    bookings: number
  }>
  recentBookings: Array<{
    id: string
    listingTitle: string
    guestName: string
    checkIn: string
    checkOut: string
    totalPrice: number
    earnings: number
    status: string
    createdAt: string
  }>
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string
  value: string
  subtitle?: string
  icon: any
  color: string
}) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EarningsChart({
  data,
}: {
  data: Array<{ month: string; earnings: number }>
}) {
  const maxEarnings = Math.max(...data.map((d) => d.earnings), 1)

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Monthly Earnings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2 h-48">
          {data.map((item, index) => {
            const height = (item.earnings / maxEarnings) * 100
            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div className="w-full flex flex-col items-center justify-end h-40">
                  <span className="text-xs text-slate-400 mb-1">
                    ${item.earnings.toLocaleString()}
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-500"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">{item.month}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function BookingStatusChart({
  data,
}: {
  data: Array<{ status: string; count: number }>
}) {
  const total = data.reduce((sum, d) => sum + d.count, 0)
  const colors: Record<string, string> = {
    pending: "bg-yellow-500",
    confirmed: "bg-green-500",
    completed: "bg-blue-500",
    cancelled: "bg-red-500",
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Booking Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item) => {
            const percentage = total > 0 ? (item.count / total) * 100 : 0
            return (
              <div key={item.status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300 capitalize">
                    {item.status}
                  </span>
                  <span className="text-white font-medium">{item.count}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colors[item.status] || "bg-slate-500"} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function TopListingsTable({
  data,
}: {
  data: Array<{
    id: string
    title: string
    earnings: number
    bookings: number
  }>
}) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Home className="h-5 w-5" />
          Top Performing Listings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No data yet</p>
        ) : (
          <div className="space-y-3">
            {data.map((listing, index) => (
              <div
                key={listing.id}
                className="flex items-center justify-between p-3 bg-slate-900 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-slate-500">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-white font-medium truncate max-w-[200px]">
                      {listing.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {listing.bookings} booking
                      {listing.bookings !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <span className="text-green-400 font-bold">
                  ${listing.earnings.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function RecentBookingsTable({
  data,
}: {
  data: Array<{
    id: string
    listingTitle: string
    guestName: string
    checkIn: string
    checkOut: string
    earnings: number
    status: string
  }>
}) {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-600",
    confirmed: "bg-green-600",
    completed: "bg-blue-600",
    cancelled: "bg-red-600",
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recent Bookings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-2 text-slate-400">Guest</th>
                  <th className="text-left p-2 text-slate-400">Property</th>
                  <th className="text-left p-2 text-slate-400">Dates</th>
                  <th className="text-left p-2 text-slate-400">Earnings</th>
                  <th className="text-left p-2 text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-700/50">
                    <td className="p-2 text-white">{booking.guestName}</td>
                    <td className="p-2 text-slate-300 max-w-[150px] truncate">
                      {booking.listingTitle}
                    </td>
                    <td className="p-2 text-slate-400 text-xs">
                      {booking.checkIn} → {booking.checkOut}
                    </td>
                    <td className="p-2 text-green-400 font-medium">
                      ${booking.earnings}
                    </td>
                    <td className="p-2">
                      <Badge
                        className={`${statusColors[booking.status]} text-white text-xs`}
                      >
                        {booking.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function HostAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("6months")

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true)
      try {
        const res = await fetch(`/api/host/analytics?period=${period}`)
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [period])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-slate-400">
        Failed to load analytics
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Analytics
          </h1>
          <p className="text-slate-400">Track your earnings and performance</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[150px] bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Earnings"
          value={`$${data.summary.totalEarnings.toLocaleString()}`}
          subtitle="After platform fees"
          icon={DollarSign}
          color="bg-green-600"
        />
        <StatCard
          title="Total Bookings"
          value={data.summary.totalBookings.toString()}
          subtitle={`${data.summary.totalNights} nights booked`}
          icon={Calendar}
          color="bg-blue-600"
        />
        <StatCard
          title="Avg Booking Value"
          value={`$${data.summary.avgBookingValue.toLocaleString()}`}
          subtitle="Per confirmed booking"
          icon={TrendingUp}
          color="bg-purple-600"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${data.summary.occupancyRate}%`}
          subtitle="Of available nights"
          icon={Users}
          color="bg-orange-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <EarningsChart data={data.monthlyEarnings} />
        </div>
        <BookingStatusChart data={data.bookingsByStatus} />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopListingsTable data={data.topListings} />
        <RecentBookingsTable data={data.recentBookings} />
      </div>
    </div>
  )
}
