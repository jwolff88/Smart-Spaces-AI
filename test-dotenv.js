// test-dotenv.js
try {
  console.log("Starting dotenv test...");

  const dotenv = require('dotenv');
  const path = require('path');

  const envPath = path.resolve(__dirname, '.env.local');
  console.log(`Attempting to load environment variables from: ${envPath}`);

  // Enable debug mode to see verbose output from dotenv
  const result = dotenv.config({ path: envPath, debug: true });

  if (result.error) {
    console.error("\n--- DOTENV FAILED TO LOAD ---");
    throw result.error;
  }

  console.log("\n--- DOTENV PARSED THE FOLLOWING ---");
  console.log(result.parsed);
  console.log("---------------------------------");


  console.log("\n--- VERIFYING process.env ---");
  if (process.env.GEMINI_API_KEY) {
    console.log("SUCCESS: GEMINI_API_KEY was found in process.env.");
    // To be safe, let's not print the key itself, just that it was found.
    console.log("Key starts with:", process.env.GEMINI_API_KEY.substring(0, 8) + "...");
  } else {
    console.error("FAILURE: GEMINI_API_KEY was NOT found in process.env.");
  }
  console.log("----------------------------");

} catch (e) {
  console.error("\nAn unexpected error occurred during the test:", e);
}
