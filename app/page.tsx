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
        DESIGN PHILOSOPHY: Holographic Iridescent Fluid
        - Pure black background
        - Multi-color fluid gradient orbs
        - Iridescent text and glows
        - Chrome/liquid effects
      */}
      <div className="min-h-screen bg-background relative overflow-hidden bg-holo-shimmer">
        {/* Fluid gradient orbs - like the reference images */}
        <div className="orb-purple w-[600px] h-[600px] top-[-200px] left-[-100px] opacity-60" />
        <div className="orb-pink w-[500px] h-[500px] top-[100px] right-[-150px] opacity-50" />
        <div className="orb-cyan w-[400px] h-[400px] bottom-[200px] left-[10%] opacity-40" />
        <div className="orb-orange w-[350px] h-[350px] bottom-[-100px] right-[20%] opacity-50" />
        <div className="orb-green w-[300px] h-[300px] top-[40%] right-[5%] opacity-40" />

        {/* Navigation */}
        <header className="fixed top-0 left-0 right-0 z-50 glass-dark">
          <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-wider text-foreground">
              <span className="text-holo">SMART SPACES</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login?role=traveler">
                <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                  Traveler
                </Button>
              </Link>
              <Link href="/login?role=host">
                <Button variant="ghost" size="sm" className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10">
                  Host
                </Button>
              </Link>
              <Link href="/login?mode=register">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 glow-holo transition-all duration-300">
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
              <p className="text-sm uppercase tracking-[0.3em] text-purple-400 mb-6">
                The Future of Travel
              </p>

              {/* Primary headline with holographic gradient */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 text-balance leading-tight">
                Find Spaces That
                <span className="text-holo"> Understand</span> You
              </h1>

              {/* Supporting text */}
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
                AI-powered matching connects you with perfect stays.
                Tell us how you travel. We&apos;ll find where you belong.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link href="/login?mode=register">
                  <Button
                    size="lg"
                    className="h-14 px-10 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white text-base font-semibold border-0 glow-holo-intense hover:scale-105 transition-all duration-300 group"
                  >
                    Start Exploring
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login?role=host">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-10 border-pink-500/50 text-pink-400 hover:bg-pink-500/10 hover:border-pink-400 text-base font-semibold transition-all duration-300"
                  >
                    List Your Property
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Value Props */}
          <section className="py-24 px-6 relative">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* For Travelers */}
                <div className="glass-purple rounded-2xl p-8 hover:glow-purple transition-all duration-500 group">
                  <p className="text-sm uppercase tracking-[0.2em] text-purple-400 mb-4">
                    For Travelers
                  </p>
                  <h2 className="text-2xl font-bold text-foreground mb-6 group-hover:text-glow-purple transition-all">
                    Beyond Filters
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
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
                <div className="glass-pink rounded-2xl p-8 hover:glow-pink transition-all duration-500 group">
                  <p className="text-sm uppercase tracking-[0.2em] text-pink-400 mb-4">
                    For Hosts
                  </p>
                  <h2 className="text-2xl font-bold text-foreground mb-6 group-hover:text-glow-pink transition-all">
                    Smart Listings
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
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
          <section className="py-24 px-6 relative">
            <div className="absolute inset-0 bg-holo opacity-30" />
            <div className="max-w-3xl mx-auto text-center relative">
              <p className="text-2xl md:text-3xl text-foreground/90 leading-relaxed font-light">
                &ldquo;We built Smart Spaces because vacation rental platforms forgot
                what matters: matching people with places that feel like
                <span className="text-holo-static font-medium"> home</span>.&rdquo;
              </p>
              <p className="mt-8 text-sm text-purple-400 tracking-wider">
                Jason Wolff, Founder
              </p>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <p className="text-4xl md:text-5xl font-bold text-purple-400 text-glow-purple">98%</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Match Rate</p>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl md:text-5xl font-bold text-pink-400 text-glow-pink">2min</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Listing Time</p>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl md:text-5xl font-bold text-cyan-400 text-glow-cyan">24/7</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">AI Support</p>
                </div>
              </div>
            </div>
          </section>

          {/* Feedback Section */}
          <section className="py-24 px-6">
            <div className="max-w-xl mx-auto">
              <FeedbackBox />
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-12 px-6 glass-dark">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 <span className="text-holo-static">Smart Spaces</span>
            </p>
            <div className="flex gap-6">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">
                Sign in
              </Link>
              <Link href="/login?role=host" className="text-sm text-muted-foreground hover:text-pink-400 transition-colors">
                List property
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
