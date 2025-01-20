import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

async function trackAnalytics(request: NextRequest, ip: string) {
  try {
    const date = new Date().toISOString().split("T")[0];
    const path = request.nextUrl.pathname;
    await redis.hincrby(`analytics:${date}`, `pageviews:${path}`, 1);
    await redis.sadd(`analytics:${date}:visitors`, ip);
  } catch (error) {
    // Silently fail analytics to keep site running
    console.error("Analytics error:", error);
  }
}

export async function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

  try {
    // Track analytics
    await trackAnalytics(request, ip);

    // Rate limiting
    const { success, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_${ip}`
    );

    const response = success
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/api/blocked", request.url));

    // Add rate limit info to headers
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", reset.toString());

    return response;
  } catch (error) {
    // If Redis fails, allow the request through
    console.error("Rate limit error:", error);
    return NextResponse.next();
  }
}

// Only run rate limiting on these paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
