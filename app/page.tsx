import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Metadata } from "next"
import { FeedbackBox } from "@/components/FeedbackBox"

export const metadata: Metadata = {
  title: "Smart Spaces | AI-Powered Vacation Rentals",
  description: "Where Smart Travel Meets Smart Hosting. Find your perfect stay with AI-powered matching, smart pricing, and seamless booking.",
}

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://smart-spaces-ai.vercel.app"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Smart Spaces",
  description: "AI-Powered Vacation Rental Platform",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: "English",
  },
}

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/*
        DESIGN PHILOSOPHY: Neon Futuristic Holographic
        - Deep dark background with cyan grid
        - Electric neon accents (cyan, magenta, lime)
        - Glowing effects on interactive elements
        - Holographic gradient text
        - Glass morphism cards
      */}
      <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
        {/* Ambient glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

        {/* Navigation */}
        <header className="fixed top-0 left-0 right-0 z-50 glass-neon">
          <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-wider text-foreground text-glow-cyan">
              SMART SPACES
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login?role=traveler">
                <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/10 hover:glow-cyan transition-all">
                  Traveler
                </Button>
              </Link>
              <Link href="/login?role=host">
                <Button variant="outline" size="sm" className="border-secondary/50 text-secondary hover:bg-secondary/10 hover:glow-magenta transition-all">
                  Host
                </Button>
              </Link>
              <Link href="/login?mode=register">
                <Button size="sm" className="bg-primary hover:bg-primary/80 text-primary-foreground glow-cyan hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] transition-all">
                  Sign Up
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main>
          <section className="pt-32 pb-24 px-6 relative">
            <div className="max-w-4xl mx-auto text-center">
              {/* Overline */}
              <p className="text-overline uppercase text-primary mb-6 tracking-widest text-glow-cyan">
                The Future of Travel
              </p>

              {/* Primary headline with gradient */}
              <h1 className="text-display text-foreground mb-8 text-balance">
                Find Spaces That
                <span className="text-gradient-cyan-magenta"> Understand</span> You
              </h1>

              {/* Supporting text */}
              <p className="text-body-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
                AI-powered matching connects you with perfect stays.
                Tell us how you travel. We&apos;ll find where you belong.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link href="/login?mode=register">
                  <Button
                    size="lg"
                    className="h-14 px-10 bg-primary hover:bg-primary/80 text-primary-foreground text-base font-semibold tracking-wide glow-cyan hover:shadow-[0_0_40px_rgba(0,255,255,0.7)] transition-all duration-300 group"
                  >
                    Start Exploring
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login?role=host">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-10 border-secondary/50 text-secondary hover:bg-secondary/10 text-base font-semibold tracking-wide hover:glow-magenta transition-all duration-300"
                  >
                    List Your Property
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Value Props */}
          <section className="py-24 px-6 border-t border-border/50">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* For Travelers */}
                <div className="glass-neon rounded-lg p-8 hover:glow-cyan transition-all duration-300">
                  <p className="text-overline uppercase text-primary mb-4 tracking-widest">
                    For Travelers
                  </p>
                  <h2 className="text-title text-foreground mb-6 text-glow-cyan">
                    Beyond Filters
                  </h2>
                  <div className="space-y-4 text-body text-muted-foreground">
                    <p>
                      Describe your trip: working remotely, traveling with family,
                      seeking adventure. Our AI shows you match scores that matter.
                    </p>
                    <p>
                      No more endless scrolling. Every recommendation is intentional.
                    </p>
                  </div>
                </div>

                {/* For Hosts */}
                <div className="glass-magenta rounded-lg p-8 hover:glow-magenta transition-all duration-300">
                  <p className="text-overline uppercase text-secondary mb-4 tracking-widest">
                    For Hosts
                  </p>
                  <h2 className="text-title text-foreground mb-6 text-glow-magenta">
                    Smart Listings
                  </h2>
                  <div className="space-y-4 text-body text-muted-foreground">
                    <p>
                      Enter your address. Our AI writes the listing: title, description,
                      pricing strategy. Hours of work in minutes.
                    </p>
                    <p>
                      Smart pricing adjusts to demand. Better guests find you first.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Brand Statement */}
          <section className="py-24 px-6 bg-holographic relative">
            <div className="absolute inset-0 bg-background/80" />
            <div className="max-w-3xl mx-auto text-center relative">
              <p className="text-headline text-foreground/90 leading-relaxed text-balance">
                &ldquo;We built Smart Spaces because vacation rental platforms forgot
                what matters: matching people with places that feel like
                <span className="text-gradient-cyan-magenta"> home</span>.&rdquo;
              </p>
              <p className="mt-8 text-caption text-primary text-glow-cyan">
                Jason Wolff, Founder
              </p>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-24 px-6 border-t border-border/50">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <p className="text-display text-primary text-glow-cyan">98%</p>
                  <p className="text-caption text-muted-foreground uppercase tracking-wider">Match Rate</p>
                </div>
                <div className="space-y-2">
                  <p className="text-display text-secondary text-glow-magenta">2min</p>
                  <p className="text-caption text-muted-foreground uppercase tracking-wider">Avg Listing Time</p>
                </div>
                <div className="space-y-2">
                  <p className="text-display text-accent text-glow-lime">24/7</p>
                  <p className="text-caption text-muted-foreground uppercase tracking-wider">AI Support</p>
                </div>
              </div>
            </div>
          </section>

          {/* Feedback Section */}
          <section className="py-24 px-6 border-t border-border/50">
            <div className="max-w-xl mx-auto">
              <FeedbackBox />
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-border/50 glass-neon">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 <span className="text-primary">Smart Spaces</span>
            </p>
            <div className="flex gap-6">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Sign in
              </Link>
              <Link href="/login?role=host" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                List property
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
