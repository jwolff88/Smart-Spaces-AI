import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Users, Target, Heart, Zap, Globe, Award } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold">Anacra</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <Award className="h-4 w-4" />
              Admin
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/get-started">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">About Anacra</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Revolutionizing property management through artificial intelligence, one space at a time.
          </p>
        </section>

        {/* Founder Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Founder</h2>
            <p className="text-lg text-muted-foreground">The visionary behind Anacra</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Image
                      src="/jason-wolff.png"
                      alt="Jason Wolff, Founder & CEO of Anacra"
                      width={256}
                      height={256}
                      className="rounded-full object-cover border-4 border-gradient-to-r from-primary to-primary/50"
                    />
                    <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                      Founder & CEO
                    </Badge>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">Jason Wolff</h3>
                  <p className="text-lg text-muted-foreground mb-4">Founder & CEO</p>
                  <p className="text-base leading-relaxed mb-6">
                    Jason Wolff is a visionary entrepreneur and technology leader with over 5 years of experience in
                    artificial intelligence, 1 year in real estate technology, and 3 years in business innovation.
                    Before founding Anacra, Jason worked 10+ years for property management owners, learning the ins and
                    outs of the system.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <span className="text-sm">Innovation Leader</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      <span className="text-sm">Pioneered AI-driven solutions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <span className="text-sm">Industry Recognition</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      <span className="text-sm">Passionate about technology</span>
                    </div>
                  </div>
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                    "I founded Anacra because I believe technology should empower, not complicate. Our mission is to
                    give every property manager the tools they need to succeed in an increasingly competitive market."
                  </blockquote>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Company Story */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-lg text-muted-foreground">How Anacra came to be</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  The Problem I Saw
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  After working 10+ years in property management, I witnessed firsthand the inefficiencies, manual
                  processes, and missed opportunities that plague the industry. Property managers were drowning in
                  administrative tasks, struggling with pricing optimization, and lacking the insights needed to
                  maximize their potential.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  The Solution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  I envisioned a platform that would harness the power of artificial intelligence to automate routine
                  tasks, provide intelligent insights, and empower property managers to focus on what matters most -
                  creating exceptional experiences for their guests and maximizing their revenue potential.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  Building Anacra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  In April 2025, I built Anacra with a clear mission: to democratize access to advanced property
                  management tools. I combined my deep industry knowledge with cutting-edge AI technology to create a
                  platform that's both powerful and intuitive, designed by someone who truly understands the challenges
                  property managers face every day.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Vision Forward */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Looking Forward</h2>
            <p className="text-lg text-muted-foreground">Our vision for the future</p>
          </div>

          <Card className="p-8 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="text-center">
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Looking forward to enhance 100K+ users and hosts</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Soon our plans for Anacra will be to serve thousands of property managers worldwide, helping them unlock
                their full potential through the power of artificial intelligence. We're committed to continuous
                innovation, expanding our AI capabilities, and building the most comprehensive property management
                platform in the industry.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="text-sm">
                  Global Expansion
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  Advanced AI Features
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  Industry Leadership
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  Customer Success
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Values */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">What drives us every day</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Innovation First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We're constantly pushing the boundaries of what's possible with AI in property management, always
                  staying ahead of the curve.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Customer Success</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our customers' success is our success. We're committed to providing exceptional support and
                  continuously improving our platform.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <Target className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Results Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We focus on delivering measurable impact and ROI for our users, ensuring every feature adds real
                  value.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <Heart className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Human-Centered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our AI enhances human capabilities rather than replacing them, keeping the human touch at the center
                  of hospitality.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <Globe className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Global Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We're building solutions that work across cultures and markets, making property management better
                  worldwide.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <Award className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We maintain the highest standards in everything we do, from our technology to our customer service.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="p-8 bg-primary text-primary-foreground">
            <CardContent>
              <h2 className="text-3xl font-bold mb-4">Ready to Join Our Journey?</h2>
              <p className="text-lg mb-6 opacity-90">Experience the future of property management with Anacra</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/get-started">Start Free Trial</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                  asChild
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  )
}
