import Link from "next/link"
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Shield,
  BarChart3,
  MessageSquare,
  Calendar,
  Brain,
  Smartphone,
  Globe,
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description:
        "Get intelligent insights and recommendations to optimize your property performance and maximize revenue.",
      details: [
        "Predictive occupancy rates",
        "Revenue optimization suggestions",
        "Market trend analysis",
        "Performance benchmarking",
      ],
      badge: "Popular",
    },
    {
      icon: TrendingUp,
      title: "Dynamic Pricing",
      description:
        "Maximize revenue with AI-driven pricing strategies that adapt to market conditions and demand patterns.",
      details: [
        "Real-time price adjustments",
        "Seasonal demand forecasting",
        "Competitor price monitoring",
        "Revenue maximization algorithms",
      ],
      badge: "New",
    },
    {
      icon: Users,
      title: "Smart Guest Management",
      description:
        "Automate guest communications, manage bookings, and provide personalized experiences with AI assistance.",
      details: [
        "Automated check-in/check-out",
        "Personalized guest recommendations",
        "24/7 AI chat support",
        "Guest preference tracking",
      ],
    },
    {
      icon: MessageSquare,
      title: "Intelligent Communication",
      description: "AI-powered messaging system that handles guest inquiries and automates routine communications.",
      details: ["Multi-language support", "Automated responses", "Sentiment analysis", "Communication templates"],
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Optimize cleaning, maintenance, and booking schedules with AI-driven coordination.",
      details: [
        "Automated cleaning schedules",
        "Maintenance predictions",
        "Booking optimization",
        "Staff coordination",
      ],
    },
    {
      icon: BarChart3,
      title: "Advanced Reporting",
      description: "Comprehensive analytics and reporting tools to track performance and identify opportunities.",
      details: ["Custom dashboard creation", "Real-time performance metrics", "Financial reporting", "Trend analysis"],
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Enterprise-grade security with compliance monitoring and risk assessment tools.",
      details: ["Data encryption", "Compliance monitoring", "Risk assessment", "Audit trails"],
    },
    {
      icon: Smartphone,
      title: "Mobile Management",
      description: "Full-featured mobile app for managing your properties on the go.",
      details: ["iOS and Android apps", "Offline functionality", "Push notifications", "Mobile-optimized interface"],
    },
    {
      icon: Globe,
      title: "Multi-Platform Integration",
      description: "Seamlessly integrate with popular booking platforms and property management tools.",
      details: ["Airbnb integration", "Booking.com sync", "Channel manager support", "API connectivity"],
    },
  ]

  return (
    <>
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/features" className="text-sm font-medium text-primary">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
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

      <main>
        {/* Hero Section */}
        <section className="container py-16">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Powerful Features for Modern Property Management
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how Smart Spaces AI revolutionizes property management with cutting-edge artificial intelligence
              and automation tools.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container pb-24">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="relative">
                {feature.badge && (
                  <Badge
                    className="absolute -top-2 -right-2 z-10"
                    variant={feature.badge === "Popular" ? "default" : "secondary"}
                  >
                    {feature.badge}
                  </Badge>
                )}
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Integration Section */}
        <section className="bg-muted/50 py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Seamless Integrations</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Connect with your favorite tools and platforms for a unified property management experience.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Airbnb", description: "Sync listings and bookings" },
                { name: "Booking.com", description: "Manage reservations" },
                { name: "Stripe", description: "Process payments" },
                { name: "Slack", description: "Team notifications" },
                { name: "Google Calendar", description: "Schedule management" },
                { name: "Zapier", description: "Workflow automation" },
                { name: "QuickBooks", description: "Financial tracking" },
                { name: "Mailchimp", description: "Guest communications" },
              ].map((integration, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <div className="h-6 w-6 rounded bg-primary/20" />
                    </div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Ready to Experience These Features?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your free trial today and see how Smart Spaces AI can transform your property management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/get-started">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
