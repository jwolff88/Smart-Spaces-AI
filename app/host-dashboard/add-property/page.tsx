"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Sparkles, CheckCircle2, ArrowLeft, Upload, X, ImageIcon, Briefcase, Wifi, Heart, Users, Mountain, Plane, Coffee } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createListing } from "@/app/actions/create-listing"

export default function AddPropertyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form State
  const [formData, setFormData] = useState({
    address: "",
    type: "Apartment",
    bedrooms: "1",
    amenities: [] as string[],
    // AI Matching Attributes
    vibes: [] as string[],
    workFriendly: false,
    workAmenities: [] as string[],
    wifiSpeed: "",
    idealFor: [] as string[],
    // Pricing
    smartPricing: true,
    manualPrice: "",
  })

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

  const IDEAL_FOR = [
    { id: "remote_work", label: "Remote Work", icon: Briefcase },
    { id: "vacation", label: "Vacation", icon: Plane },
    { id: "honeymoon", label: "Honeymoon", icon: Heart },
    { id: "family", label: "Family Trip", icon: Users },
    { id: "adventure", label: "Adventure", icon: Mountain },
  ]

  const WORK_AMENITIES = [
    { id: "fast_wifi", label: "Fast WiFi" },
    { id: "dedicated_desk", label: "Dedicated Desk" },
    { id: "monitor", label: "External Monitor" },
    { id: "ergonomic_chair", label: "Ergonomic Chair" },
    { id: "meeting_space", label: "Meeting Space" },
  ]

  const toggleArrayItem = (key: keyof typeof formData, item: string) => {
    const current = formData[key] as string[]
    if (current.includes(item)) {
      setFormData({ ...formData, [key]: current.filter(i => i !== item) })
    } else {
      setFormData({ ...formData, [key]: [...current, item] })
    }
  }

  // Images State
  const [images, setImages] = useState<string[]>([])

  // AI Content State
  const [aiContent, setAiContent] = useState<{
    title: string
    description: string
    suggestedPrice: number
  } | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const newImages: string[] = []

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          console.error("Upload failed:", error)
          continue
        }

        const data = await response.json()
        newImages.push(data.url)
      } catch (error) {
        console.error("Upload error:", error)
      }
    }

    setImages((prev) => [...prev, ...newImages])
    setIsUploading(false)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

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

    // Validate manual price if smart pricing is disabled
    if (!formData.smartPricing && !formData.manualPrice) {
      alert("Please enter a price for your listing")
      return
    }

    setIsSaving(true)

    // Use AI price if smart pricing enabled, otherwise use manual price
    const finalPrice = formData.smartPricing
      ? aiContent.suggestedPrice
      : parseInt(formData.manualPrice)

    // Prepare final data payload
    const listingData = {
      title: aiContent.title,
      description: aiContent.description,
      price: finalPrice,
      smartPricing: formData.smartPricing,
      location: formData.address,
      type: formData.type,
      bedrooms: formData.bedrooms,
      amenities: formData.amenities,
      images: images,
      imageSrc: images[0] || null, // Primary image
      // AI Matching Attributes
      vibes: formData.vibes,
      workFriendly: formData.workFriendly,
      workAmenities: formData.workAmenities,
      wifiSpeed: formData.wifiSpeed ? parseInt(formData.wifiSpeed) : null,
      idealFor: formData.idealFor,
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

              {/* AI Matching Section */}
              <div className="border-t pt-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">AI Matching Attributes</h3>
                  <span className="text-xs text-gray-500">(Help travelers find your property)</span>
                </div>

                {/* Property Vibes */}
                <div className="grid gap-2 mb-4">
                  <Label>Property Vibes (Select all that apply)</Label>
                  <div className="flex flex-wrap gap-2">
                    {VIBES.map((vibe) => (
                      <button
                        key={vibe.id}
                        type="button"
                        onClick={() => toggleArrayItem("vibes", vibe.id)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          formData.vibes.includes(vibe.id)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {vibe.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ideal For */}
                <div className="grid gap-2 mb-4">
                  <Label>Ideal For (Select all that apply)</Label>
                  <div className="flex flex-wrap gap-2">
                    {IDEAL_FOR.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleArrayItem("idealFor", item.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                          formData.idealFor.includes(item.id)
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <item.icon className="h-3.5 w-3.5" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Work-Friendly Toggle */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Work-Friendly Space</p>
                      <p className="text-xs text-gray-500">Great for remote workers and digital nomads</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.workFriendly}
                    onCheckedChange={(checked) => setFormData({ ...formData, workFriendly: checked })}
                  />
                </div>

                {/* Work Amenities (shown if work-friendly) */}
                {formData.workFriendly && (
                  <div className="grid gap-2 mb-4 ml-4 border-l-2 border-blue-200 pl-4">
                    <Label className="text-sm">Work Amenities Available</Label>
                    <div className="flex flex-wrap gap-2">
                      {WORK_AMENITIES.map((amenity) => (
                        <button
                          key={amenity.id}
                          type="button"
                          onClick={() => toggleArrayItem("workAmenities", amenity.id)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            formData.workAmenities.includes(amenity.id)
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {amenity.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Wifi className="h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="WiFi Speed (Mbps)"
                        type="number"
                        className="w-40"
                        value={formData.wifiSpeed}
                        onChange={(e) => setFormData({ ...formData, wifiSpeed: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div className="grid gap-2">
                <Label>Property Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                        <span className="text-sm text-gray-500">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="text-sm text-gray-500">Click to upload images</span>
                        <span className="text-xs text-gray-400">JPG, PNG, WebP up to 10MB</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {images.map((url, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={url}
                          alt={`Property image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pricing Section */}
              <div className="border-t pt-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-green-600 font-bold text-lg">$</span>
                  <h3 className="font-semibold">Pricing Strategy</h3>
                </div>

                {/* Smart Pricing Toggle */}
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg mb-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Smart Pricing</p>
                      <p className="text-xs text-gray-500">AI adjusts your price based on demand & market data</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.smartPricing}
                    onCheckedChange={(checked) => setFormData({ ...formData, smartPricing: checked })}
                  />
                </div>

                {/* Manual Price Input (shown when smart pricing is OFF) */}
                {!formData.smartPricing && (
                  <div className="ml-4 border-l-2 border-green-200 pl-4">
                    <Label className="text-sm">Your Nightly Price</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-gray-500 font-medium">$</span>
                      <Input
                        type="number"
                        placeholder="150"
                        min="1"
                        className="w-32"
                        value={formData.manualPrice}
                        onChange={(e) => setFormData({ ...formData, manualPrice: e.target.value })}
                      />
                      <span className="text-sm text-gray-500">/ night</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">This price will be fixed and won&apos;t change automatically</p>
                  </div>
                )}
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

                {formData.smartPricing ? (
                  <div className="flex items-center gap-4 p-4 bg-gray-900 text-white rounded-lg">
                    <div className="bg-green-500/20 p-2 rounded-full">
                      <Sparkles className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Smart Pricing Enabled</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">${aiContent?.suggestedPrice}</span>
                        <span className="text-sm text-gray-500">/ night</span>
                      </div>
                    </div>
                    <div className="ml-auto text-right text-xs text-gray-500">
                      AI will adjust based on <br/> demand & market trends
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-gray-900 text-white rounded-lg">
                    <div className="bg-blue-500/20 p-2 rounded-full">
                      <span className="text-blue-400 font-bold">$</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Your Fixed Price</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">${formData.manualPrice || "—"}</span>
                        <span className="text-sm text-gray-500">/ night</span>
                      </div>
                    </div>
                    <div className="ml-auto text-right text-xs text-gray-500">
                      This price will remain <br/> constant over time
                    </div>
                  </div>
                )}
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