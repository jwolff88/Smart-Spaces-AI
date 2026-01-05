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
  Philosophy: Neon Futuristic Holographic

  - Dark background with cyan grid
  - Glowing status indicators
  - Glass morphism cards
  - Neon accent colors (cyan, magenta)
*/

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function getStatusIndicator(status: string) {
  const styles: Record<string, string> = {
    confirmed: "bg-accent glow-lime",
    pending: "bg-warning glow-cyan",
    cancelled: "bg-destructive glow-magenta",
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
    <div className="min-h-screen bg-background bg-grid relative">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-neon">
        <div className="max-w-5xl mx-auto px-6">
          <div className="h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-lg font-bold tracking-wider text-foreground text-glow-cyan"
            >
              SMART SPACES
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/search"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Explore
              </Link>
              <Link
                href="/guest-dashboard"
                className="text-sm text-primary font-medium text-glow-cyan"
              >
                Trips
              </Link>
              <Link
                href="/messages"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Messages
              </Link>
              <Link
                href="/onboarding"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
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
              <Button variant="outline" size="sm" type="submit" className="border-border/50 hover:border-secondary/50 hover:glow-magenta transition-all">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16 relative z-10">
        {/* Welcome Section */}
        <section>
          <p className="text-overline uppercase text-primary tracking-widest mb-3 text-glow-cyan">
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
            <Link href="/search" className="inline-block mt-6">
              <Button className="bg-primary hover:bg-primary/80 glow-cyan hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] transition-all">
                Browse properties <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </section>

        {/* Upcoming Trips */}
        {upcomingBookings.length > 0 && (
          <section>
            <h2 className="text-headline text-foreground mb-8 text-glow-cyan">Upcoming</h2>
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
                        <div className="flex gap-2">
                          <Link href={`/listings/${booking.listing.id}`}>
                            <Button size="sm" variant="outline">
                              View Listing
                            </Button>
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
            <h2 className="text-headline text-foreground mb-8 text-glow-magenta">Past stays</h2>
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
            <Link href="/search">
              <Button variant="link">
                Start exploring
              </Button>
            </Link>
          </section>
        )}
      </main>
    </div>
  )
}
