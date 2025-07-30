import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    console.log("Received messages for AI chat:", messages) // Added for debugging

    const result = await streamText({
      model: groq("llama-3.1-70b-versatile"),
      messages,
      system: `You are s0lara AI, a helpful and knowledgeable assistant. You can help with:
- Math problems and calculations
- English grammar, writing, and literature
- Science concepts and explanations
- General knowledge questions
- Homework help
- Creative writing
- Problem-solving

Be friendly, clear, and educational in your responses. Always aim to help users learn and understand concepts.`,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    // Provide a more specific error message if possible, or log more details
    return new Response(`Internal Server Error: ${error instanceof Error ? error.message : String(error)}`, {
      status: 500,
    })
  }
}
