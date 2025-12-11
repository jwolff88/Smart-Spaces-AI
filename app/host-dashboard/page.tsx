import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Home, LogOut } from "lucide-react"
import { signOut } from "@/auth" // We will use a server action for signout

export default async function DashboardPage() {
  // 1. Check if user is logged in
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  // 2. Fetch user's listings
  const listings = await db.listing.findMany({
    where: {
      hostId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Host Dashboard</h1>
            <p className="text-gray-500">Welcome back, {session.user.name || "Host"}!</p>
          </div>
          <div className="flex gap-4">
             <form action={async () => {
                "use server"
                await signOut()
              }}>
                <Button variant="outline" type="submit">
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </form>
            <Link href="/host-dashboard/add-property">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Property
              </Button>
            </Link>
          </div>
        </div>

        {/* Listings Grid */}
        {listings.length === 0 ? (
          // Empty State
          <div className="text-center py-20 bg-white rounded-xl border border-dashed">
            <Home className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No properties yet</h3>
            <p className="text-gray-500 mb-6">Create your first AI-optimized listing today.</p>
            <Link href="/host-dashboard/add-property">
              <Button>Create Listing</Button>
            </Link>
          </div>
        ) : (
          // List of Properties
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  {/* Placeholder for Image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Home className="h-12 w-12" />
                  </div>
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                    ${listing.price}/night
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1 text-lg">{listing.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                    {listing.description}
                  </p>
                  <div className="flex gap-2 text-xs text-gray-400">
                    <span>{listing.bedrooms} Beds</span> • 
                    <span>{listing.type}</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50/50 p-4">
                  <Button variant="outline" className="w-full h-8 text-xs">
                    Manage Property
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}