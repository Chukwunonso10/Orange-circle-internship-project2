import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/app/lib/authhelper";
import { getAiAlerts } from "@/app/lib/ai/predictor";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    let userId = await getCurrentUserId();

    // Demo/Development fallback: If no active session, pick the first user
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

    const alerts = await getAiAlerts(userId);
    return NextResponse.json({ alerts });
  } catch (error: any) {
    console.error("Error in /api/ai/alerts route:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI alerts", details: error.message },
      { status: 500 }
    );
  }
}
