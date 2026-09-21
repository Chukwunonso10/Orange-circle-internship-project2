import "dotenv/config";
import prisma from "./app/lib/prisma";
import { askOgaBizSense } from "./app/lib/ai/coach";

async function testGroqAndFallback() {
  const user = await prisma.user.findFirst();
  if (!user) return;

  console.log("Testing Oga BizSense response...");
  const reply = await askOgaBizSense("How my market dey go this week?", user.id);
  console.log("\nOga BizSense Reply:\n", reply);
  process.exit(0);
}

testGroqAndFallback();
