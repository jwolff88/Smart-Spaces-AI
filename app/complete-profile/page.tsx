"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Sparkles, Briefcase, Palmtree, Users, Wifi, Coffee, Loader2 } from "lucide-react"

export default function CompleteProfilePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Simulate AI Processing
      setIsLoading(true)
      setTimeout(() => {
        router.push("/recommendations")
      }, 2000)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl">Let's personalize your stay</CardTitle>
          <CardDescription>
            Our AI uses these details to filter out 99% of irrelevant listings and find your perfect match.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          
          {/* STEP 1: TRAVEL INTENT */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label className="text-base">What is the main purpose of this trip?</Label>
                <RadioGroup defaultValue="vacation" className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <RadioGroupItem 
                      value="work" 
                      id="work" 
                      className="peer sr-only opacity-0 absolute inset-0" 
                      aria-label="Remote Work"
                    />
                    <Label
                      htmlFor="work"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                    >
                      <Briefcase className="mb-3 h-6 w-6" />
                      Remote Work
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem 
                      value="vacation" 
                      id="vacation" 
                      className="peer sr-only opacity-0 absolute inset-0"
                      aria-label="Vacation" 
                    />
                    <Label
                      htmlFor="vacation"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                    >
                      <Palmtree className="mb-3 h-6 w-6" />
                      Vacation
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2 pt-4">
                <Label className="text-base">Who are you traveling with?</Label>
                <RadioGroup defaultValue="couple" className="grid grid-cols-3 gap-4">
                  <div className="relative">
                    <RadioGroupItem 
                      value="solo" 
                      id="solo" 
                      className="peer sr-only opacity-0 absolute inset-0" 
                    />
                    <Label htmlFor="solo" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 text-center text-sm hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all">
                      Solo
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem 
                      value="couple" 
                      id="couple" 
                      className="peer sr-only opacity-0 absolute inset-0" 
                    />
                    <Label htmlFor="couple" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 text-center text-sm hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all">
                      Couple
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem 
                      value="group" 
                      id="group" 
                      className="peer sr-only opacity-0 absolute inset-0" 
                    />
                    <Label htmlFor="group" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 text-center text-sm hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all">
                      Group/Family
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* STEP 2: PREFERENCES & VIBE */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <Label className="text-base">What's non-negotiable for you?</Label>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Wifi className="h-5 w-5 text-muted-foreground" />
                      <div className="grid gap-0.5">
                        <Label>High-Speed Internet</Label>
                        {/* THE FIX IS HERE: Used &gt; instead of > */}
                        <p className="text-xs text-muted-foreground">Video-call ready (&gt;100Mbps)</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Coffee className="h-5 w-5 text-muted-foreground" />
                      <div className="grid gap-0.5">
                        <Label>Dedicated Workspace</Label>
                        <p className="text-xs text-muted-foreground">Desk and ergonomic chair</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: BUDGET */}
          {step === 3 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <Label className="text-base">Nightly Budget Range</Label>
                   <span className="text-sm font-medium text-muted-foreground">$100 - $450</span>
                 </div>
                 <Slider defaultValue={[30]} max={100} step={1} className="w-full" />
                 <p className="text-xs text-muted-foreground">
                   Our AI will optimize for value within this range, prioritizing highly-rated stays with your specific amenities.
                 </p>
               </div>

               <div className="rounded-md bg-primary/5 p-4 text-sm text-primary">
                 <p className="font-medium">AI Insight:</p>
                 <p className="mt-1 opacity-90">
                   Based on your "Remote Work" intent, we will prioritize quiet neighborhoods and properties with verified WiFi speeds.
                 </p>
               </div>
             </div>
          )}

        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setStep(step - 1)}
            disabled={step === 1 || isLoading}
          >
            Back
          </Button>
          <Button onClick={handleNext} disabled={isLoading} className="min-w-[120px]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : step === 3 ? (
              "Find My Stays"
            ) : (
              "Next"
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Progress Indicator */}
      <div className="absolute bottom-8 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className={`h-2 w-2 rounded-full transition-colors ${step >= i ? "bg-primary" : "bg-muted-foreground/30"}`} 
          />
        ))}
      </div>
    </div>
  )
}