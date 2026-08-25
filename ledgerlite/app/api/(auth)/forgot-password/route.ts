import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import crypto from "crypto";
import { Sendsms } from "@/app/lib/sendSms";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
    try {
        const { email, phoneNumber } = await req.json();

        if (!email && !phoneNumber) {
            return NextResponse.json({
                success: false, message: "Email or phone number is required"
            }, { status: 400 });
        }

        let user = null;  

        if (email) {
            const lowerEmail = email.toLowerCase().trim();
            user = await prisma.user.findUnique({ where: { email: lowerEmail } });

            if (!user) {
                return NextResponse.json({
                    success: false, message: "Account not found"
                }, { status: 404 });
            }

            const token = crypto.randomUUID();
            const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetToken: token,
                    resetTokenExpiresAt: expires,
                }
            });

            // Send password reset email
            const resetLink = `${process.env.HOSTED_URL || "http://localhost:3000"}/forgotpassword?token=${token}`;
            const resend = new Resend(process.env.RESEND_API_KEY);
            
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: user.email,
                subject: "Reset your LedgerLite password",
                html: `<p>Hello ${user.name},</p>
                       <p>You requested a password reset. Please click the link below to set a new password. The link is valid for 1 hour.</p>
                       <p><a href="${resetLink}">Reset Password</a></p>
                       <p>If you did not request this, please ignore this email.</p>`
            });

            return NextResponse.json({
                success: true, message: "Password reset link sent to your email"
            });

        } else if (phoneNumber) {
            let phoneDigits = phoneNumber.trim();
            if (phoneDigits.startsWith("0")) {
                phoneDigits = phoneDigits.substring(1);
            }
            const standardizedPhone = phoneDigits.startsWith("+") ? phoneDigits : `+234${phoneDigits}`;
 
            user = await prisma.user.findUnique({ where: { phoneNumber: standardizedPhone } });

            if (!user) {
                return NextResponse.json({
                    success: false, message: "Account not found"
                }, { status: 404 });
            }

            const otp = crypto.randomInt(100000, 1000000).toString();
            const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetToken: otp,
                    resetTokenExpiresAt: expires,
                }
            });

            // Send SMS via Twilio
            await Sendsms(standardizedPhone, `Your LedgerLite password reset code is ${otp}. Valid for 10 minutes.`);

            return NextResponse.json({
                success: true, message: "Password reset OTP sent to your phone number"
            });
        }

    } catch (error: any) {
        console.error("Forgot password error:", error);
        return NextResponse.json({
            success: false, message: "Internal server error"
        }, { status: 500 });
    }
}
