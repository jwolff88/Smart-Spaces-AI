import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, type, bedrooms, amenities } = body;

    if (!process.env.GEMINI_API_KEY || !genAI) {
      return NextResponse.json(
        { error: "Gemini API key (GEMINI_API_KEY) not configured" },
        { status: 500 }
      );
    }

    if (!address || !type || !bedrooms || !amenities) {
      return NextResponse.json(
        {
          error:
            "Missing required fields (address, type, bedrooms, amenities)",
        },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert real estate copywriter. Generate a compelling vacation rental listing.

Property Details:
- Location/Address: ${address}
- Property Type: ${type}
- Bedrooms: ${bedrooms}
- Key Amenities: ${amenities.join(", ")}

Generate three pieces of information:
1. A "title" for the listing (under 60 characters).
2. A "description" (40–60 words) that is friendly and inviting. Mention the location and a key amenity.
3. A "suggestedPrice" (number only). Suggest a reasonable nightly price for a ${type} with ${bedrooms} bedrooms in ${address}. Use a whole number.

IMPORTANT: Respond with ONLY a valid JSON object with the keys:
"title", "description", and "suggestedPrice".
Do not include any other text, markdown, or code blocks.
Example: {"title": "...", "description": "...", "suggestedPrice": 150}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let generatedContent = response.text();

    if (!generatedContent) {
      throw new Error("Gemini did not return any content.");
    }

    // Clean up the response - remove markdown code blocks if present
    generatedContent = generatedContent
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const aiResponse = JSON.parse(generatedContent);

    // Validate the response structure
    if (
      !aiResponse.title ||
      !aiResponse.description ||
      typeof aiResponse.suggestedPrice !== "number"
    ) {
      throw new Error("Invalid AI response format.");
    }

    return NextResponse.json(aiResponse);
  } catch (error: any) {
    console.error("AI generation failed:", error.message || error);

    let errorMessage = "Failed to generate AI listing.";

    if (error.message?.includes("API_KEY")) {
      errorMessage = "Gemini API key is invalid or expired. Please check your GEMINI_API_KEY.";
    } else if (error.message?.includes("JSON.parse")) {
      errorMessage += " AI generated invalid JSON. Please try again.";
    } else if (error.message?.includes("quota") || error.message?.includes("rate")) {
      errorMessage = "API rate limit reached. Please try again in a moment.";
    } else if (error.message) {
      errorMessage += ` Error: ${error.message}`;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
