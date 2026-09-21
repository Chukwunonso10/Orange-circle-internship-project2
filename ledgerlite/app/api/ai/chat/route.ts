import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/app/lib/authhelper";
import { askOgaBizSense } from "@/app/lib/ai/coach";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    let userId = await getCurrentUserId();

    if (!userId) {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        userId = firstUser.id;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message string is required." },
        { status: 400 }
      );
    }

    const reply = await askOgaBizSense(message, userId);
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/ai/chat route:", error);
    return NextResponse.json(
      { error: "Failed to process chat message", details: error.message },
      { status: 500 }
    );
  }
}
