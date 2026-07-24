import { getCurrentUserId } from "@/app/lib/authhelper";
import prisma from "@/app/lib/prisma";
import { Sendsms } from "@/app/lib/sendSms";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"

export async function POST(req: NextRequest) {
    const userId = await getCurrentUserId()
    if (!userId) {
        return NextResponse.json({
            success: false, message: "Unauthorized!!"
        }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
        return NextResponse.json({
            success: false, message: "user Not Found!"
        }, { status: 404 })
    }

    const { phoneNumber } = await req.json()
    if (!phoneNumber) {
        return NextResponse.json({
            success: false, message: "pls enter a phoneNumber!"
        }, { status: 400 })
    }

    // 1. Phone number validation (Regex supporting standard E.164 formats, e.g. +14155552671)
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    const standardizedPhone = phoneNumber.trim().replace(/\s+/g, '');

    if (!e164Regex.test(standardizedPhone)) {
        return NextResponse.json({
            success: false,
            error: 'Invalid phone number format. Must use E.164 standard (e.g. +14155552671 with country prefix).'
        }, { status: 400 });
    }
   

    const phoneIsTaken = await prisma.user.findFirst({
        where: {
            id: { not: user.id },
            phoneNumberIsVerified: true,
            phoneNumber: standardizedPhone
        }
    })

    if (phoneIsTaken) {
        return NextResponse.json({
            success: true, message: `This Phone number ${user.phoneNumber} is already verified by another account `
        })
    }

    if (user.lastPhoneSmsSent) {
        const elapsedSeconds = (new Date().getTime() - new Date(user.lastPhoneSmsSent).getTime()) / 1000
        if (elapsedSeconds < 60) {
            const remaining = Math.ceil(60 - elapsedSeconds)
            return NextResponse.json({
                success: false, message: `you still have ${remaining} remaining before the next attempt`
            }, { status: 429 })
        }
    }


    let dailyCount = user.dailySmsCount;
    let dailyReset = user.dailyPhoneSmsReset

    if(!dailyReset || new Date() > new Date(dailyReset)){
        dailyCount = 0
        dailyReset = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    }

    if(dailyCount > 5){
        return NextResponse.json({
            success: false, message: "you have reached the maximum of 5 verification attempts allowed per day, try again tomorrow"
        }, {status: 429})
    }



    const otp = crypto.randomInt(100000, 1000000)
    const expiry = new Date(new Date().getTime() + 3 * 60 * 1000)
    




    
    const messageBody = `Your verification code is: ${otp}. It will expire in 3 minutes.`

    await Sendsms(standardizedPhone, messageBody)


}