import { cookies } from "next/headers";
import prisma from "./prisma";
import { NextResponse } from "next/server";

export async function getCurrentUserId(){
  try {
    
    const cookiesStore = await cookies()
    const sessionToken = cookiesStore.get("sessionToken")?.value

    if(!sessionToken)return null;

    const session = await prisma.session.findUnique({
        where: {sessionToken}
    })

    if (!session)return null

    if (session && session.expiresAt < new Date()){
        await prisma.session.delete({where: {sessionToken}})

        return null
    }

    const userId = session.userId
    return userId;
  } catch (error) {
    console.error("authentication error: unable to validate session")
    return null
  }
}