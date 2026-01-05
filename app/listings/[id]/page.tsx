import { db } from "@/lib/db"
import { auth } from "@/auth"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BookingForm } from "@/components/booking-form"
import { ReviewsDisplay } from "@/components/reviews-display"
import { ContactHostButton } from "@/components/contact-host-button"
import { Metadata } from "next"

/*
  LISTING DETAIL PAGE
  Philosophy: Editorial property presentation

  - Clean hero image, no overlays
  - Typography-driven information hierarchy
  - Breathing room between sections
  - Warm, inviting aesthetics
  - Content flows naturally
*/

interface PageProps {
  params: Promise<{ id: string }>
}

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://smart-spaces-ai.vercel.app"

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const listing = await db.listing.findUnique({
    where: { id },
    include: { host: true },
  })

  if (!listing) {
    return {
      title: "Listing Not Found",
    }
  }

  const description = listing.description?.slice(0, 160) || `${listing.title} - ${listing.bedrooms} bedroom rental in ${listing.location}`

  return {
    title: listing.title,
    description,
    openGraph: {
      title: listing.title,
      description,
      type: "website",
      url: `${siteUrl}/listings/${id}`,
      images: listing.imageSrc ? [
        {
          url: listing.imageSrc,
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description,
      images: listing.imageSrc ? [listing.imageSrc] : undefined,
    },
  }
}

export default async function ListingDetailsPage(props: PageProps) {
  const params = await props.params
  const session = await auth()

  const listing = await db.listing.findUnique({
    where: { id: params.id },
    include: { host: true }
  })

  if (!listing) return notFound()

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: listing.title,
    description: listing.description,
    image: listing.imageSrc || undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.location,
    },
    priceRange: `$${listing.price}/night`,
    aggregateRating: listing.matchScore ? {
      "@type": "AggregateRating",
      ratingValue: (listing.matchScore / 20).toFixed(1), // Convert 0-100 to 0-5
      bestRating: "5",
      worstRating: "1",
    } : undefined,
    amenityFeature: listing.amenities?.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true,
    })),
    numberOfRooms: listing.bedrooms ? parseInt(listing.bedrooms) : undefined,
    petsAllowed: listing.amenities?.some(a => a.toLowerCase().includes("pet")),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background pb-24 lg:pb-0">
        {/* Header - Minimal */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <Link href="/" className="text-sm font-medium text-foreground">
              Smart Spaces
            </Link>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Left Column: Content */}
          <div className="lg:col-span-2 space-y-12">

            {/* Hero Image - Clean, no overlays */}
            <div className="aspect-[4/3] sm:aspect-video bg-secondary rounded-md overflow-hidden relative">
              {listing.imageSrc ? (
                <Image
                  src={listing.imageSrc}
                  alt={listing.title || "Property"}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                  <span className="text-6xl">⌂</span>
                </div>
              )}
            </div>

            {/* Title & Key Info */}
            <div>
              <p className="text-overline uppercase text-muted-foreground tracking-widest mb-3">
                {listing.type || "Property"} in {listing.location}
              </p>
              <h1 className="text-title text-foreground mb-4">{listing.title}</h1>
              <p className="text-body text-muted-foreground">
                {listing.bedrooms} {parseInt(listing.bedrooms) === 1 ? "bedroom" : "bedrooms"} ·
                Up to {listing.maxGuests} {listing.maxGuests === 1 ? "guest" : "guests"}
              </p>
            </div>

            {/* Host Info - Warm, not blue */}
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center text-foreground font-medium text-lg">
                {listing.host?.name?.[0]?.toUpperCase() || "H"}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Hosted by {listing.host?.name || "Host"}
                </p>
                <p className="text-sm text-muted-foreground">Verified host</p>
              </div>
            </div>

            {/* Description */}
            <section>
              <h2 className="text-headline text-foreground mb-4">About this space</h2>
              <div className="prose-width">
                <p className="text-body text-muted-foreground leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>
            </section>

            {/* Amenities - Clean list, no bullet icons */}
            <section>
              <h2 className="text-headline text-foreground mb-4">What&apos;s included</h2>
              {listing.amenities && listing.amenities.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {listing.amenities.map((item, i) => (
                    <p key={i} className="text-body text-muted-foreground">
                      {item}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-body text-muted-foreground">
                  Contact the host for amenity details.
                </p>
              )}
            </section>

            {/* Reviews Section */}
            <section>
              <h2 className="text-headline text-foreground mb-4">Reviews</h2>
              <ReviewsDisplay listingId={listing.id} />
            </section>
          </div>

          {/* Right Column: Booking (Sticky on Desktop) */}
          <div className="hidden lg:block relative">
            <div className="sticky top-20 space-y-4">
              <BookingForm
                listingId={listing.id}
                price={listing.price}
                maxGuests={listing.maxGuests}
                isAuthenticated={!!session?.user}
              />
              <ContactHostButton
                hostId={listing.hostId}
                hostName={listing.host?.name || "Host"}
                listingId={listing.id}
                listingTitle={listing.title}
                isAuthenticated={!!session?.user}
              />
            </div>
          </div>
        </main>

        {/* Mobile Sticky Footer - Lighter */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 lg:hidden z-30">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div>
              <span className="text-lg font-medium text-foreground">${listing.price}</span>
              <span className="text-muted-foreground text-sm">/night</span>
            </div>
            <div className="flex gap-2">
              <ContactHostButton
                hostId={listing.hostId}
                hostName={listing.host?.name || "Host"}
                listingId={listing.id}
                listingTitle={listing.title}
                isAuthenticated={!!session?.user}
                variant="mobile"
              />
              <Link href={session?.user ? `#booking` : "/login?role=traveler"}>
                <Button className="px-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                  {session?.user ? "Book now" : "Sign in"}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Booking Form (In-page) */}
        <div className="lg:hidden max-w-6xl mx-auto px-6 pb-8" id="booking">
          <BookingForm
            listingId={listing.id}
            price={listing.price}
            maxGuests={listing.maxGuests}
            isAuthenticated={!!session?.user}
          />
        </div>
      </div>
    </>
  )
}