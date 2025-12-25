import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Initialize Claude
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, type, bedrooms, amenities } = body;

    if (!process.env.ANTHROPIC_API_KEY || !anthropic) {
      return NextResponse.json(
        { error: "Claude API key (ANTHROPIC_API_KEY) not configured" },
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

    const prompt = `You are an expert real estate copywriter specializing in vacation rentals. Generate a compelling listing that converts browsers into bookers.

Property Details:
- Location/Address: ${address}
- Property Type: ${type}
- Bedrooms: ${bedrooms}
- Key Amenities: ${amenities.join(", ")}

Generate a JSON object with exactly these three fields:
1. "title": A catchy, memorable title (under 60 characters) that highlights the best feature or location
2. "description": A warm, inviting description (40-60 words) that paints a picture of the experience. Mention the location and key amenities naturally.
3. "suggestedPrice": A reasonable nightly price as a number (no $ sign). Base it on the property type, bedrooms, and location.

Respond with ONLY the JSON object, no other text:`;

    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract text from response
    const textContent = message.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("Claude did not return text content.");
    }

    let generatedContent = textContent.text.trim();

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

    if (error.message?.includes("API_KEY") || error.message?.includes("401")) {
      errorMessage = "Claude API key is invalid or expired. Please check your ANTHROPIC_API_KEY.";
    } else if (error.message?.includes("JSON.parse")) {
      errorMessage += " AI generated invalid JSON. Please try again.";
    } else if (error.message?.includes("rate") || error.status === 429) {
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
