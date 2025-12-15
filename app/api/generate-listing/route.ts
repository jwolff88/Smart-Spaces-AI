import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, type, bedrooms, amenities } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }
    
    if (!address || !type || !bedrooms || !amenities) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

    const prompt = `
      You are an expert real estate copywriter. Given the following details about a vacation rental property, generate a compelling and attractive listing.
      
      Property Details:
      - Location/Address: ${address}
      - Property Type: ${type}
      - Bedrooms: ${bedrooms}
      - Key Amenities: ${amenities.join(", ")}

      Your task is to generate three pieces of information in a specific JSON format:
      1. A "title" for the listing. Make it catchy and descriptive, but not too long (under 60 characters).
      2. A "description" for the listing. This should be a friendly and inviting paragraph (around 40-60 words) highlighting the key features and the vibe of the place. Mention the location and a key amenity.
      3. A "suggestedPrice" (number). Based on the property type, location, and amenities, suggest a reasonable nightly price. For a ${type} with ${bedrooms} bedrooms in ${address}, this should be a good starting point.

      IMPORTANT: Respond with ONLY a valid JSON object with the keys "title", "description", and "suggestedPrice". Do not include any other text, markdown, or explanation.

      Example response format:
      {
        "title": "Chic Downtown Loft with Stunning Views",
        "description": "Escape to our stylish ${bedrooms}-bedroom ${type} right in the heart of ${address}. Enjoy modern amenities like a fully equipped kitchen and high-speed WiFi. Perfect for your next city adventure!",
        "suggestedPrice": 175
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean the response to ensure it's valid JSON
    const jsonResponse = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    const aiResponse = JSON.parse(jsonResponse);

    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error("AI generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate AI listing. Please check the server logs." },
      { status: 500 }
    );
  }
}