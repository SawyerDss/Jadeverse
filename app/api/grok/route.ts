import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    // Simulate a delay to make it feel more realistic
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate a response based on the message
    const response = generateResponse(message)

    return NextResponse.json({ text: response })
  } catch (error) {
    console.error("Error in Grok API:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}

function generateResponse(message: string): string {
  // Simple keyword-based response system
  const lowerMessage = message.toLowerCase()

  // Greetings
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    return "Hello! I'm JadeAI powered by Grok. How can I help you today?"
  }

  // Questions about the system
  if (lowerMessage.includes("who are you") || lowerMessage.includes("what are you")) {
    return "I'm JadeAI, an AI assistant powered by Grok technology. I'm here to help you with information, answer questions, and assist with various tasks."
  }

  // Math related
  if (lowerMessage.includes("calculate") || lowerMessage.includes("math") || /\d+\s*[+\-*/]\s*\d+/.test(lowerMessage)) {
    // Extract numbers and operation
    const mathExpression = lowerMessage.match(/(\d+)\s*([+\-*/])\s*(\d+)/)
    if (mathExpression) {
      const num1 = Number.parseInt(mathExpression[1])
      const operator = mathExpression[2]
      const num2 = Number.parseInt(mathExpression[3])

      let result
      switch (operator) {
        case "+":
          result = num1 + num2
          break
        case "-":
          result = num1 - num2
          break
        case "*":
          result = num1 * num2
          break
        case "/":
          result = num1 / num2
          break
      }

      return `The result of ${num1} ${operator} ${num2} is ${result}.`
    }

    return "I can help with math problems. Could you provide a specific calculation?"
  }

  // Programming related
  if (
    lowerMessage.includes("code") ||
    lowerMessage.includes("programming") ||
    lowerMessage.includes("javascript") ||
    lowerMessage.includes("python")
  ) {
    if (lowerMessage.includes("javascript") && lowerMessage.includes("function")) {
      return `Here's a simple JavaScript function:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}! Welcome to JadeVerse.\`;
}

// Example usage
const message = greet('User');
console.log(message);
\`\`\`

You can use functions to organize and reuse code.`
    }

    if (lowerMessage.includes("python")) {
      return `Here's a simple Python example:

\`\`\`python
def greet(name):
    return f"Hello, {name}! Welcome to JadeVerse."

# Example usage
message = greet("User")
print(message)
\`\`\`

Python is known for its readability and versatility.`
    }

    return "I can help with programming questions. Could you specify which language or concept you're interested in?"
  }

  // Games related
  if (lowerMessage.includes("game") || lowerMessage.includes("play")) {
    return "JadeVerse has a variety of games you can play! You can browse the Games Library to find something you enjoy, or even add your own games."
  }

  // Help with homework
  if (lowerMessage.includes("homework") || lowerMessage.includes("assignment") || lowerMessage.includes("study")) {
    return "I'd be happy to help with your homework or studies. What subject are you working on? Math, science, history, or something else?"
  }

  // Default response for unrecognized queries
  return "I'm here to help! Could you provide more details about what you'd like to know or what you need assistance with?"
}
