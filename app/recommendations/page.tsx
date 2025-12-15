import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Wifi, Zap, ArrowLeft, Check, Heart } from "lucide-react"

export default function RecommendationsPage() {
  // Mock Data: In a real app, this comes from your Matching Engine API
  const recommendations = [
    {
      id: "1",
      title: "The Quiet Loft | Dedicated Workspace",
      location: "Downtown Art District",
      price: 145,
      rating: 4.92,
      reviews: 128,
      matchScore: 98,
      tags: ["Verified WiFi (400Mbps)", "Ergonomic Chair", "Soundproof"],
      imageColor: "bg-slate-200", // Placeholder for real image
      deal: "Price drops 15% next week"
    },
    {
      id: "2",
      title: "Zen Garden Studio",
      location: "North Hills",
      price: 120,
      rating: 4.85,
      reviews: 84,
      matchScore: 94,
      tags: ["Nature View", "Standing Desk", "Espresso Machine"],
      imageColor: "bg-stone-200",
      deal: null
    },
    {
      id: "3",
      title: "Executive Skyline Suite",
      location: "Financial District",
      price: 210,
      rating: 5.0,
      reviews: 42,
      matchScore: 88,
      tags: ["Meeting Room Access", "Gym", "Concierge"],
      imageColor: "bg-blue-100",
      deal: null
    }
  ]

  return (
    <div className="min-h-screen bg-muted/40 pb-12">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link 
            href="/complete-profile" 
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Refine Criteria
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Smart Spaces AI</span>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Top 3 Matches for &quot;Remote Work&quot;</h1>
          <p className="text-muted-foreground">
            AI analyzed 42 properties and found these fit your workflow best.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((stay) => (
            <Card key={stay.id} className="overflow-hidden transition-all hover:ring-2 hover:ring-primary/20">
              
              {/* IMAGE AREA (Placeholder) */}
              <div className={`relative h-48 w-full ${stay.imageColor} flex items-center justify-center text-muted-foreground/50`}>
                <span className="text-sm font-medium">Property Image</span>
                
                {/* MATCH SCORE BADGE */}
                <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-sm dark:bg-slate-900">
                  <SparklesIcon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm font-bold text-primary">{stay.matchScore}% Match</span>
                </div>

                <Button variant="ghost" size="icon" className="absolute top-4 left-4 h-8 w-8 rounded-full bg-white/50 text-slate-900 hover:bg-white hover:text-red-500">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold leading-none tracking-tight">{stay.title}</h3>
                    <div className="mt-1 flex items-center text-xs text-muted-foreground">
                      <MapPin className="mr-1 h-3 w-3" />
                      {stay.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    {stay.rating}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-2">
                {/* AI REASONING TAGS */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {stay.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="font-normal text-xs">
                      <Check className="mr-1 h-3 w-3 text-primary" /> {tag}
                    </Badge>
                  ))}
                </div>

                {/* DYNAMIC PRICING ALERT */}
                {stay.deal ? (
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium text-green-600 dark:text-green-400">
                    <Zap className="h-3 w-3" />
                    {stay.deal}
                  </div>
                ) : (
                  <div className="mb-2 h-4" /> // Spacer
                )}

                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-lg font-bold">${stay.price}</span>
                    <span className="text-sm text-muted-foreground"> / night</span>
                  </div>
                  <p className="text-xs text-muted-foreground underline decoration-dotted">
                    Total: ${stay.price * 5 + 80}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button className="w-full" asChild>
                  <Link href={`/property/${stay.id}`}>
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  )
}