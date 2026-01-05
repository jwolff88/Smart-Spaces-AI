import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { auth, signOut } from "@/auth"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"
import { ReviewButton } from "./review-button"
import { CancelBookingButton } from "./cancel-booking-button"

/*
  GUEST DASHBOARD
  Philosophy: Editorial trip list, not admin panel

  - Typography-driven hierarchy
  - Status as colored dots, not badges
  - Clean navigation
  - Breathing room between sections
  - Content flows naturally
*/

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function getStatusIndicator(status: string) {
  const styles: Record<string, string> = {
    confirmed: "bg-success",
    pending: "bg-warning",
    cancelled: "bg-destructive",
    completed: "bg-muted-foreground",
  }
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${styles[status] || "bg-muted-foreground"}`}
    />
  )
}

function getStatusText(status: string) {
  const texts: Record<string, string> = {
    confirmed: "Confirmed",
    pending: "Pending",
    cancelled: "Cancelled",
    completed: "Completed",
  }
  return texts[status] || status
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
    <div className="min-h-screen bg-background">
      {/* Header - Minimal, editorial */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-lg font-medium tracking-tight text-foreground"
            >
              Smart Spaces
            </Link>

            {/* Navigation - Typography only */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/search"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Explore
              </Link>
              <Link
                href="/guest-dashboard"
                className="text-sm text-foreground font-medium"
              >
                Trips
              </Link>
              <Link
                href="/messages"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Messages
              </Link>
              <Link
                href="/onboarding"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Preferences
              </Link>
            </nav>

            <form
              action={async () => {
                "use server"
                await signOut()
              }}
            >
              <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground hover:text-foreground">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* Welcome Section */}
        <section>
          <p className="text-overline uppercase text-muted-foreground tracking-widest mb-3">
            Your trips
          </p>
          <h1 className="text-title text-foreground mb-4">
            Welcome back, {session.user.name?.split(" ")[0] || "Guest"}
          </h1>
          <p className="text-body text-muted-foreground max-w-xl">
            {upcomingBookings.length > 0
              ? `You have ${upcomingBookings.length} upcoming ${upcomingBookings.length === 1 ? "trip" : "trips"} planned.`
              : "No upcoming trips. Ready for your next adventure?"}
          </p>
          {upcomingBookings.length === 0 && (
            <Link
              href="/search"
              className="inline-flex items-center gap-2 mt-6 text-primary hover:text-primary/80 transition-colors"
            >
              Browse properties <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </section>

        {/* Upcoming Trips */}
        {upcomingBookings.length > 0 && (
          <section>
            <h2 className="text-headline text-foreground mb-8">Upcoming</h2>
            <div className="space-y-6">
              {upcomingBookings.map((booking) => {
                const nights = getNights(booking.checkIn, booking.checkOut)
                const imageUrl = booking.listing.images?.[0] || booking.listing.imageSrc

                return (
                  <article
                    key={booking.id}
                    className="flex flex-col sm:flex-row gap-6 py-6 border-b border-border last:border-0"
                  >
                    {/* Image */}
                    <div className="w-full sm:w-40 h-32 sm:h-28 bg-secondary rounded-md overflow-hidden relative flex-shrink-0">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={booking.listing.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                          <span className="text-3xl">⌂</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-medium text-foreground">{booking.listing.title}</h3>
                          <p className="text-sm text-muted-foreground">{booking.listing.location}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm flex-shrink-0">
                          {getStatusIndicator(booking.status)}
                          <span className="text-muted-foreground">{getStatusText(booking.status)}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)} · {nights} {nights === 1 ? "night" : "nights"}
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          ${booking.totalPrice.toFixed(0)} total
                        </p>
                        <div className="flex gap-3">
                          <Link
                            href={`/listings/${booking.listing.id}`}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            View listing
                          </Link>
                          {booking.status !== "cancelled" && (
                            <CancelBookingButton
                              bookingId={booking.id}
                              listingTitle={booking.listing.title}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )}

        {/* Past Trips */}
        {pastBookings.length > 0 && (
          <section>
            <h2 className="text-headline text-foreground mb-8">Past stays</h2>
            <div className="space-y-6">
              {pastBookings.map((booking) => {
                const nights = getNights(booking.checkIn, booking.checkOut)
                const imageUrl = booking.listing.images?.[0] || booking.listing.imageSrc
                const canReview = !booking.review && booking.status !== "cancelled"

                return (
                  <article
                    key={booking.id}
                    className="flex flex-col sm:flex-row gap-6 py-6 border-b border-border last:border-0"
                  >
                    {/* Image */}
                    <div className="w-full sm:w-40 h-32 sm:h-28 bg-secondary rounded-md overflow-hidden relative flex-shrink-0">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={booking.listing.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                          <span className="text-3xl">⌂</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-medium text-foreground">{booking.listing.title}</h3>
                          <p className="text-sm text-muted-foreground">{booking.listing.location}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm flex-shrink-0">
                          {getStatusIndicator(booking.status)}
                          <span className="text-muted-foreground">{getStatusText(booking.status)}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)} · {nights} {nights === 1 ? "night" : "nights"}
                      </p>

                      {/* Review status or action */}
                      <div className="flex items-center justify-between">
                        {booking.review ? (
                          <div className="flex items-center gap-1.5 text-sm">
                            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                            <span className="text-muted-foreground">
                              You rated this {booking.review.rating}/5
                            </span>
                          </div>
                        ) : (
                          <span />
                        )}
                        <div className="flex gap-3">
                          {canReview && (
                            <ReviewButton
                              bookingId={booking.id}
                              listingTitle={booking.listing.title}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )}

        {/* Empty state for no bookings at all */}
        {bookings.length === 0 && (
          <section className="py-16 text-center">
            <p className="text-muted-foreground mb-2">No trips yet</p>
            <p className="text-sm text-muted-foreground/70 mb-6">
              When you book a stay, it will appear here.
            </p>
            <Link
              href="/search"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Start exploring
            </Link>
          </section>
        )}
      </main>
    </div>
  )
}
