"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNotification } from "@/lib/notification-context"
import { Send, BotIcon as Robot, Sparkles, BookOpen, Calculator, Globe, Code, Lightbulb } from "lucide-react"
import AnimatedText from "@/components/animated-text"

type Message = {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

// Sample responses for various topics
const AI_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hello! I'm JadeAI. How can I assist you today?",
    "Hi there! Welcome to JadeVerse. What can I help you with?",
    "Greetings! I'm here to help with your questions. What would you like to know?",
  ],
  math: [
    "To solve this equation, you need to isolate the variable by performing the same operation on both sides.",
    "When working with quadratic equations, remember the formula: x = (-b ± √(b² - 4ac)) / 2a",
    "For calculus problems, start by identifying whether you need to use differentiation or integration.",
    "Remember that the derivative of sin(x) is cos(x), and the derivative of cos(x) is -sin(x).",
    "When solving probability problems, make sure to identify the total number of possible outcomes first.",
  ],
  science: [
    "The periodic table is organized by atomic number, which is the number of protons in an atom's nucleus.",
    "Newton's three laws of motion are fundamental principles in physics that describe the relationship between an object and the forces acting upon it.",
    "In biology, cells are the basic structural and functional units of all living organisms.",
    "Chemical reactions involve the breaking and forming of bonds between atoms.",
    "The scientific method is a systematic approach to research that involves observation, hypothesis formation, experimentation, and conclusion.",
  ],
  history: [
    "The Renaissance was a period of European cultural, artistic, political, and scientific rebirth that followed the Middle Ages.",
    "World War II lasted from 1939 to 1945 and involved many of the world's nations forming two opposing military alliances.",
    "The Industrial Revolution was a period of major industrialization and innovation that took place during the late 1700s and early 1800s.",
    "The Civil Rights Movement in the United States was a decades-long struggle to end racial discrimination and segregation.",
    "Ancient civilizations like Egypt, Greece, and Rome made significant contributions to art, architecture, philosophy, and governance systems.",
  ],
  programming: [
    "In programming, variables are used to store data that can be referenced and manipulated in a computer program.",
    "Functions allow you to group code that performs a specific task, making your code more organized and reusable.",
    "Loops are used to execute a block of code multiple times, which is useful for iterating through data.",
    "Object-oriented programming (OOP) is a programming paradigm based on the concept of 'objects', which can contain data and code.",
    "Debugging is the process of finding and resolving bugs or defects in a computer program.",
    "JavaScript is a dynamic programming language that's commonly used for web development.",
    "Python is known for its readability and versatility, making it popular for beginners and experienced developers alike.",
  ],
  games: [
    "Video games have evolved significantly since the early days of Pong and Space Invaders.",
    "Game development often involves programming, art design, music composition, and storytelling.",
    "Many games use physics engines to create realistic movements and interactions.",
    "Esports has grown into a billion-dollar industry with professional players competing worldwide.",
    "JadeVerse offers a curated selection of games across different genres for you to enjoy!",
  ],
  default: [
    "I'm here to help! Could you provide more details about what you'd like to know?",
    "I'd be happy to assist with that. Could you elaborate a bit more?",
    "Interesting question! Let me help you find the answer to that.",
    "I'm JadeAI, your assistant in JadeVerse. How can I help you today?",
  ],
}

// Helper function to determine the response category based on the query
function getResponseCategory(query: string): string {
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes("hi") || lowerQuery.includes("hello") || lowerQuery.includes("hey")) {
    return "greeting"
  } else if (lowerQuery.includes("math") || lowerQuery.includes("equation") || lowerQuery.includes("calculate")) {
    return "math"
  } else if (lowerQuery.includes("science") || lowerQuery.includes("physics") || lowerQuery.includes("biology")) {
    return "science"
  } else if (lowerQuery.includes("history") || lowerQuery.includes("war") || lowerQuery.includes("revolution")) {
    return "history"
  } else if (
    lowerQuery.includes("code") ||
    lowerQuery.includes("programming") ||
    lowerQuery.includes("javascript") ||
    lowerQuery.includes("python")
  ) {
    return "programming"
  } else if (lowerQuery.includes("game") || lowerQuery.includes("play") || lowerQuery.includes("gaming")) {
    return "games"
  } else {
    return "default"
  }
}

// Get a random response based on the category
function getRandomResponse(category: string): string {
  const responses = AI_RESPONSES[category] || AI_RESPONSES.default
  return responses[Math.floor(Math.random() * responses.length)]
}

export default function JadeAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm JadeAI, your personal assistant in JadeVerse. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { addNotification } = useNotification()

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI typing
    setIsTyping(true)

    // Determine the response category based on user input
    const category = getResponseCategory(input)

    // Simulate AI response after a delay
    setTimeout(
      () => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: getRandomResponse(category),
          sender: "ai",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsTyping(false)

        // Add notification for new AI response
        addNotification({
          title: "JadeAI Response",
          message: "JadeAI has responded to your message",
          type: "info",
          duration: 3000,
        })
      },
      1000 + Math.random() * 2000,
    )
  }

  // Handle quick topic selection
  const handleQuickTopic = (topic: string) => {
    const topicMessages: Record<string, string> = {
      math: "Can you help me with math?",
      science: "Tell me something about science",
      history: "I'm interested in history",
      programming: "I want to learn programming",
      games: "Tell me about games",
    }

    setInput(topicMessages[topic])
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Robot className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            <AnimatedText text="JadeAI" className="text-gradient" />
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar with topic options */}
          <div className="md:col-span-1">
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-white">Topics</CardTitle>
                <CardDescription>Get help with various subjects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => handleQuickTopic("math")}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Mathematics
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => handleQuickTopic("science")}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Science
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => handleQuickTopic("history")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  History
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => handleQuickTopic("programming")}
                >
                  <Code className="mr-2 h-4 w-4" />
                  Programming
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => handleQuickTopic("games")}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Games
                </Button>
              </CardContent>
            </Card>

            <Card className="glass border-primary/20 mt-4">
              <CardHeader>
                <CardTitle className="text-xl text-white">Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-primary mt-1" />
                  <p>Be specific with your questions for better answers</p>
                </div>
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-primary mt-1" />
                  <p>Ask follow-up questions to get more details</p>
                </div>
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-primary mt-1" />
                  <p>JadeAI can help with homework and general knowledge</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat area */}
          <div className="md:col-span-3">
            <Card className="glass border-primary/20 h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl text-white">Chat with JadeAI</CardTitle>
                <CardDescription>Your personal AI assistant</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-primary/20 border border-primary/30"
                            : "bg-gray-800/50 border border-gray-700/30"
                        }`}
                      >
                        {message.sender === "ai" && (
                          <div className="flex items-center mb-1">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                              <Robot className="h-3 w-3 text-primary" />
                            </div>
                            <span className="text-xs font-medium text-primary/80">JadeAI</span>
                          </div>
                        )}
                        <p className="text-white">{message.content}</p>
                        <p className="text-xs text-white/50 mt-1 text-right">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-gray-800/50 border border-gray-700/30">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                            <Robot className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-xs font-medium text-primary/80">JadeAI</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-2">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                          <div
                            className="w-2 h-2 rounded-full bg-primary animate-pulse"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-primary animate-pulse"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <div className="p-4 border-t border-primary/20">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask JadeAI anything..."
                    className="flex-1 bg-black/50 border-primary/30 focus:border-primary"
                  />
                  <Button type="submit" disabled={!input.trim() || isTyping}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
