import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(
    JSON.stringify({
      error: "Too many requests",
      message: "Please try again in a few seconds",
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
