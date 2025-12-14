"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddProperty() {
  const router = useRouter()
  
  // 1. State for the Image URL and other fields
  const [imageUrl, setImageUrl] = useState("")
  const [address, setAddress] = useState("")
  const [type, setType] = useState("Apartment")
  const [bedrooms, setBedrooms] = useState("1")
  const [amenities, setAmenities] = useState("")
  
  const [generatedListing, setGeneratedListing] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // 2. Generate Button (Calls your Gemini API)
  async function handleGenerate() {
    setLoading(true)
    try {
      const res = await fetch("/api/generate-listing", {
        method: "POST",
        body: JSON.stringify({ 
          address, 
          type, 
          bedrooms, 
          amenities: amenities.split(",").map(a => a.trim()) 
        }),
      })
      
      if (!res.ok) throw new Error("Generation failed")
      const data = await res.json()
      setGeneratedListing(data)
    } catch (err) {
      alert("Error generating listing. Check console.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 3. Publish Button (Saves the Image + Text to Database)
  async function handlePublish() {
    if (!generatedListing) return

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        body: JSON.stringify({
          address,
          imageUrl, // <--- This sends your image link to the database
          type,
          bedrooms: parseInt(bedrooms),
          amenities: amenities.split(",").map(a => a.trim()),
          title: generatedListing.title,
          description: generatedListing.description,
          price: generatedListing.suggestedPrice,
        }),
      })

      if (res.ok) {
        router.push("/host") // Redirect to dashboard
      } else {
        alert("Failed to save property")
      }
    } catch (err) {
      console.error(err)
      alert("Error saving property")
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Add a New Property</h1>
      
      <div className="space-y-4">
        
        {/* --- NEW IMAGE INPUT --- */}
        <div>
          <label className="block font-medium mb-1">Property Image URL</label>
          <input
            type="text"
            placeholder="https://images.unsplash.com/..."
            className="w-full p-2 border rounded"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            <strong>Tip:</strong> Go to <a href="https://unsplash.com" target="_blank" className="text-blue-600 underline">Unsplash.com</a>, right-click an image, choose "Copy Image Address", and paste it here.
          </p>
        </div>
        {/* ----------------------- */}

        <div>
          <label className="block font-medium mb-1">Address</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Type</label>
            <select
              className="w-full p-2 border rounded"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>Apartment</option>
              <option>House</option>
              <option>Condo</option>
              <option>Cabin</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Bedrooms</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Amenities (comma separated)</label>
          <input
            type="text"
            placeholder="WiFi, Pool, Gym"
            className="w-full p-2 border rounded"
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
          />
        </div>

        {/* GENERATE BUTTON */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Listing with AI"}
        </button>

        {/* PREVIEW AREA */}
        {generatedListing && (
          <div className="mt-8 p-4 border rounded bg-gray-50">
            <h2 className="text-xl font-bold mb-2">Preview</h2>
            
            {/* Image Preview */}
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded mb-4" 
              />
            )}

            <div className="space-y-2">
              <input
                type="text"
                className="w-full font-bold text-lg p-1 border rounded"
                value={generatedListing.title}
                onChange={(e) => setGeneratedListing({...generatedListing, title: e.target.value})}
              />
              <textarea
                className="w-full h-32 p-1 border rounded"
                value={generatedListing.description}
                onChange={(e) => setGeneratedListing({...generatedListing, description: e.target.value})}
              />
              <div className="font-bold text-green-700">
                Suggested Price: ${generatedListing.suggestedPrice}/night
              </div>
            </div>

            <button
              onClick={handlePublish}
              className="w-full mt-4 bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700"
            >
              Publish Listing
            </button>
          </div>
        )}
      </div>
    </div>
  )
}