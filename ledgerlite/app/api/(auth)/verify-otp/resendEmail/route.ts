import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { VerificationEmail } from "@/app/lib/verificationEmail";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found!" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({
        success: false, 
        message: "User is already verified"
      }, { status: 400 });
    }

    // Generate new OTP (valid for 3 minutes)
    const verificationToken = crypto.randomInt(100000, 1000000).toString();
    const expires = new Date(Date.now() + 3 * 60 * 1000);

    // Save the new OTP code and expiration to the database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        expiresAt: expires
      }
    });

    let emailSent = false;
    try {
      await VerificationEmail(email, verificationToken);
      emailSent = true;
    } catch (err) {
      console.error("Email sending failed:", err);
    }

    return NextResponse.json({
      success: true, 
      message: "Verification code successfully resent to email", 
      emailSent
    }, { status: 200 });

  } catch (error) {
    console.error("Resend endpoint error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}