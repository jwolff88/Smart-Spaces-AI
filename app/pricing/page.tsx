import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Sparkles, Building2, Zap } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      
      {/* --- HEADER --- */}
      <header className="flex h-16 items-center justify-between border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Sparkles className="h-5 w-5 text-primary" />
          Smart Spaces AI
        </Link>
        <nav className="hidden gap-6 md:flex">
          <Link href="/about" className="text-sm font-medium hover:text-primary">About</Link>
          <Link href="/features" className="text-sm font-medium hover:text-primary">Features</Link>
          <Link href="/pricing" className="text-sm font-medium text-primary">Pricing</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/signin" className="text-sm font-medium hover:underline">Sign In</Link>
          <Button asChild>
            <Link href="/get-started">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <Badge variant="outline" className="border-primary text-primary">Monetization Model</Badge>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Start for free, upgrade for AI superpowers. 
              We make money when you make money.
            </p>
          </div>

          <div className="grid gap-6 pt-12 lg:grid-cols-3 lg:gap-8 max-w-6xl mx-auto">
            
            {/* --- STARTER PLAN --- */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">Host Starter</CardTitle>
                <CardDescription>Perfect for new hosts with 1-2 properties.</CardDescription>
                <div className="mt-4 text-4xl font-bold">$0 <span className="text-base font-normal text-muted-foreground">/mo</span></div>
                <div className="text-sm font-medium text-muted-foreground">3% fee per booking</div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="grid gap-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> Multi-channel syncing
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> Unified Inbox
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> Basic Calendar
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <X className="h-4 w-4" /> AI Smart Pricing
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <X className="h-4 w-4" /> Predictive Maintenance
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/get-started?role=host">Start for Free</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* --- PRO PLAN (HERO) --- */}
            <Card className="flex flex-col relative border-primary shadow-lg scale-105 bg-primary/5">
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <Badge className="bg-primary hover:bg-primary">Most Popular</Badge>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2">
                   <CardTitle className="text-xl text-primary">AI Professional</CardTitle>
                   <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <CardDescription>For serious hosts scaling their portfolio.</CardDescription>
                <div className="mt-4 text-4xl font-bold">$29 <span className="text-base font-normal text-muted-foreground">/mo</span></div>
                <div className="text-sm font-medium text-muted-foreground">1% fee per booking</div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="grid gap-3 text-sm">
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="h-4 w-4 text-primary" /> All Starter features
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500 fill-amber-500" /> 
                    <span><strong>AI Dynamic Pricing</strong> (Auto-adjust)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> Automated Guest Messages
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> Predictive Maintenance Alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> Priority Support
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/get-started?role=host&plan=pro">Get AI Pro</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* --- ENTERPRISE PLAN --- */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">Enterprise</CardTitle>
                <CardDescription>For property managers with 20+ units.</CardDescription>
                <div className="mt-4 text-4xl font-bold">Custom</div>
                <div className="text-sm font-medium text-muted-foreground">Volume discounts</div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="grid gap-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> Dedicated API Access
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> Custom AI Models
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> IoT Hub Integration
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> White-label Dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> 24/7 Phone Support
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Contact Sales</Button>
              </CardFooter>
            </Card>

          </div>

          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Travelers always book for free.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We never charge guests service fees. Our revenue comes from helping hosts run better, more efficient businesses using AI.
            </p>
          </div>

        </div>
      </main>
    </div>
  )
}