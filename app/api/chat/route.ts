import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    return NextResponse.json(
      {
        error: "AI functionality is temporarily unavailable for maintenance. Please try again later.",
      },
      { status: 503 },
    )
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 })
  }
}
