import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { address, type, bedrooms, amenities } = body

    // 1. Get the Key (Checks all common names)
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY

    if (!apiKey) {
      console.error("Server Error: Missing Gemini API Key")
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 })
    }

    // 2. Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      You are a real estate copywriter.
      Write a listing for a ${bedrooms}-bedroom ${type} in ${address}.
      Amenities: ${amenities?.join(", ")}.
      
      Return valid JSON with these fields:
      {
        "title": "catchy title",
        "description": "3 paragraph description",
        "suggestedPrice": 0
      }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()
    
    // Clean markdown if Gemini adds it
    text = text.replace(/```json/g, "").replace(/```/g, "").trim()

    return NextResponse.json(JSON.parse(text))

  } catch (error: any) {
    console.error("Gemini Generation Error:", error)
    return NextResponse.json(
      { error: "Generation Failed. Check Vercel Logs." }, 
      { status: 500 }
    )
  }
}