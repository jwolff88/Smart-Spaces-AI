import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

/*
  HOST DASHBOARD PAGE
  Philosophy: Editorial content flow, not admin panel

  - Stats integrated into content, not isolated cards
  - Breathing room between sections
  - Typography-driven hierarchy
  - Minimal chrome, maximum content
*/

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function getStatusIndicator(status: string) {
  const styles = {
    confirmed: "bg-success",
    pending: "bg-warning",
    cancelled: "bg-destructive",
    completed: "bg-muted-foreground",
  }
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${styles[status as keyof typeof styles] || "bg-muted-foreground"}`}
    />
  )
}

interface PageProps {
  searchParams: Promise<{ connect?: string }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  await searchParams

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
    take: 5,
  })

  // Calculate stats
  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed")
  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + (b.totalPrice - b.serviceFee), 0)

  const firstName = session.user.name?.split(" ")[0] || "there"

  return (
    <div className="space-y-16">
      {/* Welcome Section - Editorial, not admin */}
      <section>
        <p className="text-overline uppercase text-muted-foreground tracking-widest mb-2">
          Overview
        </p>
        <h1 className="text-title text-foreground mb-4">
          Welcome back, {firstName}
        </h1>

        {/* Stats as inline text, not cards */}
        <p className="text-body-lg text-muted-foreground max-w-2xl">
          You have{" "}
          <span className="text-foreground font-medium">{listings.length} {listings.length === 1 ? "property" : "properties"}</span>
          {pendingBookings.length > 0 && (
            <>
              {" "}with{" "}
              <span className="text-warning font-medium">
                {pendingBookings.length} pending {pendingBookings.length === 1 ? "booking" : "bookings"}
              </span>
            </>
          )}
          {confirmedBookings.length > 0 && (
            <>
              {" "}and{" "}
              <span className="text-success font-medium">
                {confirmedBookings.length} confirmed
              </span>
            </>
          )}
          .
          {totalRevenue > 0 && (
            <>
              {" "}You&apos;ve earned{" "}
              <span className="text-foreground font-medium">${totalRevenue.toFixed(0)}</span>
              {" "}so far.
            </>
          )}
        </p>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-headline text-foreground">Recent activity</h2>
          {bookings.length > 0 && (
            <Link
              href="/host-dashboard/calendar"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View all
            </Link>
          )}
        </div>

        {bookings.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground mb-1">No bookings yet</p>
            <p className="text-sm text-muted-foreground/70">
              When guests book your properties, they&apos;ll appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {bookings.map((booking) => {
              const nights = Math.ceil(
                (booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24)
              )
              return (
                <div
                  key={booking.id}
                  className="py-5 first:pt-0 last:pb-0 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    {getStatusIndicator(booking.status)}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {booking.guest.name || booking.guest.email?.split("@")[0]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.listing.title} · {formatDate(booking.checkIn)}–{formatDate(booking.checkOut)}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">
                        {nights} {nights === 1 ? "night" : "nights"} · {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    ${(booking.totalPrice - booking.serviceFee).toFixed(0)}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Properties Section */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-headline text-foreground">Your properties</h2>
          <Link
            href="/host-dashboard/add-property"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Add property
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground mb-2">No properties yet</p>
            <p className="text-sm text-muted-foreground/70 mb-6 max-w-sm mx-auto">
              List your first property. Our AI will help write the perfect description.
            </p>
            <Link href="/host-dashboard/add-property">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Add your first property
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listings.map((listing) => {
              const imageUrl = listing.images?.[0] || listing.imageSrc
              return (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="group block"
                >
                  <article className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-28 h-20 bg-secondary rounded-md overflow-hidden flex-shrink-0 relative">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={listing.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                          <span className="text-2xl">⌂</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        ${listing.price}/night · {listing.bedrooms} {listing.bedrooms === 1 ? "bed" : "beds"}
                      </p>
                      {listing._count.bookings > 0 && (
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          {listing._count.bookings} {listing._count.bookings === 1 ? "booking" : "bookings"}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
