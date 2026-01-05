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

// Organization structured data
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
        DESIGN PHILOSOPHY: Architectural Calm
        - Light, warm palette replacing dark gradients
        - Editorial layout with asymmetric flow
        - Typography carries hierarchy
        - White space is a feature
        - One clear action, not competing CTAs
      */}
      <div className="min-h-screen bg-background">

        {/* Navigation - Minimal, typography-led */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
          <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-medium tracking-tight text-foreground">
              Smart Spaces
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login?role=traveler">
                <Button variant="outline" size="sm">
                  Traveler
                </Button>
              </Link>
              <Link href="/login?role=host">
                <Button variant="outline" size="sm">
                  Host
                </Button>
              </Link>
              <Link href="/login?mode=register">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Sign Up
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section - Editorial, breathing room */}
        <main>
          <section className="pt-32 pb-24 px-6">
            <div className="max-w-4xl mx-auto">
              {/* Overline - subtle context */}
              <p className="text-overline uppercase text-muted-foreground mb-6 tracking-widest">
                Vacation rentals, reimagined
              </p>

              {/* Primary headline - typography carries weight */}
              <h1 className="text-display text-foreground mb-8 max-w-3xl text-balance">
                Find spaces that
                <span className="text-primary"> understand</span> how you travel
              </h1>

              {/* Supporting text - restrained, not overselling */}
              <p className="text-body-lg text-muted-foreground max-w-xl mb-12 leading-relaxed">
                Tell us what matters to you. Our AI matches you with homes that fit
                your style, your work, your way of being away.
              </p>

              {/* Single clear CTA - no competing buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Link href="/login?mode=register">
                  <Button
                    size="lg"
                    className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-medium transition-all duration-200 group"
                  >
                    Start exploring
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link
                  href="/login?role=host"
                  className="h-12 px-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  I want to list my property
                </Link>
              </div>
            </div>
          </section>

          {/* Value Props - Not cards, editorial flow */}
          <section className="py-24 px-6 border-t border-border">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-16">
                {/* For Travelers */}
                <div>
                  <p className="text-overline uppercase text-muted-foreground mb-4 tracking-widest">
                    For travelers
                  </p>
                  <h2 className="text-title text-foreground mb-6">
                    Beyond filters. Beyond guesswork.
                  </h2>
                  <div className="space-y-6 text-body text-muted-foreground">
                    <p>
                      Describe your trip: working remotely, traveling with kids,
                      celebrating an anniversary. We show you match scores that
                      actually mean something.
                    </p>
                    <p>
                      No more scrolling through hundreds of listings hoping one
                      might work. Every recommendation is intentional.
                    </p>
                  </div>
                </div>

                {/* For Hosts */}
                <div>
                  <p className="text-overline uppercase text-muted-foreground mb-4 tracking-widest">
                    For hosts
                  </p>
                  <h2 className="text-title text-foreground mb-6">
                    Your property. Presented properly.
                  </h2>
                  <div className="space-y-6 text-body text-muted-foreground">
                    <p>
                      Enter your address. Our AI writes the listing: title, description,
                      pricing strategy. What takes hours now takes minutes.
                    </p>
                    <p>
                      Smart pricing adjusts to demand. Better guests find you because
                      the right travelers see you first.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Brand Statement - Quiet confidence */}
          <section className="py-24 px-6 bg-secondary/30">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-headline text-foreground/80 leading-relaxed text-balance">
                "We built Smart Spaces because vacation rental platforms forgot
                what matters: matching people with places that feel like somewhere
                they want to be."
              </p>
              <p className="mt-8 text-caption text-muted-foreground">
                Jason Wolff, Founder
              </p>
            </div>
          </section>

          {/* Feedback Section */}
          <section className="py-24 px-6 border-t border-border">
            <div className="max-w-xl mx-auto">
              <FeedbackBox />
            </div>
          </section>
        </main>

        {/* Footer - Minimal */}
        <footer className="py-12 px-6 border-t border-border">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Smart Spaces
            </p>
            <div className="flex gap-6">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign in
              </Link>
              <Link href="/login?role=host" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                List your property
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
