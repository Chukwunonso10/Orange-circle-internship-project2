import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

export async function proxy(req: NextRequest) {
    const pathname = req.nextUrl.pathname
    const sessionToken = req.cookies.get("sessionToken")?.value
    const isProduction = process.env.NODE_ENV === "production"
    const ip = isProduction ? req.headers.get("x-forwarded-for") : (req as any).ip || "127.0.0.1"
    console.log("My Ip address", ip)
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN
    let ratelimit: Ratelimit | null = null

    if (upstashToken && upstashUrl) {

        const redis = new Redis({
            url: upstashUrl,
            token: upstashToken
        })

        ratelimit = new Ratelimit({
            redis: redis,
            limiter: Ratelimit.slidingWindow(1, "1 m"),
            analytics: true
        })
    }

    const rateLimitRoute = pathname.startsWith("/api/sign-up")
    const protectedRoute = pathname.startsWith("/api/protected")
    const dashboardRoute = pathname.startsWith("/dashboard")
    const expenseRoute = pathname.startsWith("/expense")
    const summeryRoute = pathname.startsWith("/export-summery")
    const itemRoute = pathname.startsWith("/item")
    const profileRoute = pathname.startsWith("/profile")
    const salesRoute = pathname.startsWith("/sales")

    if (rateLimitRoute && ratelimit) {
        const { success, limit, remaining, reset } = await ratelimit.limit(ip)
        if (!success) {
        
            return NextResponse.json({ success: true, message: "Too many attempts, try again in a mins" }, {
                status: 429, headers: {
                    "Content-Type": "application/json",
                    "x-RateLimit-Limit": limit.toString(),
                    "x-RateLimit-Remaining": remaining.toString(),
                    "x-RateLimit-Reset": reset.toString(),
    
                }
            })
        }

    }
    if (!protectedRoute && !dashboardRoute && !expenseRoute && !summeryRoute && !itemRoute && !profileRoute && !salesRoute) {
        return NextResponse.next()
    }

    if (!sessionToken) {
        let reason = "not authenticated"
        if (protectedRoute) {
            return NextResponse.json({
                success: false, message: `${reason}, log in`
            }, { status: 401 })
        }
        //checks
        const url = req.nextUrl.clone()
        url.pathname = "/signin"
        url.searchParams.set("reason", reason)
        url.searchParams.set("error", "Unauthorized")
        return NextResponse.redirect(url)

    }

    return NextResponse.next()
}

export const config = {
    match: ["/dashboard:path*", "/api/protected/:path*", "/expenseRoute:path*", "/summeryRoute:path*", "/itemRoute:path*", "/profileRoute:path*", "/salesRoute:path*"]
}