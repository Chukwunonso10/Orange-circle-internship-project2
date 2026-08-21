import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import crypto from "crypto";
import { Sendsms } from "@/app/lib/sendSms";
import { VerificationEmail } from "@/app/lib/verificationEmail";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({
        success: false, message: "Email is required"
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return NextResponse.json({
        success: false, message: "User not found"
      }, { status: 404 });
    }

    if (user.phoneNumberIsVerified) {
      return NextResponse.json({
        success: false, message: "Phone number already verified"
      }, { status: 400 });
    }

    // Cooldown check (60 seconds)
    if (user.lastPhoneSmsSent) {
      const elapsedSeconds = (Date.now() - new Date(user.lastPhoneSmsSent).getTime()) / 1000;
      if (elapsedSeconds < 60) {
        const remaining = Math.ceil(60 - elapsedSeconds);
        return NextResponse.json({
          success: false,
          message: `Please wait ${remaining} seconds before requesting another OTP.`
        }, { status: 429 });
      }
    }

    
    // Daily limit check
    let dailyCount = user.dailySmsCount;
    let dailyReset = user.dailyPhoneSmsReset ?? new Date(Date.now() + 24 * 60 * 60 * 1000);

    if (new Date() > new Date(dailyReset)) {
      dailyCount = 0;
      dailyReset = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }

    if (dailyCount >= 5) {
      return NextResponse.json({
        success: false,
        message: "You have exceeded the maximum daily OTP requests. Please try again tomorrow."
      }, { status: 429 });
    }

    // Generate new tokens
    const verificationToken = crypto.randomInt(100000, 1000000).toString();
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiry = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes expiration

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        phoneNumberVerificationToken: otp,
        phoneNumberVerifiesExpiresAt: expiry,
        phoneNumberVerificatonAttemps: 0,
        lastPhoneSmsSent: new Date(),
        dailyPhoneSmsReset: dailyReset,
        dailySmsCount: dailyCount + 1,
      }
    });

    // Send Email
    let emailSent = false;
    try {
      await VerificationEmail(user.email, verificationToken);
      emailSent = true;
    } catch (err) {
      console.error("Resend Email failed:", err);
    }

    // Send SMS
    let smsSent = false;
    if (user.phoneNumber) {
      try {
        const messageBody = `Your verification code is: ${otp}. It expires in 3 minutes.`;
        await Sendsms(user.phoneNumber, messageBody);
        smsSent = true;
      } catch (err) {
        console.error("Resend SMS failed:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Verification code resent successfully.",
      emailSent,
      smsSent
    });

  } catch (error: any) {
    console.error("Resend OTP error:", error);
    return NextResponse.json({
      success: false, message: "Internal server error"
    }, { status: 500 });
  }
}
