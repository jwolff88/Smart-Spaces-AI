import { auth, signOut } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Home, LogOut, Calendar, DollarSign, Users, Clock } from "lucide-react"
import { StripeConnectCard } from "@/components/stripe-connect-card"

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function getStatusBadge(status: string) {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-600">Confirmed</Badge>
    case "pending":
      return <Badge className="bg-yellow-500">Pending</Badge>
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>
    case "completed":
      return <Badge variant="secondary">Completed</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

interface PageProps {
  searchParams: Promise<{ connect?: string }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams
  const connectStatus = params.connect as "success" | "refresh" | undefined

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Fetch user's listings with booking counts
  const listings = await db.listing.findMany({
    where: { hostId: session.user.id },
    include: {
      _count: { select: { bookings: true } },
      bookings: {
        where: { status: { in: ["pending", "confirmed"] } },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Fetch all bookings for host's listings
  const bookings = await db.booking.findMany({
    where: {
      listing: { hostId: session.user.id },
    },
    include: {
      listing: { select: { id: true, title: true, location: true } },
      guest: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  // Calculate stats
  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed")
  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + (b.totalPrice - b.serviceFee), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Host Dashboard</h1>
          <p className="text-gray-500">Welcome back, {session.user.name || "Host"}!</p>
        </div>
        <div className="flex gap-3">
          <form
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <Button variant="outline" type="submit">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </form>
          <Link href="/host-dashboard/add-property">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Stripe Connect Card */}
      <StripeConnectCard initialStatus={connectStatus} />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">After platform fees</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>
            Reservations for your properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No bookings yet.</p>
              <p className="text-sm">When guests book your properties, they'll appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const nights = Math.ceil(
                  (booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24)
                )
                return (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{booking.listing.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.guest.name || booking.guest.email} • {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)} ({nights} nights)
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">${(booking.totalPrice - booking.serviceFee).toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">Your earnings</div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Listings Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Properties</h2>
        {listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed">
            <Home className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No properties yet</h3>
            <p className="text-gray-500 mb-6">Create your first AI-optimized listing today.</p>
            <Link href="/host-dashboard/add-property">
              <Button>Create Listing</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => {
              const imageUrl = listing.images?.[0] || listing.imageSrc
              return (
                <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <Home className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                      ${listing.price}/night
                    </div>
                    {listing._count.bookings > 0 && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                        {listing._count.bookings} booking{listing._count.bookings > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1 text-lg">{listing.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-gray-500 text-sm line-clamp-2 mb-2">
                      {listing.description}
                    </p>
                    <div className="flex gap-2 text-xs text-gray-400">
                      <span>{listing.bedrooms} Beds</span> •
                      <span>{listing.type}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-gray-50/50 p-4">
                    <Link href={`/listings/${listing.id}`} className="w-full">
                      <Button variant="outline" className="w-full h-8 text-xs">
                        View Listing
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
