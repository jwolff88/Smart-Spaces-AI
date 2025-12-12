import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { address, type, bedrooms, amenities } = body

    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OpenAI API Key")
      return NextResponse.json({ error: "OpenAI Key not configured" }, { status: 500 })
    }

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    // Use GPT-3.5-Turbo (Safer for new accounts)
    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a helpful real estate assistant. Output JSON only." 
        },
        { 
          role: "user", 
          content: `Write a listing for a ${bedrooms}-bedroom ${type} in ${address} with amenities: ${amenities?.join(", ")}.
          Return valid JSON with:
          {
            "title": "string (max 50 chars)",
            "description": "string (3 paragraphs)",
            "suggestedPrice": number
          }` 
        }
      ],
      model: "gpt-3.5-turbo", // <--- CHANGED FROM GPT-4
      response_format: { type: "json_object" },
    })

    const content = completion.choices[0].message.content
    if (!content) throw new Error("No content from AI")
    
    const parsedData = JSON.parse(content)
    return NextResponse.json(parsedData)

  } catch (error: any) {
    // Log the ACTUAL error from OpenAI so we can see it in Vercel logs
    console.error("OpenAI Error Details:", error.response?.data || error.message)
    
    return NextResponse.json(
      { error: "AI Generation Failed. Check server logs." }, 
      { status: 500 }
    )
  }
}