export async function POST(req: Request) {
  try {
    return new Response(
      JSON.stringify({
        error: "AI functionality temporarily disabled due to dependency issues",
        message: "s0lara AI is currently undergoing maintenance. Please try again later.",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
