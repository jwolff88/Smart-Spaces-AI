import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { auth, signOut } from "@/auth"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  MessageSquare,
  LogOut,
  Home,
  Star,
} from "lucide-react"
import { ReviewButton } from "./review-button"

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
      return <Badge className="bg-yellow-500">Pending Payment</Badge>
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>
    case "completed":
      return <Badge variant="secondary">Completed</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getNights(checkIn: Date, checkOut: Date) {
  return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
}

export default async function GuestDashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Fetch user's bookings with reviews
  const bookings = await db.booking.findMany({
    where: { guestId: session.user.id },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          location: true,
          imageSrc: true,
          images: true,
          host: { select: { name: true } },
        },
      },
      review: true,
    },
    orderBy: { checkIn: "desc" },
  })

  const now = new Date()
  const upcomingBookings = bookings.filter(
    (b) => b.checkIn >= now && b.status !== "cancelled"
  )
  const pastBookings = bookings.filter(
    (b) => b.checkOut < now || b.status === "completed"
  )

  return (
    <div className="min-h-screen bg-muted/40">
      {/* --- TOP NAVIGATION --- */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">Smart Spaces</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 text-sm font-medium">
          <Link href="/search" className="text-muted-foreground hover:text-foreground">
            Explore
          </Link>
          <Link href="#" className="text-primary font-semibold">
            Trips
          </Link>
          <Link href="/messages" className="text-muted-foreground hover:text-foreground">
            Messages
          </Link>
          <Link href="/settings" className="text-muted-foreground hover:text-foreground">
            Settings
          </Link>
          <form
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" type="submit">
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </nav>
      </header>

      <main className="container grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-8 md:gap-8">
        {/* --- WELCOME --- */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {session.user.name || "Guest"}!
            </h1>
            <p className="text-muted-foreground">
              {upcomingBookings.length > 0
                ? `You have ${upcomingBookings.length} upcoming trip${upcomingBookings.length > 1 ? "s" : ""}.`
                : "You have no upcoming trips. Start exploring!"}
            </p>
          </div>

          {/* CTA CARD */}
          <Card className="bg-primary/5 border-primary/20 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <CardTitle className="text-sm font-medium">Find Your Next Stay</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Browse AI-optimized listings and discover your perfect vacation rental.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/search" className="w-full">
                <Button size="sm" variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/10">
                  Browse Listings <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="grid gap-4">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastBookings.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* --- UPCOMING TRIPS --- */}
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Trips</CardTitle>
                <CardDescription>
                  Manage your bookings and view check-in details.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                {upcomingBookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <Home className="h-12 w-12 mb-4 opacity-20" />
                    <p>No upcoming trips.</p>
                    <Link href="/search">
                      <Button variant="link" className="mt-2">
                        Start exploring
                      </Button>
                    </Link>
                  </div>
                ) : (
                  upcomingBookings.map((booking) => {
                    const nights = getNights(booking.checkIn, booking.checkOut)
                    const imageUrl = booking.listing.images?.[0] || booking.listing.imageSrc

                    return (
                      <div
                        key={booking.id}
                        className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center"
                      >
                        <div className="h-24 w-24 rounded-md bg-slate-200 sm:h-20 sm:w-20 relative overflow-hidden flex-shrink-0">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={booking.listing.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Home className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="grid gap-1 flex-1">
                          <h3 className="font-semibold">{booking.listing.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {booking.listing.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)} ({nights} night{nights > 1 ? "s" : ""})
                          </div>
                          <div className="text-sm font-medium">
                            ${booking.totalPrice.toFixed(2)} total
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 sm:items-end">
                          {getStatusBadge(booking.status)}
                          <div className="flex gap-2">
                            <Link href={`/listings/${booking.listing.id}`}>
                              <Button size="sm" variant="outline">
                                View Listing
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- PAST TRIPS --- */}
          <TabsContent value="past">
            <Card>
              <CardHeader>
                <CardTitle>Past Stays</CardTitle>
                <CardDescription>View your previous trips.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                {pastBookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <p>No past trips found.</p>
                    <Link href="/search">
                      <Button variant="link" className="mt-2">
                        Start exploring
                      </Button>
                    </Link>
                  </div>
                ) : (
                  pastBookings.map((booking) => {
                    const nights = getNights(booking.checkIn, booking.checkOut)
                    const imageUrl = booking.listing.images?.[0] || booking.listing.imageSrc
                    const canReview = !booking.review && booking.status !== "cancelled"

                    return (
                      <div
                        key={booking.id}
                        className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center"
                      >
                        <div className="h-24 w-24 rounded-md bg-slate-200 sm:h-20 sm:w-20 relative overflow-hidden flex-shrink-0">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={booking.listing.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Home className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="grid gap-1 flex-1">
                          <h3 className="font-semibold">{booking.listing.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {booking.listing.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)} ({nights} nights)
                          </div>
                          {booking.review && (
                            <div className="flex items-center gap-1 text-sm text-yellow-600">
                              <Star className="h-3 w-3 fill-yellow-500" />
                              <span>You rated this {booking.review.rating}/5</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 sm:items-end">
                          {getStatusBadge(booking.status)}
                          {canReview ? (
                            <ReviewButton
                              bookingId={booking.id}
                              listingTitle={booking.listing.title}
                            />
                          ) : booking.review ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <Star className="h-3 w-3 mr-1 fill-green-600" />
                              Reviewed
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
