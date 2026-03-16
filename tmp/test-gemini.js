const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not found in .env");
    return;
  }
  
  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Testing with a known valid name first
  
  try {
    const result = await model.generateContent("Hello, how are you?");
    const response = await result.response;
    console.log("SUCCESS: Gemini API is responding.");
    console.log(response.text());
    
    // Now test the specific model name used in the code
    const previewModel = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    try {
      const previewResult = await previewModel.generateContent("Test check");
      const previewResponse = await previewResult.response;
      console.log("SUCCESS: gemini-3-flash-preview is also responding.");
    } catch (e) {
      console.error("WARNING: gemini-3-flash-preview failed, but API key is valid. Detail:", e.message);
    }
    
  } catch (err) {
    console.error("FAILURE: Gemini API error:", err.message);
  }
}

test();
