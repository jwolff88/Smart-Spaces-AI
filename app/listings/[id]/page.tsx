import { db } from "@/lib/db"
import { auth } from "@/auth"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, BedDouble, Home, Share, ArrowLeft, Star, Users } from "lucide-react"
import Link from "next/link"
import { BookingForm } from "@/components/booking-form"
import { ReviewsDisplay } from "@/components/reviews-display"
import { ContactHostButton } from "@/components/contact-host-button"
import { Metadata } from "next"

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
    <div className="min-h-screen bg-white pb-24 lg:pb-0">
      {/* Navbar */}
      <div className="border-b sticky top-0 bg-white z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/search" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors -ml-2 px-2 py-1.5 rounded-md hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Search</span>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        
        {/* Left Column: Photos & Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* UPDATED HERO IMAGE AREA */}
          <div className="aspect-video bg-gray-100 rounded-2xl relative overflow-hidden flex items-center justify-center group">
            {listing.imageSrc ? (
              <Image 
                src={listing.imageSrc} 
                alt={listing.title || "Listing Image"}
                fill
                className="object-cover"
              />
            ) : (
              <Home className="h-20 w-20 text-gray-300" />
            )}
            
            <div className="absolute bottom-4 left-4">
              <Badge className="bg-white/90 text-black hover:bg-white backdrop-blur">
                {listing.type || "Home"}
              </Badge>
            </div>
          </div>

          {/* Title & Stats */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{listing.title}</h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 flex-shrink-0" /> {listing.location}
              </span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <BedDouble className="h-4 w-4 flex-shrink-0" /> {listing.bedrooms} Bed
              </span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4 flex-shrink-0" /> {listing.maxGuests} Guests
              </span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" /> New
              </span>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Host Info */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
              {listing.host?.name?.[0] || "H"}
            </div>
            <div>
              <p className="font-semibold text-gray-900">Hosted by {listing.host?.name || "Host"}</p>
              <p className="text-sm text-gray-500">Verified Host</p>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* AI Description */}
          <div>
            <h2 className="text-xl font-semibold mb-4">About this space</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Amenities */}
          <div>
            <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
            <div className="grid grid-cols-2 gap-4">
              {listing.amenities && listing.amenities.length > 0 ? (
                listing.amenities.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-600">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    {item}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No specific amenities listed.</p>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Reviews Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Guest Reviews</h2>
            <ReviewsDisplay listingId={listing.id} />
          </div>
        </div>

        {/* Right Column: Booking Card (Sticky on Desktop) */}
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

      {/* Mobile Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 lg:hidden z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-xl font-bold">${listing.price}</span>
            <span className="text-gray-500 text-sm"> / night</span>
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
              <Button className="px-6">
                {session?.user ? "Book Now" : "Sign in to Book"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Booking Form (In-page) */}
      <div className="lg:hidden max-w-6xl mx-auto p-4 sm:p-6" id="booking">
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