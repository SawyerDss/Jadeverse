import { NextResponse } from "next/server"
import { DEFAULT_GAMES } from "@/lib/default-games-data"

export async function GET() {
  try {
    return NextResponse.json(DEFAULT_GAMES)
  } catch (error) {
    console.error("Error fetching games:", error)
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 })
  }
}
