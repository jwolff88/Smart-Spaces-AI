import { Skeleton } from "@/components/ui/skeleton"

export default function GuestDashboardLoading() {
  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-6 shadow-sm">
        <Skeleton className="h-6 w-32" />
        <div className="ml-auto flex items-center gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>

      <main className="container grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-8 md:gap-8">
        {/* Welcome Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="border rounded-lg p-4">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Bookings */}
        <div className="border rounded-lg">
          <div className="p-6 border-b">
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 p-4 border rounded-lg">
                <Skeleton className="h-20 w-20 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
