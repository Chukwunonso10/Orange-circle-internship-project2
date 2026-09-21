import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function listAndTest() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return;

  const genAI = new GoogleGenerativeAI(apiKey);

  const candidateModels = [
    "gemini-1.5-flash",
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-3.6-flash"
  ];

  console.log("=== DETAILED MODEL TEST ===");
  for (const m of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const res = await model.generateContent("Ping");
      console.log(`✅ Model '${m}' IS WORKING! Response: ${res.response.text().trim()}`);
    } catch (err: any) {
      console.log(`\n❌ Model '${m}':`);
      console.log(err);
    }
  }
}

listAndTest();
