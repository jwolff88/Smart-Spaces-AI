import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  try {
    const { address, type, bedrooms, amenities } = await req.json()

    // 1. Initialize Gemini
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      // Fallback Mock if no key is present
      return NextResponse.json({
        title: `Modern ${type} in ${address} (Mock)`,
        description: `This is a placeholder because the GEMINI_API_KEY is missing. Add it to .env to see real AI magic! This ${bedrooms}-bed ${type} features ${amenities.join(", ")}.`,
        suggestedPrice: 150 + (parseInt(bedrooms || "1") * 50)
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // 2. Configure Model - Use JSON mode for reliability
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    })

    // 3. Construct the Prompt
    const prompt = `
      Act as an expert Airbnb copywriter. Generate a listing for:
      - Type: ${type}
      - Bedrooms: ${bedrooms}
      - Location: ${address}
      - Amenities: ${amenities.join(", ")}

      Return a JSON object with exactly these three fields:
      1. "title": Catchy title (max 50 chars).
      2. "description": A compelling 3-sentence description emphasizing the vibe.
      3. "suggestedPrice": A number representing the nightly rate (USD).
    `

    // 4. Generate Content
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    // 5. Parse and Return
    const data = JSON.parse(responseText)
    return NextResponse.json(data)

  } catch (error) {
    console.error("Gemini API Error:", error)
    return NextResponse.json(
      { error: "Failed to generate listing" },
      { status: 500 }
    )
  }
}