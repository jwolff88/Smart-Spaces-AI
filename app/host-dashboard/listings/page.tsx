"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, MoreVertical, Home, Loader2, RefreshCw } from "lucide-react"

// Define the shape of our Listing based on the Prisma Schema
interface Listing {
  id: string
  title: string
  location: string
  price: number
  smartPricing: boolean
  maintenanceHealth: string
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchListings = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/listings")
      if (res.ok) {
        const data = await res.json()
        setListings(data)
      }
    } catch (error) {
      console.error("Failed to load listings", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load data when page opens
  useEffect(() => {
    fetchListings()
  }, [])

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-120px)]">
      
      {/* --- HEADER ACTIONS --- */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search properties..." className="pl-8" />
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="icon" onClick={fetchListings} title="Refresh Data">
             <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
           </Button>
           <Button asChild>
            <Link href="/host-dashboard/add-property">
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
           </Button>
        </div>
      </div>

      {/* --- LISTINGS GRID --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-y-auto p-1">
        
        {isLoading && listings.length === 0 ? (
           <div className="col-span-full flex justify-center py-20 text-muted-foreground">
             <Loader2 className="h-8 w-8 animate-spin" />
           </div>
        ) : listings.length === 0 ? (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            <p>No properties found.</p>
            <p className="text-sm">Click "Add New" to list your first space.</p>
          </div>
        ) : (
          listings.map((property) => (
            <Card key={property.id} className="overflow-hidden transition-all hover:shadow-md">
              <div className="aspect-video w-full bg-muted/50 relative">
                 {/* Placeholder for Property Image */}
                 <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                    <Home className="h-12 w-12" />
                 </div>
                 <Badge 
                  className={`absolute top-2 right-2 ${
                    property.maintenanceHealth === "Critical" ? "bg-red-500" : 
                    property.maintenanceHealth === "Warning" ? "bg-yellow-500" : "bg-green-500"
                  }`}
                 >
                  {property.maintenanceHealth}
                 </Badge>
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base line-clamp-1" title={property.title}>
                    {property.title}
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">{property.location}</div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold">${property.price}<span className="text-xs font-normal text-muted-foreground">/night</span></div>
                  {property.smartPricing && (
                    <Badge variant="outline" className="border-amber-200 text-amber-600 bg-amber-50 text-[10px]">
                      Smart Pricing On
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-2 border-t bg-muted/20">
                 <Button variant="ghost" size="sm" className="w-full text-xs">View Details</Button>
              </CardFooter>
            </Card>
          ))
        )}

      </div>
    </div>
  )
}