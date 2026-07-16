import { HashPassword } from "@/app/lib/hashpassword";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import { VerificationEmail } from "@/app/lib/verificationEmail";

export async function POST(req: NextRequest) {
    try {
        const { firstName, lastName, email, password } = await req.json()

        if (!firstName || !lastName || !password || !email) {
            return NextResponse.json({
                success: false, message: "Bad Request: name is required!"
            }, { status: 400 })
        }

        //validating that the email conforms to standard
        const regexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!regexPattern.test(email)) {
            return NextResponse.json({
                success: false, message: "invalid email address"
            }, { status: 400 })
        }

        if (password < 8) {
            return NextResponse.json({
                success: false, message: "password must be atleast 8 characters"
            }, { status: 400 })
        }
        const userExist = await prisma.user.findUnique({
            where: { email }
        })


        const hashedPassword = await HashPassword(password)

        const verificationToken = crypto.randomInt(100000, 1000000).toString()
        let userId;
        if (userExist) {
            if (userExist.isVerified) {
                return NextResponse.json({
                    success: false, message: "A user with this account already Exists"
                }, { status: 400 })
            }
            console.log(`user with email ${email} is unverified and retry has been initiated`)
            const updatedUser = await prisma.user.update({
                where: { id: userExist.id },
                data: {
                    passwordHash: hashedPassword,
                    verificationToken: verificationToken
                }
            })
            userId = updatedUser.id
        } else {
            const user = await prisma.user.create({
                data: {
                    email: email,
                    firstName,
                    lastName,
                    passwordHash: hashedPassword,
                    isVerified: false,
                    verificationToken,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
                }
            })
            userId = user.id

        }
        let sendMail;
        try {
            sendMail = await VerificationEmail(email, verificationToken)
        } catch (error) {
            console.error("failed to send emails")
        }

        return NextResponse.json({
            success: true, message: "user Account successfully created. verification email sent!", userId, sendMail
        }, { status: 201 })

    } catch (error) {
        console.error("failed to create an account", error)
        return NextResponse.json({
            success: false, message: "internal server error"
        }, { status: 500 })
    }
}
