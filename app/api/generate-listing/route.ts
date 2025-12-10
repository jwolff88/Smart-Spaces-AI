import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  try {
    const { address, type, bedrooms, amenities } = await req.json()

    // 1. Initialize Gemini
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        title: `Modern ${type} in ${address} (Mock)`,
        description: `This is a placeholder because the GEMINI_API_KEY is missing. Add it to .env to see real AI magic! This ${bedrooms}-bed ${type} features ${amenities.join(", ")}.`,
        suggestedPrice: 150 + (parseInt(bedrooms || "1") * 50)
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // 2. Configure Model - Switch to standard 'gemini-pro' for maximum compatibility
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // 3. Construct the Prompt
    const prompt = `
      Act as an expert Airbnb copywriter. Generate a listing for:
      - Type: ${type}
      - Bedrooms: ${bedrooms}
      - Location: ${address}
      - Amenities: ${amenities.join(", ")}

      Return a raw JSON object with exactly these three fields:
      1. "title": Catchy title (max 50 chars).
      2. "description": A compelling 3-sentence description emphasizing the vibe.
      3. "suggestedPrice": A number representing the nightly rate (USD).
    `

    // 4. Generate Content
    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()
    
    // 5. CLEANUP: gemini-pro often adds markdown code blocks (```json ... ```)
    // We must strip these out before parsing, or it will crash.
    text = text.replace(/```json/g, "").replace(/```/g, "").trim()
    
    // 6. Parse and Return
    const data = JSON.parse(text)
    return NextResponse.json(data)

  } catch (error) {
    console.error("Gemini API Error:", error)
    return NextResponse.json(
      { error: "Failed to generate listing" },
      { status: 500 }
    )
  }
}