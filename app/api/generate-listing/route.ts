import { NextResponse } from "next/server";
import OpenAI from "openai";

// OpenAI API configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const OPENAI_MODEL = "gpt-3.5-turbo"; // Cost-effective chat model

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, type, bedrooms, amenities } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key (OPENAI_API_KEY) not configured" },
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

    // Construct the prompt for the OpenAI chat model
    const promptMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: "system",
          content:
            "You are an expert real estate copywriter. Your task is to generate compelling listing details in JSON format.",
        },
        {
          role: "user",
          content: `
Given the following details about a vacation rental property, generate a compelling and attractive listing.

Property Details:
- Location/Address: ${address}
- Property Type: ${type}
- Bedrooms: ${bedrooms}
- Key Amenities: ${amenities.join(", ")}

Generate three pieces of information in a specific JSON format:
1. A "title" for the listing (under 60 characters).
2. A "description" (40–60 words) that is friendly and inviting. Mention the location and a key amenity.
3. A "suggestedPrice" (number only). Suggest a reasonable nightly price for a ${type} with ${bedrooms} bedrooms in ${address}. Use a whole number.

IMPORTANT:
Respond with ONLY a valid JSON object with the keys:
"title", "description", and "suggestedPrice".
Do not include any other text or markdown.
`,
        },
      ];

    // Call the OpenAI Chat Completions API
    const openaiResponse = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: promptMessages,
      temperature: 0.7,
      max_tokens: 300,
      response_format: { type: "json_object" },
    });

    const generatedContent =
      openaiResponse.choices[0].message.content;

    if (!generatedContent) {
      throw new Error("OpenAI did not return any content.");
    }

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
    console.error(
      "AI generation failed:",
      error.message || error
    );
    console.error(
      "Full error details:",
      error.response?.data || error
    );

    let errorMessage = "Failed to generate AI listing.";

    if (error instanceof OpenAI.APIError) {
      errorMessage += ` OpenAI API Error: ${error.status} - ${error.message}`;
    } else if (error.message?.includes("JSON.parse")) {
      errorMessage +=
        " AI generated invalid JSON. Please refine the prompt or try again.";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: error.status || 500 }
    );
  }
}
