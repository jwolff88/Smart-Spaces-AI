"use client"

import Link from "next/link"
import { ArrowLeft, Check, Star } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individual hosts getting started",
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        "Up to 3 properties",
        "Basic AI insights",
        "Email support",
        "Mobile app access",
        "Basic reporting",
        "Guest communication tools",
      ],
      limitations: ["Limited integrations", "Basic analytics only"],
    },
    {
      name: "Professional",
      description: "Most popular for growing property businesses",
      monthlyPrice: 79,
      annualPrice: 790,
      popular: true,
      features: [
        "Up to 15 properties",
        "Advanced AI features",
        "Priority support",
        "All integrations",
        "Advanced analytics",
        "Dynamic pricing",
        "Automated messaging",
        "Custom reporting",
        "Team collaboration",
      ],
      limitations: [],
    },
    {
      name: "Enterprise",
      description: "For large property portfolios and management companies",
      monthlyPrice: 199,
      annualPrice: 1990,
      features: [
        "Unlimited properties",
        "Custom AI solutions",
        "Dedicated support manager",
        "White-label options",
        "API access",
        "Advanced security",
        "Custom integrations",
        "Priority feature requests",
        "Training & onboarding",
      ],
      limitations: [],
    },
  ]

  const addOns = [
    {
      name: "Additional Properties",
      description: "Add more properties to your plan",
      price: "$5/property/month",
    },
    {
      name: "Premium Support",
      description: "24/7 phone and chat support",
      price: "$49/month",
    },
    {
      name: "Custom Integrations",
      description: "Build custom integrations for your tools",
      price: "Starting at $299/month",
    },
    {
      name: "Advanced Analytics",
      description: "Deep insights and custom reports",
      price: "$29/month",
    },
  ]

  return (
    <>
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Smart Spaces AI" width={40} height={40} className="rounded" />
            <span className="text-xl font-bold">Smart Spaces AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-primary">
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
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your property management needs. All plans include a 14-day free trial.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm ${!isAnnual ? "font-medium" : "text-muted-foreground"}`}>Monthly</span>
              <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
              <span className={`text-sm ${isAnnual ? "font-medium" : "text-muted-foreground"}`}>Annual</span>
              {isAnnual && (
                <Badge variant="secondary" className="ml-2">
                  Save 20%
                </Badge>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="container pb-24">
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base mt-2">{plan.description}</CardDescription>

                  <div className="mt-6">
                    <div className="text-4xl font-bold">
                      ${isAnnual ? Math.floor(plan.annualPrice / 12) : plan.monthlyPrice}
                      <span className="text-lg font-normal text-muted-foreground">/month</span>
                    </div>
                    {isAnnual && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Billed annually (${plan.annualPrice}/year)
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} size="lg" asChild>
                    <Link href="/get-started">Start Free Trial</Link>
                  </Button>

                  <div>
                    <h4 className="font-medium mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 text-muted-foreground">Limitations:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <li key={limitationIndex} className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="h-4 w-4 flex-shrink-0 flex items-center justify-center">
                              <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                            </div>
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Add-ons Section */}
        <section className="bg-muted/50 py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Add-ons & Extensions</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Enhance your plan with additional features and services tailored to your specific needs.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {addOns.map((addon, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{addon.name}</CardTitle>
                    <CardDescription>{addon.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-primary mb-4">{addon.price}</div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Add to Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            {[
              {
                question: "Can I change my plan at any time?",
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments.",
              },
              {
                question: "What happens during the free trial?",
                answer:
                  "You get full access to all features of your chosen plan for 14 days. No credit card required to start, and you can cancel anytime during the trial.",
              },
              {
                question: "Do you offer refunds?",
                answer:
                  "We offer a 30-day money-back guarantee for all annual plans. Monthly plans can be cancelled at any time without penalty.",
              },
              {
                question: "Is there a setup fee?",
                answer:
                  "No setup fees ever. We also provide free onboarding and migration assistance for all new customers.",
              },
              {
                question: "Can I get a custom plan for my enterprise needs?",
                answer:
                  "Contact our sales team to discuss custom pricing and features for large organizations or unique requirements.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-24 text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Ready to Get Started?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of property managers who trust Smart Spaces AI to optimize their operations and maximize
              revenue.
            </p>
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
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
