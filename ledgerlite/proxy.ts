import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest){
    const pathname = req.nextUrl.pathname
    const protectedRoute = pathname.startsWith("/api/protected")
    const dashboardRoute = pathname.startsWith("/dashboard")
    const expenseRoute = pathname.startsWith("/expense")
    const summeryRoute = pathname.startsWith("/export-summery")
    const itemRoute = pathname.startsWith("/item")
    const profileRoute = pathname.startsWith("/profile")
    const salesRoute = pathname.startsWith("/sales")

    if(!protectedRoute && !dashboardRoute && !expenseRoute && !summeryRoute && !itemRoute && !profileRoute && !salesRoute ){
        return NextResponse.next()
    }

    const sessionToken = req.cookies.get("sessionToken")?.value
    if(!sessionToken){
        let reason = "not authenticated"
        if(protectedRoute){
            return NextResponse.json({
                success: false, message: `${reason}, log in`
            }, {status: 401})
        }

        const url = req.nextUrl.clone()
        url.pathname = "/signin"
        url.searchParams.set("reason", reason)
        url.searchParams.set("error", "Unauthorized")

        return NextResponse.redirect(url)
        
    }

    return NextResponse.next()
}

export const config = {
    match: ["/dashboard:path*", "/api/protected/:path*"]
}