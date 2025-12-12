import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { address, type, bedrooms, amenities } = body

    // 1. Validate input
    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    // 2. Construct the prompt for GPT-4
    const prompt = `
      You are an expert real estate copywriter and pricing analyst.
      Write a listing for a property with these details:
      - Address: ${address}
      - Type: ${type}
      - Bedrooms: ${bedrooms}
      - Amenities: ${amenities.join(", ")}

      Return the response in strictly valid JSON format with exactly these fields:
      {
        "title": "A catchy, SEO-friendly title (max 50 chars)",
        "description": "A compelling, 3-paragraph description highlighting the lifestyle and amenities.",
        "suggestedPrice": 0 (A number representing the nightly rate based on the location and size. Be realistic.)
      }
    `

    // 3. Call OpenAI
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-4-turbo-preview", // Or "gpt-3.5-turbo" if you want it cheaper
      response_format: { type: "json_object" },
    })

    // 4. Parse the response
    const content = completion.choices[0].message.content
    if (!content) throw new Error("No content from AI")
    
    const parsedData = JSON.parse(content)

    return NextResponse.json(parsedData)

  } catch (error) {
    console.error("AI Generation Error:", error)
    return NextResponse.json(
      { error: "Failed to generate listing. Ensure API Key is set." }, 
      { status: 500 }
    )
  }
}