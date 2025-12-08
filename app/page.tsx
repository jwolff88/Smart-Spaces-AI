import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, MapPin, Sparkles, Zap } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* --- HERO SECTION --- */}
      <section className="relative flex flex-col items-center justify-center px-4 py-24 text-center md:py-32 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
        <div className="absolute top-0 z-[-1] h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        
        <div className="mb-6 inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm">
          <Sparkles className="mr-2 h-4 w-4 text-primary" />
          <span>The Future of Rental Infrastructure</span>
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block">Intelligent Stays.</span>
          <span className="block text-primary">Smarter Hosting.</span>
        </h1>
        
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Smart Spaces AI replaces outdated filters with predictive matching—helping travelers find the perfect stay and hosts automate their business.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="h-12 px-8 text-base">
            <Link href="/get-started?role=traveler">
              Find a Stay <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
            <Link href="/get-started?role=host">
              Become a Host
            </Link>
          </Button>
        </div>
      </section>

      {/* --- VALUE PROPOSITION GRID --- */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          
          {/* Traveler Card */}
          <div className="rounded-3xl border bg-card p-8 shadow-sm transition-all hover:shadow-md md:p-12">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-6 w-6" />
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight">For Travelers</h2>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2 mt-1 rounded-full bg-primary h-1.5 w-1.5 shrink-0" />
                AI-Powered Matching: No more scrolling. We match you based on intent and behavior.
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 rounded-full bg-primary h-1.5 w-1.5 shrink-0" />
                Dynamic Pricing: Real-time fair rates based on actual market demand.
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 rounded-full bg-primary h-1.5 w-1.5 shrink-0" />
                Seamless Booking: Mobile-first checkout with smart notifications.
              </li>
            </ul>
            <div className="mt-8">
              <Button asChild variant="link" className="px-0">
                <Link href="/features/travelers">Learn more about traveling &rarr;</Link>
              </Button>
            </div>
          </div>

          {/* Host Card */}
          <div className="rounded-3xl border bg-card p-8 shadow-sm transition-all hover:shadow-md md:p-12">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight">For Hosts</h2>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2 mt-1 rounded-full bg-primary h-1.5 w-1.5 shrink-0" />
                Unified Dashboard: Manage listings, messages, and pricing in one place.
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 rounded-full bg-primary h-1.5 w-1.5 shrink-0" />
                Predictive Maintenance: AI alerts you to issues before they become costly.
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 rounded-full bg-primary h-1.5 w-1.5 shrink-0" />
                Automated Operations: Messaging and workflows on autopilot.
              </li>
            </ul>
            <div className="mt-8">
              <Button asChild variant="link" className="px-0">
                <Link href="/features/hosts">Explore host tools &rarr;</Link>
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* --- BOTTOM CTA --- */}
      <section className="border-t bg-muted/40 py-24 text-center">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex justify-center">
              <Zap className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to upgrade your experience?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join the platform that is reinventing rental infrastructure with intelligence.
            </p>
            <Button asChild size="lg" className="px-8">
              <Link href="/signin">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}