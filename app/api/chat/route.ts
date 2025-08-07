import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set")
      return new Response("API key not configured", { status: 500 })
    }

    const result = await streamText({
      model: groq("llama-3.1-8b-instant"), // Ensure this model is still supported by Groq
      messages,
      system: `You are s0lara AI, a helpful and knowledgeable assistant created for the s0lara gaming platform. You can help with:

- Math problems and calculations
- English grammar, writing, and literature
- Science concepts and explanations
- General knowledge questions
- Homework help
- Creative writing
- Problem-solving
- Gaming tips and strategies
- Technology questions

Be friendly, clear, and educational in your responses. Always aim to help users learn and understand concepts. Keep your responses concise but informative.`,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}
