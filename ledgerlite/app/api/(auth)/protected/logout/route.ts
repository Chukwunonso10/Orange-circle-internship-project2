import prisma from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {

        const cookiesStore = await cookies()
        const sessionToken = cookiesStore.get("sessionToken")?.value
        try {

            if (sessionToken) {
                await prisma.session.delete({ where: { sessionToken } })
            }
        } catch (error) {
            console.error("Failed to delete session token")
            return NextResponse.json({
                success: false, message: "Error deleting session token"
            })
        }

        cookiesStore.delete("sessionToken")
        return NextResponse.json({
            success: true, message: "logged out successfully"
        }, { status: 200 })
    } catch (error) {
        console.error("Failed to logout", error)
        return NextResponse.json({
            success: false, message: "internal server error"
        }, { status: 500 })
    }
}