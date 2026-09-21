import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function testModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Testing API Key starting with:", apiKey ? apiKey.substring(0, 10) + "..." : "NONE");

  if (!apiKey) return;

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const modelsToTest = [
    "gemini-3.6-flash",
    "gemini-3.1-pro-preview"
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`\nTesting model '${modelName}'...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const res = await model.generateContent("Say hello in one word.");
      console.log(`✅ SUCCESS with '${modelName}':`, res.response.text().trim());
      return;
    } catch (err: any) {
      console.error(`❌ FAILED '${modelName}':`, err.message || err);
    }
  }
}

testModels();
