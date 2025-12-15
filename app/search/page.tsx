import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Home, BedDouble, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const dynamic = 'force-dynamic'

export default async function SearchPage() {
  const listings = await db.listing.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="font-bold text-xl">Explore Stays</h1>
          </div>
          <Link href="/login">
            <Button variant="outline">Sign In</Button>
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-transparent hover:border-gray-200">
              
              {/* IMAGE SECTION - UPDATED */}
              <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden rounded-t-xl">
                {listing.imageSrc ? (
                  <Image 
                    src={listing.imageSrc} 
                    alt={listing.title || "Listing Image"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100 group-hover:scale-105 transition-transform duration-500">
                    <Home className="h-12 w-12 opacity-20" />
                  </div>
                )}
                
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="font-bold bg-white/90 backdrop-blur-sm shadow-sm">
                    ${listing.price} <span className="font-normal text-xs ml-1 text-gray-500">/ night</span>
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {listing.title}
                  </h3>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="line-clamp-1">{listing.location}</span>
                </div>

                <div className="flex gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                    <BedDouble className="h-3 w-3" />
                    {listing.bedrooms} Beds
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                    <Home className="h-3 w-3" />
                    {listing.type}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full bg-slate-900 group-hover:bg-blue-600 transition-colors">
                  <Link href={`/listings/${listing.id}`}>
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          {listings.length === 0 && (
            <div className="col-span-full text-center py-20">
              <h3 className="text-xl font-medium text-gray-900">No listings found</h3>
              <p className="text-gray-500 mt-2">Be the first to host a property!</p>
              <Link href="/host-dashboard/add-property" className="mt-6 inline-block">
                <Button>Create Listing</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}