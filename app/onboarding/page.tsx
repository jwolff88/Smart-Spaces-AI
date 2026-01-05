"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Briefcase, Heart, Users, Plane, Mountain, DollarSign, Home, Wifi, ChevronRight, ChevronLeft, Check, X, Monitor, Armchair, UsersRound } from "lucide-react"
import Link from "next/link"

const TRAVEL_INTENTS = [
  { id: "remote_work", label: "Remote Work", icon: Briefcase, description: "I need a productive workspace" },
  { id: "vacation", label: "Vacation", icon: Plane, description: "Relaxation and exploration" },
  { id: "honeymoon", label: "Honeymoon", icon: Heart, description: "Romantic getaway" },
  { id: "family", label: "Family Trip", icon: Users, description: "Traveling with kids" },
  { id: "adventure", label: "Adventure", icon: Mountain, description: "Outdoor activities and thrills" },
  { id: "budget", label: "Budget Travel", icon: DollarSign, description: "Best value for money" },
]

const VIBES = [
  { id: "quiet", label: "Quiet & Peaceful" },
  { id: "social", label: "Social & Lively" },
  { id: "luxury", label: "Luxury" },
  { id: "cozy", label: "Cozy & Homey" },
  { id: "modern", label: "Modern & Sleek" },
  { id: "rustic", label: "Rustic & Charming" },
  { id: "urban", label: "Urban & Central" },
  { id: "nature", label: "Close to Nature" },
]

const WORK_NEEDS = [
  { id: "fast_wifi", label: "Fast WiFi (50+ Mbps)", icon: Wifi },
  { id: "dedicated_desk", label: "Dedicated Desk", icon: Briefcase },
  { id: "monitor", label: "External Monitor", icon: Monitor },
  { id: "ergonomic_chair", label: "Ergonomic Chair", icon: Armchair },
  { id: "meeting_space", label: "Meeting Space", icon: UsersRound },
]

const AMENITIES = [
  { id: "pool", label: "Pool" },
  { id: "gym", label: "Gym" },
  { id: "kitchen", label: "Full Kitchen" },
  { id: "parking", label: "Free Parking" },
  { id: "pet_friendly", label: "Pet Friendly" },
  { id: "washer", label: "Washer/Dryer" },
  { id: "ac", label: "Air Conditioning" },
  { id: "heating", label: "Heating" },
]

const BUDGET_RANGES = [
  { id: "budget", label: "Budget", description: "Under $100/night" },
  { id: "moderate", label: "Moderate", description: "$100-$250/night" },
  { id: "luxury", label: "Luxury", description: "$250+/night" },
]

const PROPERTY_TYPES = [
  { id: "apartment", label: "Apartment" },
  { id: "house", label: "House" },
  { id: "condo", label: "Condo" },
  { id: "villa", label: "Villa" },
  { id: "studio", label: "Studio" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [profile, setProfile] = useState({
    travelIntent: "",
    preferredVibes: [] as string[],
    workNeeds: [] as string[],
    mustHaveAmenities: [] as string[],
    budgetRange: "",
    preferredTypes: [] as string[],
  })

  const totalSteps = 5
  const showWorkStep = profile.travelIntent === "remote_work"

  const toggleArrayItem = (key: keyof typeof profile, item: string) => {
    const current = profile[key] as string[]
    if (current.includes(item)) {
      setProfile({ ...profile, [key]: current.filter(i => i !== item) })
    } else {
      setProfile({ ...profile, [key]: [...current, item] })
    }
  }

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      router.push("/login?role=traveler")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/traveler-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        router.push("/guest-dashboard")
      } else {
        console.error("Failed to save profile")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1: return !!profile.travelIntent
      case 2: return profile.preferredVibes.length > 0
      case 3: return !showWorkStep || profile.workNeeds.length > 0
      case 4: return profile.mustHaveAmenities.length > 0
      case 5: return !!profile.budgetRange && profile.preferredTypes.length > 0
      default: return true
    }
  }

  const nextStep = () => {
    if (step === 2 && !showWorkStep) {
      setStep(4) // Skip work needs if not remote work
    } else {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step === 4 && !showWorkStep) {
      setStep(2) // Skip work needs going back
    } else {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background bg-grid flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-2xl glass-neon border-primary/30 relative z-10">
        {/* Close/Back button */}
        <Link
          href="/guest-dashboard"
          className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Link>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-primary font-semibold text-glow-cyan">Smart Matching</span>
          </div>
          <CardTitle className="text-2xl text-foreground">Tell us about your travel style</CardTitle>
          <CardDescription className="text-muted-foreground">
            Step {step} of {totalSteps} - {step === 1 ? "Travel Intent" : step === 2 ? "Preferred Vibes" : step === 3 ? "Work Needs" : step === 4 ? "Must-Have Amenities" : "Budget & Property Type"}
          </CardDescription>

          {/* Progress bar */}
          <div className="flex gap-1 mt-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < step ? "bg-primary glow-cyan" : "bg-border"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Travel Intent */}
          {step === 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TRAVEL_INTENTS.map((intent) => (
                <button
                  key={intent.id}
                  onClick={() => setProfile({ ...profile, travelIntent: intent.id })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    profile.travelIntent === intent.id
                      ? "border-primary bg-primary/20 glow-cyan"
                      : "border-border bg-card/50 hover:border-primary/50"
                  }`}
                >
                  <intent.icon className={`h-6 w-6 mb-2 ${
                    profile.travelIntent === intent.id ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <p className="font-medium text-foreground">{intent.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{intent.description}</p>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Vibes */}
          {step === 2 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {VIBES.map((vibe) => (
                <button
                  key={vibe.id}
                  onClick={() => toggleArrayItem("preferredVibes", vibe.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    profile.preferredVibes.includes(vibe.id)
                      ? "border-primary bg-primary/20 glow-cyan"
                      : "border-border bg-card/50 hover:border-primary/50"
                  }`}
                >
                  <p className="font-medium text-foreground text-sm">{vibe.label}</p>
                  {profile.preferredVibes.includes(vibe.id) && (
                    <Check className="h-4 w-4 text-primary mt-1 mx-auto" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Work Needs (only for remote workers) */}
          {step === 3 && showWorkStep && (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm mb-4">
                As a remote worker, what do you need to stay productive?
              </p>
              {WORK_NEEDS.map((need) => (
                <button
                  key={need.id}
                  onClick={() => toggleArrayItem("workNeeds", need.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    profile.workNeeds.includes(need.id)
                      ? "border-primary bg-primary/20 glow-cyan"
                      : "border-border bg-card/50 hover:border-primary/50"
                  }`}
                >
                  {need.icon && <need.icon className={`h-5 w-5 ${
                    profile.workNeeds.includes(need.id) ? "text-primary" : "text-muted-foreground"
                  }`} />}
                  <span className="font-medium text-foreground">{need.label}</span>
                  {profile.workNeeds.includes(need.id) && (
                    <Check className="h-5 w-5 text-primary ml-auto" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 4: Amenities */}
          {step === 4 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AMENITIES.map((amenity) => (
                <button
                  key={amenity.id}
                  onClick={() => toggleArrayItem("mustHaveAmenities", amenity.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    profile.mustHaveAmenities.includes(amenity.id)
                      ? "border-accent bg-accent/20 glow-lime"
                      : "border-border bg-card/50 hover:border-accent/50"
                  }`}
                >
                  <p className="font-medium text-foreground text-sm">{amenity.label}</p>
                  {profile.mustHaveAmenities.includes(amenity.id) && (
                    <Check className="h-4 w-4 text-accent mt-1 mx-auto" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 5: Budget & Property Types */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <p className="text-muted-foreground text-sm mb-3">What's your budget range?</p>
                <div className="grid grid-cols-3 gap-3">
                  {BUDGET_RANGES.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setProfile({ ...profile, budgetRange: range.id })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        profile.budgetRange === range.id
                          ? "border-secondary bg-secondary/20 glow-magenta"
                          : "border-border bg-card/50 hover:border-secondary/50"
                      }`}
                    >
                      <p className="font-medium text-foreground">{range.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{range.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-sm mb-3">What types of properties do you prefer?</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {PROPERTY_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => toggleArrayItem("preferredTypes", type.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        profile.preferredTypes.includes(type.id)
                          ? "border-secondary bg-secondary/20 glow-magenta"
                          : "border-border bg-card/50 hover:border-secondary/50"
                      }`}
                    >
                      <Home className={`h-5 w-5 mx-auto mb-1 ${
                        profile.preferredTypes.includes(type.id) ? "text-secondary" : "text-muted-foreground"
                      }`} />
                      <p className="font-medium text-foreground text-sm">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="border-border/50 text-muted-foreground hover:bg-primary/10 hover:border-primary/50 transition-all"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            {step < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="bg-primary hover:bg-primary/80 glow-cyan hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] transition-all"
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 glow-cyan hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] transition-all"
              >
                {isSubmitting ? "Saving..." : "Find My Perfect Stay"}
                <Sparkles className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
