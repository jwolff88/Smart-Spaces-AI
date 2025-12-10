import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { address, type, bedrooms, amenities } = body

    // 1. Initialize Gemini
    // We check for the key to prevent crashing if it's missing
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        title: `Modern ${type} in ${address}`,
        description: `(System Note: GEMINI_API_KEY is missing in Vercel. Please add it to Settings > Environment Variables). This is a placeholder description for a ${bedrooms}-bedroom ${type}.`,
        suggestedPrice: 150
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    // Use the standard 'gemini-pro' model which is most stable
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // 2. Construct Prompt
    // We explicitly ask for a raw JSON object to reduce chatter
    const prompt = `
      Act as an expert Airbnb copywriter. Generate a listing for:
      - Type: ${type}
      - Bedrooms: ${bedrooms}
      - Location: ${address}
      - Amenities: ${amenities.join(", ")}

      Return a valid JSON object with exactly these fields:
      1. "title": Catchy title (max 50 chars).
      2. "description": A compelling 3-sentence description.
      3. "suggestedPrice": A number representing the nightly rate (USD).
      
      Do not include markdown formatting like \`\`\`json. Just the raw JSON.
    `

    // 3. Generate Content
    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()

    console.log("Raw AI Response:", text) // Useful for debugging in Vercel logs

    // 4. ROBUST CLEANUP (The Fix)
    // Gemini often wraps response in \`\`\`json ... \`\`\`. We must strip that.
    // We use a regex to find the first opening brace { and the last closing brace }
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      text = jsonMatch[0]
    }

    // 5. Parse and Return
    // If parsing fails, this block will throw an error that is caught below
    const data = JSON.parse(text)
    return NextResponse.json(data)

  } catch (error) {
    console.error("Gemini API Error:", error)
    // Return a 500 status so the frontend knows it failed
    return NextResponse.json(
      { error: "Failed to generate listing. Check Vercel Logs for details." },
      { status: 500 }
    )
  }
}