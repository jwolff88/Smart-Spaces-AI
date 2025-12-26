import { Skeleton } from "@/components/ui/skeleton"

export default function ListingLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Skeleton */}
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Image */}
          <Skeleton className="aspect-video rounded-2xl" />

          {/* Title & Stats */}
          <div>
            <Skeleton className="h-8 w-3/4 mb-3" />
            <div className="flex gap-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>

          <Skeleton className="h-px w-full" />

          {/* Host Info */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <Skeleton className="h-px w-full" />

          {/* Description */}
          <div>
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Skeleton className="h-px w-full" />

          {/* Amenities */}
          <div>
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-5 w-32" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="border rounded-xl p-6 space-y-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
