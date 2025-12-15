import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Globe, TrendingUp, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      
      {/* --- HERO SECTION --- */}
      <section className="relative py-24 bg-muted/30">
        <div className="container px-4 text-center md:px-6">
          <Badge variant="secondary" className="mb-4">Our Mission</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            We are building the <br />
            <span className="text-primary">Intelligent Rental Infrastructure</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Travel behavior has evolved. Legacy platforms haven&apos;t. 
            We exist to replace manual spreadsheets and static filters with automation and predictive intelligence.
          </p>
        </div>
      </section>

      {/* --- THE PROBLEM & SOLUTION --- */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Why Smart Spaces AI?</h2>
              <p className="text-lg text-muted-foreground">
                For decades, the vacation rental market has relied on two things: static listing directories and manual host labor.
              </p>
              <div className="grid gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">The Problem</h3>
                        <p className="text-sm text-muted-foreground">Hosts are overwhelmed by operational chaos, and guests are tired of scrolling through irrelevant options.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">The Solution</h3>
                        <p className="text-sm text-muted-foreground">An AI-first ecosystem that predicts maintenance needs, automates pricing, and matches guests by intent.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-200 shadow-xl">
               {/* Placeholder for Team/Office Image */}
               <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-medium">
                 [Image: Team working on AI Models]
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- METRICS / IMPACT --- */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <div className="text-4xl font-bold">10k+</div>
              <div className="mt-2 text-sm opacity-80">Bookings Automated</div>
            </div>
            <div>
              <div className="text-4xl font-bold">98%</div>
              <div className="mt-2 text-sm opacity-80">Match Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold">30%</div>
              <div className="mt-2 text-sm opacity-80">Avg. Host Revenue Lift</div>
            </div>
            <div>
              <div className="text-4xl font-bold">24/7</div>
              <div className="mt-2 text-sm opacity-80">AI Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TEAM SECTION --- */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Meet the Builders</h2>
            <p className="mt-4 text-muted-foreground">
              A team of engineers, data scientists, and real estate experts.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 max-w-5xl mx-auto">
            
            {/* Founder 1 */}
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">Jane Doe</h3>
              <p className="text-sm text-primary font-medium">CEO & Co-Founder</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Ex-Airbnb Product Lead. Passionate about democratizing hospitality tech.
              </p>
            </div>

            {/* Founder 2 */}
            <div className="flex flex-col items-center text-center">
               <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">John Smith</h3>
              <p className="text-sm text-primary font-medium">CTO & Architect</p>
              <p className="mt-2 text-sm text-muted-foreground">
                AI Researcher specializing in predictive models and dynamic systems.
              </p>
            </div>

            {/* Founder 3 */}
            <div className="flex flex-col items-center text-center">
               <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">Alex Lee</h3>
              <p className="text-sm text-primary font-medium">Head of Growth</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Real estate investor helping hosts scale from 1 to 100 units.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="border-t py-12 text-center">
        <div className="container px-4">
          <h2 className="text-2xl font-bold">Ready to modernize your experience?</h2>
          <div className="mt-6 flex justify-center gap-4">
             <Button asChild>
              <Link href="/get-started">Join the Platform</Link>
             </Button>
             <Button variant="outline" asChild>
              <Link href="/features">View Features</Link>
             </Button>
          </div>
        </div>
      </section>

    </div>
  )
}