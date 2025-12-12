import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { address, type, bedrooms, amenities } = body

    // 1. Check for the Key (We check both common names just in case)
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key not found in environment variables" }, { status: 500 })
    }

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    // 2. Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // 3. Prompt
    const prompt = `
      You are an expert real estate copywriter.
      Write a listing for a ${bedrooms}-bedroom ${type} in ${address} with amenities: ${amenities?.join(", ")}.
      
      Return strictly VALID JSON (no markdown formatting, no backticks) with exactly these fields:
      {
        "title": "catchy title (max 50 chars)",
        "description": "compelling description (3 paragraphs)",
        "suggestedPrice": 0 (number only)
      }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    
    // 4. Clean up response (Gemini sometimes adds markdown backticks)
    let text = response.text()
    text = text.replace(/```json/g, "").replace(/```/g, "").trim()

    const parsedData = JSON.parse(text)
    
    return NextResponse.json(parsedData)

  } catch (error: any) {
    console.error("Gemini Error:", error)
    return NextResponse.json(
      { error: "AI Generation Failed" }, 
      { status: 500 }
    )
  }
}