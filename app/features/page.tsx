import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Zap, Brain, ShieldCheck, ArrowRight } from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-slate-900 py-24 text-white sm:py-32">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-6 border-white/20 bg-white/10 text-white hover:bg-white/20">
            Beyond Legacy Platforms
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Built on Intelligence, <br />
            <span className="text-primary-foreground text-blue-400">Not Just Listings.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Traditional platforms (Airbnb, Vrbo) are static catalogs. Smart Spaces AI is a predictive infrastructure layer that automates operations and matches guests by intent.
          </p>
        </div>
      </section>

      {/* --- COMPARISON TABLE (THE "PITCH") --- */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold">Why We Are Different</h2>
            
            <div className="overflow-hidden rounded-xl border bg-background shadow-lg">
              <div className="grid grid-cols-3 border-b bg-muted/50 p-4 text-sm font-medium text-muted-foreground">
                <div className="col-span-1">Feature</div>
                <div className="col-span-1 text-center text-slate-500">Legacy Platforms</div>
                <div className="col-span-1 text-center font-bold text-primary">Smart Spaces AI</div>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-3 border-b p-6 hover:bg-muted/10 transition-colors">
                <div className="col-span-1 flex items-center gap-3 font-medium">
                  <Brain className="h-5 w-5 text-purple-500" />
                  Traveler Matching
                </div>
                <div className="col-span-1 flex flex-col items-center justify-center gap-1 text-center text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><XCircle className="h-4 w-4 text-red-400" /> Manual Filtering</span>
                  <span className="text-xs">User scrolls endlessly</span>
                </div>
                <div className="col-span-1 flex flex-col items-center justify-center gap-1 text-center text-sm font-medium">
                  <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="h-4 w-4" /> AI Intent Analysis</span>
                  <span className="text-xs text-muted-foreground">Matches by "Remote Work", "Vibe"</span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-3 border-b p-6 hover:bg-muted/10 transition-colors">
                <div className="col-span-1 flex items-center gap-3 font-medium">
                  <Zap className="h-5 w-5 text-amber-500" />
                  Pricing Engine
                </div>
                <div className="col-span-1 flex flex-col items-center justify-center gap-1 text-center text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><XCircle className="h-4 w-4 text-red-400" /> Static / Manual</span>
                  <span className="text-xs">Host sets arbitrary rates</span>
                </div>
                <div className="col-span-1 flex flex-col items-center justify-center gap-1 text-center text-sm font-medium">
                  <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="h-4 w-4" /> Real-Time Dynamic</span>
                  <span className="text-xs text-muted-foreground">Updates based on demand events</span>
                </div>
              </div>

               {/* Row 3 */}
              <div className="grid grid-cols-3 border-b p-6 hover:bg-muted/10 transition-colors">
                <div className="col-span-1 flex items-center gap-3 font-medium">
                  <ShieldCheck className="h-5 w-5 text-blue-500" />
                  Maintenance
                </div>
                <div className="col-span-1 flex flex-col items-center justify-center gap-1 text-center text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><XCircle className="h-4 w-4 text-red-400" /> Reactive</span>
                  <span className="text-xs">Fix it when it breaks</span>
                </div>
                <div className="col-span-1 flex flex-col items-center justify-center gap-1 text-center text-sm font-medium">
                  <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="h-4 w-4" /> Predictive AI</span>
                  <span className="text-xs text-muted-foreground">Sensors alert before failure</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* --- DEEP DIVE SECTIONS --- */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          
          <div className="mb-24 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center rounded-full border bg-muted px-3 py-1 text-sm font-medium">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                For Hosts
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Unified Operations Dashboard</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Stop toggling between spreadsheets, calendars, and messaging apps. 
                Our unified dashboard handles listings, pricing, and maintenance in one view.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span><strong>AI Smart Replies:</strong> Drafts responses to common guest questions instantly.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span><strong>Multi-Channel Sync:</strong> Updates availability across Airbnb, Vrbo, and Booking.com.</span>
                </li>
              </ul>
              <Button asChild className="mt-8">
                <Link href="/host-dashboard">
                  See the Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl border bg-slate-100 dark:bg-slate-800 shadow-2xl lg:aspect-video">
               {/* Visual Placeholder for Dashboard UI */}
               <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                 [Interactive Dashboard Preview]
               </div>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 relative aspect-square overflow-hidden rounded-xl border bg-slate-100 dark:bg-slate-800 shadow-2xl lg:aspect-video">
               {/* Visual Placeholder for Mobile App UI */}
               <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                 [Mobile Booking Flow Preview]
               </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="mb-4 inline-flex items-center rounded-full border bg-muted px-3 py-1 text-sm font-medium">
                <span className="flex h-2 w-2 rounded-full bg-purple-500 mr-2"></span>
                For Travelers
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Search by Intent, Not Filters</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Legacy filters (price, location) don't tell the whole story. 
                Our AI understands context—finding you "quiet places for deep work" or "social hubs for networking."
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span><strong>Match Scores:</strong> We give every home a % score based on your unique profile.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span><strong>Verified Vibe:</strong> AI analyzes review sentiment to verify WiFi speeds, noise levels, and safety.</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="mt-8">
                <Link href="/get-started">
                  Find Your Match
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* --- CTA --- */}
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to join the future of rental?</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg opacity-90">
            Join thousands of hosts and travelers switching to the intelligent infrastructure.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/get-started?role=host">Start Hosting</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link href="/get-started?role=traveler">Plan a Trip</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}