import 'dotenv/config';
import OpenAI from "openai"; // Import OpenAI SDK

async function runTest() {
  console.log("Starting OpenAI API test...");

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const OPENAI_MODEL = "gpt-3.5-turbo";

  if (!OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY environment variable is not set.");
    return;
  }
  console.log("OpenAI API Key found.");
  console.log(`Attempting to use model: ${OPENAI_MODEL}`);

  try {
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    
    const promptMessages = [
      {
        role: "user",
        content: "Write a short, compelling tagline for a smart home rental company.",
      },
    ];

    console.log("Generating content...");
    const openaiResponse = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: promptMessages,
      temperature: 0.7,
      max_tokens: 50,
    });

    const generatedText = openaiResponse.choices[0].message.content;
    
    if (!generatedText) {
        throw new Error("OpenAI did not return any content.");
    }

    console.log("\n--- SUCCESS ---");
    console.log("AI Response:", generatedText);
    console.log("-----------------");
    console.log("\nConclusion: Your OpenAI API key and model access are working correctly!");

  } catch (error) {
    console.error("\n--- TEST FAILED ---");
    console.error("An error occurred:", error.message || error);
    if (error instanceof OpenAI.APIError) {
        console.error(`OpenAI API Error: ${error.status} - ${error.message}`);
    }
    console.error("\nConclusion: There is an issue with your OpenAI API key, billing, or network access.");
  }
}

runTest();