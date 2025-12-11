"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Sparkles, CheckCircle2, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createListing } from "@/app/actions/create-listing"

export default function AddPropertyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    address: "",
    type: "Apartment",
    bedrooms: "1",
    amenities: [] as string[]
  })

  // AI Content State
  const [aiContent, setAiContent] = useState<{
    title: string
    description: string
    suggestedPrice: number
  } | null>(null)

  const handleGenerateAI = async () => {
    setIsGenerating(true)
    try {
      // Call our API route
      const response = await fetch("/api/generate-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error("Failed to generate")

      const data = await response.json()
      setAiContent({
        title: data.title,
        description: data.description,
        suggestedPrice: data.suggestedPrice
      })
      setStep(2) // Move to next step
    } catch (error) {
      console.error(error)
      alert("Failed to generate listing. Check console.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePublish = async () => {
    if (!aiContent) return
    setIsSaving(true)

    // Prepare final data payload
    const listingData = {
      title: aiContent.title,
      description: aiContent.description,
      price: aiContent.suggestedPrice,
      location: formData.address,
      type: formData.type,
      bedrooms: formData.bedrooms,
      amenities: formData.amenities
    }

    // Call the Server Action
    const result = await createListing(listingData)

    setIsSaving(false)

    if (result.error) {
      alert(result.error)
    } else {
      // Success! Redirect to dashboard
      router.push("/host-dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <Card className="w-full max-w-3xl shadow-xl">
        {/* Header with Back Button */}
        <div className="p-6 border-b flex items-center gap-4">
          <Link href="/host-dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Add New Property</h1>
            <p className="text-gray-500">Step {step} of 2: {step === 1 ? "Property Details" : "Review AI Listing"}</p>
          </div>
        </div>

        <CardContent className="p-8">
          {step === 1 ? (
            // --- STEP 1: INPUTS ---
            <div className="space-y-6">
              <div className="grid gap-2">
                <Label>Property Address</Label>
                <Input 
                  placeholder="e.g. 123 Main St, Austin, TX" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Property Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(val) => setFormData({...formData, type: val})}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Condo">Condo</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Bedrooms</Label>
                  <Select 
                    value={formData.bedrooms} 
                    onValueChange={(val) => setFormData({...formData, bedrooms: val})}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4+">4+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Amenities (Comma separated)</Label>
                <Input 
                  placeholder="Wifi, Pool, Gym, Free Parking..." 
                  onChange={(e) => setFormData({
                    ...formData, 
                    amenities: e.target.value.split(',').map(s => s.trim())
                  })}
                />
              </div>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={handleGenerateAI}
                disabled={isGenerating || !formData.address}
              >
                {isGenerating ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Market Data...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generate Listing with AI</>
                )}
              </Button>
            </div>
          ) : (
            // --- STEP 2: AI REVIEW ---
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">AI Optimization Complete</h3>
                  <p className="text-sm text-blue-700">We analyzed market data to generate this high-converting listing.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-xs uppercase tracking-wide text-gray-500 font-bold">Optimized Title</Label>
                  <Input 
                    value={aiContent?.title} 
                    onChange={(e) => setAiContent(prev => prev ? {...prev, title: e.target.value} : null)}
                    className="font-medium text-lg"
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-xs uppercase tracking-wide text-gray-500 font-bold">Compelling Description</Label>
                  <Textarea 
                    value={aiContent?.description}
                    onChange={(e) => setAiContent(prev => prev ? {...prev, description: e.target.value} : null)} 
                    className="h-32 leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-900 text-white rounded-lg">
                  <div className="bg-green-500/20 p-2 rounded-full">
                    <span className="text-green-400 font-bold">$</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">AI Suggested Price</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">${aiContent?.suggestedPrice}</span>
                      <span className="text-sm text-gray-500">/ night</span>
                    </div>
                  </div>
                  <div className="ml-auto text-right text-xs text-gray-500">
                    Based on 45 comparable <br/> listings in your area.
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="w-1/3">
                  Edit Inputs
                </Button>
                <Button 
                  className="w-2/3 bg-green-600 hover:bg-green-700"
                  onClick={handlePublish}
                  disabled={isSaving}
                >
                  {isSaving ? (
                     <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                     <><CheckCircle2 className="mr-2 h-4 w-4" /> Publish Listing</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}