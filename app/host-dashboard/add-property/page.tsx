"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Sparkles, Loader2, DollarSign, CheckCircle2 } from "lucide-react"

export default function AddPropertyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    address: "",
    type: "Apartment",
    bedrooms: "1",
    amenities: [] as string[]
  })

  // AI Generated State
  const [aiContent, setAiContent] = useState({
    title: "",
    description: "",
    suggestedPrice: 0
  })

  // 1. Generate Content with AI
  const handleGenerateAI = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to generate")

      const data = await response.json()
      setAiContent({
        title: data.title,
        description: data.description,
        suggestedPrice: data.suggestedPrice
      })
      setStep(3)
    } catch (error) {
      console.error(error)
      setAiContent({
        title: "Error Connecting to AI",
        description: "Please check your internet connection or API key.",
        suggestedPrice: 0
      })
      setStep(3)
    } finally {
      setIsGenerating(false)
    }
  }

  // 2. Save to Database
  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      // Validate required fields before submitting
      if (!aiContent.title || !aiContent.description || !formData.address) {
        alert("Please ensure all required fields are filled: title, description, and address.")
        setIsPublishing(false)
        return
      }

      if (aiContent.suggestedPrice <= 0) {
        alert("Please ensure the price is set to a valid amount.")
        setIsPublishing(false)
        return
      }

      const payload = {
        title: aiContent.title,
        description: aiContent.description,
        price: aiContent.suggestedPrice,
        location: formData.address,
        bedrooms: formData.bedrooms,
        amenities: formData.amenities,
        type: formData.type
      }

      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = "Failed to save listing"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
          if (errorData.details) {
            console.error("Error details:", errorData.details)
          }
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      // Success! Redirect to listings
      router.push("/host-dashboard/listings")
    } catch (error) {
      console.error("Publish Error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to save listing. Please try again."
      alert(errorMessage)
    } finally {
      setIsPublishing(false)
    }
  }

  const toggleAmenity = (item: string) => {
    setFormData(prev => {
      const amenities = prev.amenities.includes(item)
        ? prev.amenities.filter(a => a !== item)
        : [...prev.amenities, item]
      return { ...prev, amenities }
    })
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 max-w-2xl mx-auto px-4">
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">List Your Property</h1>
        <p className="text-muted-foreground">Let our AI optimize your listing for maximum revenue.</p>
      </div>

      {/* --- STEP 1: BASIC INFO --- */}
      {step === 1 && (
        <Card className="w-full animate-in fade-in slide-in-from-bottom-4">
          <CardHeader>
            <CardTitle>The Basics</CardTitle>
            <CardDescription>Where is your property located?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="address">Property Address</Label>
              <Input 
                id="address"
                placeholder="123 Main St, San Francisco, CA" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="property-type">Property Type</Label>
                <select 
                  id="property-type"
                  aria-label="Property Type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Guest Suite</option>
                  <option>Loft</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input 
                  id="bedrooms"
                  type="number" 
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => setStep(2)}>Next: Amenities</Button>
          </CardFooter>
        </Card>
      )}

      {/* --- STEP 2: AMENITIES --- */}
      {step === 2 && (
        <Card className="w-full animate-in fade-in slide-in-from-right-4">
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
            <CardDescription>What makes your place special?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {["Wifi", "Kitchen", "Workspace", "Free Parking", "Gym", "Pool", "Smart Lock", "AC"].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox 
                    id={item} 
                    checked={formData.amenities.includes(item)}
                    onCheckedChange={() => toggleAmenity(item)}
                  />
                  <Label htmlFor={item}>{item}</Label>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={handleGenerateAI} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Optimizing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Listing
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* --- STEP 3: AI REVIEW --- */}
      {step === 3 && (
        <Card className="w-full animate-in zoom-in-95 duration-300 border-primary/20 shadow-lg">
          <CardHeader className="bg-primary/5 rounded-t-xl">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <CardTitle>AI Optimization Complete</CardTitle>
            </div>
            <CardDescription>
              We analyzed market data to generate this high-converting listing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            
            <div className="space-y-2">
              <Label className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Optimized Title</Label>
              <Input value={aiContent.title} readOnly className="font-semibold text-lg" />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Compelling Description</Label>
              <Textarea value={aiContent.description} readOnly className="h-32 leading-relaxed" />
            </div>

            <div className="flex items-center gap-4 rounded-lg border p-4 bg-green-50 dark:bg-green-900/10 dark:border-green-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">AI Suggested Price</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-100">${aiContent.suggestedPrice} <span className="text-sm font-normal text-muted-foreground">/ night</span></p>
              </div>
              <div className="ml-auto text-xs text-muted-foreground text-right">
                Based on 45 comparable <br/> listings in your area.
              </div>
            </div>

          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(2)}>Edit Inputs</Button>
            <Button size="lg" onClick={handlePublish} disabled={isPublishing} className="gap-2">
              {isPublishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Publish Listing
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Progress Steps */}
      <div className="mt-8 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className={`h-1.5 w-8 rounded-full transition-colors ${step >= i ? "bg-primary" : "bg-muted"}`} 
          />
        ))}
      </div>

    </div>
  )
}