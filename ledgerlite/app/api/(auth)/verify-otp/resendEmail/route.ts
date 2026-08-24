import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import { VerificationEmail } from "@/app/lib/verificationEmail";
export async function POST(req: NextRequest) {
    const { email } = await req.json()

    if (!email) {
        return NextResponse.json({ success: false, message: "email is required" })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        return NextResponse.json({ success: false, message: "user not found!!" })
    }

    if (user.isVerified) {

        await prisma.user.update({
            where: { id: user.id },
            data: {
                verificationToken: null,
                expiresAt: null
            }
        })
        return NextResponse.json({
            success: false, message: "user is already verified"
        }, { status: 200 })
    }

    const verificationToken = crypto.randomInt(100000, 1000000).toString()
    const sessionToken = crypto.randomUUID()
    const expires = new Date(Date.now() + 3 * 60 * 1000)
    const isProduction = process.env.NODE_ENV === "production"

    await prisma.user.update({
        where: { id: user.id },
        data: {
            verificationToken,
            expiresAt: expires
        }
    })

    let emailSent = false;

    try {
        await VerificationEmail(email, verificationToken);
        emailSent = true;
    } catch (err) {
        console.error("Email sending failed:", err);
    }

    await prisma.session.create({
        data: {
            userId: user.id,
            sessionToken,
            expiresAt: expires

        }
    })

    const response = NextResponse.json({
        success: true, message: "code successfully resent to email", emailSent: emailSent
    }, { status: 200 })

    response.cookies.set(sessionToken, sessionToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 3 * 60

    })

    return response
}