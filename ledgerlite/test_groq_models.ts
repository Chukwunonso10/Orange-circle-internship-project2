import "dotenv/config";
import Groq from "groq-sdk";

async function testGroqModels() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return;

  const groq = new Groq({ apiKey });

  const modelsToTest = [
    "llama-3.1-8b-instant",
    "llama-3.2-3b-preview",
    "llama-3.2-1b-preview",
    "llama-3.3-70b-versatile",
    "deepseek-r1-distill-llama-70b"
  ];

  for (const m of modelsToTest) {
    try {
      console.log(`Testing Groq model '${m}'...`);
      const res = await groq.chat.completions.create({
        messages: [{ role: "user", content: "Say hello in one word." }],
        model: m,
      });
      console.log(`✅ SUCCESS with Groq '${m}':`, res.choices[0]?.message?.content?.trim());
      return;
    } catch (err: any) {
      console.error(`❌ FAILED Groq '${m}':`, err.message);
    }
  }
}

testGroqModels();
