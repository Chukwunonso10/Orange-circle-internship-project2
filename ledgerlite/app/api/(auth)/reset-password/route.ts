import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { HashPassword } from "@/app/lib/hashpassword";

export async function POST(req: NextRequest) {
    try {
        const { token, phoneNumber, otp, password } = await req.json();

        if (!password || password.length < 8) {
            return NextResponse.json({
                success: false, message: "Password must be at least 8 characters long"
            }, { status: 400 });
        }

        let user = null;

        if (token) {
            // Email recovery flow
            user = await prisma.user.findUnique({
                where: { resetToken: token }
            });

            if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
                return NextResponse.json({
                    success: false, message: "Invalid or expired reset token"
                }, { status: 400 });
            }
        } else if (phoneNumber && otp) {
            // SMS recovery flow
            let phoneDigits = phoneNumber.trim();
            if (phoneDigits.startsWith("0")) {
                phoneDigits = phoneDigits.substring(1);
            }
            const standardizedPhone = phoneDigits.startsWith("+") ? phoneDigits : `+234${phoneDigits}`;

            user = await prisma.user.findUnique({
                where: { phoneNumber: standardizedPhone }
            });

            if (!user || user.resetToken !== otp || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
                return NextResponse.json({
                    success: false, message: "Invalid or expired reset OTP code"
                }, { status: 400 });
            }
        } else {
            return NextResponse.json({
                success: false, message: "Missing reset credentials"
            }, { status: 400 });
        }

        // Hash new password and save it
        const hashedPassword = await HashPassword(password);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: hashedPassword,
                resetToken: null,
                resetTokenExpiresAt: null,
            }
        });

        return NextResponse.json({
            success: true, message: "Password reset successfully"
        });

    } catch (error: any) {
        console.error("Reset password error:", error);
        return NextResponse.json({
            success: false, message: "Internal server error"
        }, { status: 500 });
    }
}
