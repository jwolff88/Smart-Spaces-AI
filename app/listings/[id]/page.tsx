import { db } from "@/lib/db"
import { auth } from "@/auth"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, BedDouble, Home, Share, ArrowLeft, Star, Users } from "lucide-react"
import Link from "next/link"
import { BookingForm } from "@/components/booking-form"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ListingDetailsPage(props: PageProps) {
  const params = await props.params
  const session = await auth()

  const listing = await db.listing.findUnique({
    where: { id: params.id },
    include: { host: true }
  })

  if (!listing) return notFound()

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <div className="border-b sticky top-0 bg-white z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/search">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Search
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {listing.location}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <BedDouble className="h-4 w-4" /> {listing.bedrooms} Bedroom(s)
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {listing.maxGuests} Guests
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> New Listing
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
        </div>

        {/* Right Column: Booking Card (Sticky) */}
        <div className="relative">
          <div className="sticky top-24">
            <BookingForm
              listingId={listing.id}
              price={listing.price}
              maxGuests={listing.maxGuests}
              isAuthenticated={!!session?.user}
            />
          </div>
        </div>

      </main>
    </div>
  )
}