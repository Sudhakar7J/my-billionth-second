import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();

export async function GET() {
  try {
    const date = new Date().toISOString().split("T")[0];

    const [pageViews, uniqueVisitors] = await Promise.all([
      redis.hgetall(`analytics:${date}`),
      redis.scard(`analytics:${date}:visitors`),
    ]);

    return NextResponse.json({
      date,
      pageViews,
      uniqueVisitors,
      status: "success",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Analytics temporarily unavailable",
        status: "error",
      },
      { status: 503 }
    );
  }
}
