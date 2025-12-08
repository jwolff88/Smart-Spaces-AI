import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Star, 
  MapPin, 
  Wifi, 
  Monitor, 
  Coffee, 
  ShieldCheck, 
  ArrowLeft, 
  Share2, 
  Heart, 
  Zap,
  Info
} from "lucide-react"

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  // Mock Data: In a real app, you fetch this from your Database based on 'id'
  const property = {
    title: "The Quiet Loft | Dedicated Workspace",
    location: "Downtown Art District, San Francisco",
    rating: 4.92,
    reviews: 128,
    price: 145,
    originalPrice: 175,
    matchScore: 98,
    description: "Designed specifically for digital nomads, this loft features soundproof walls, a Herman Miller chair, and enterprise-grade fiber internet. Located in the quietest block of the Art District.",
    amenities: [
      { icon: Wifi, label: "Verified 400Mbps Fiber" },
      { icon: Monitor, label: "Dual Monitor Setup" },
      { icon: Coffee, label: "Espresso Machine" },
      { icon: ShieldCheck, label: "Smart Lock Entry" },
    ],
    aiInsights: [
      "Perfect for your 'Remote Work' intent.",
      "Previous guests rated 'Video Call Quality' as 5/5.",
      "Quiet hours strictly enforced by community."
    ]
  }

  return (
    <div className="min-h-screen pb-20">
      
      {/* --- NAVIGATION --- */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur px-4 h-16 flex items-center justify-between">
        <Link href="/recommendations" className="flex items-center text-sm font-medium hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Matches
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* --- HERO IMAGE GRID (Placeholder) --- */}
      <div className="grid h-[300px] w-full grid-cols-4 gap-1 p-1 md:h-[400px] md:px-8 md:pt-4">
        <div className="col-span-2 row-span-2 rounded-l-xl bg-slate-200" />
        <div className="bg-slate-300" />
        <div className="rounded-tr-xl bg-slate-400" />
        <div className="bg-slate-300" />
        <div className="rounded-br-xl bg-slate-200" />
      </div>

      <main className="container mx-auto grid gap-8 px-4 py-8 md:grid-cols-[1fr_350px] lg:px-8">
        
        {/* --- LEFT COLUMN: DETAILS --- */}
        <div className="space-y-8">
          
          {/* Header & AI Match Banner */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-semibold text-foreground flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-amber-500 text-amber-500" />
                  {property.rating}
                </span>
                <span>·</span>
                <span className="underline">{property.reviews} reviews</span>
                <span>·</span>
                <span className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {property.location}
                </span>
              </div>
            </div>

            {/* THE "AI EDGE" BANNER */}
            <div className="rounded-xl border bg-primary/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge className="bg-primary text-white hover:bg-primary/90">
                  {property.matchScore}% Match
                </Badge>
                <span className="text-sm font-medium text-primary">Why this fits you:</span>
              </div>
              <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {property.aiInsights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">About this space</h2>
            <p className="leading-relaxed text-muted-foreground">
              {property.description}
            </p>
          </div>

          <Separator />

          {/* Smart Amenities */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Smart Amenities</h2>
            <div className="grid grid-cols-2 gap-4">
              {property.amenities.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: BOOKING CARD --- */}
        <div className="relative">
          <Card className="sticky top-24 shadow-lg border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">${property.price}</span>
                    <span className="text-sm text-muted-foreground line-through">${property.originalPrice}</span>
                    <span className="text-sm text-muted-foreground">/ night</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs font-medium text-green-600">
                    <Zap className="h-3 w-3" />
                    Dynamic Price: Low demand dates selected
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 rounded-md border">
                <div className="border-r p-3">
                  <span className="block text-xs font-medium text-muted-foreground">CHECK-IN</span>
                  <span className="text-sm font-semibold">Oct 14</span>
                </div>
                <div className="p-3">
                  <span className="block text-xs font-medium text-muted-foreground">CHECKOUT</span>
                  <span className="text-sm font-semibold">Oct 19</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="underline">${property.price} x 5 nights</span>
                  <span>${property.price * 5}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="underline">Cleaning fee</span>
                  <span>$60</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="underline">Smart Spaces Service Fee</span>
                  <span>$40</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${property.price * 5 + 60 + 40}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full text-lg h-12 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                Reserve Instantly
              </Button>
            </CardFooter>
            <div className="px-6 pb-4 text-center">
              <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                You won't be charged yet
              </p>
            </div>
          </Card>
        </div>

      </main>
    </div>
  )
}