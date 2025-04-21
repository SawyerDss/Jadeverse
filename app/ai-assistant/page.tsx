"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, BotIcon as Robot, Sparkles, BookOpen, Calculator, Globe, Code, Lightbulb } from "lucide-react"
import AnimatedText from "@/components/animated-text"

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

// Predefined responses for different subjects
const subjectResponses: Record<string, string[]> = {
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
  language: [
    "When writing an essay, make sure to have a clear thesis statement that outlines your main argument.",
    "Grammar rules help maintain clarity and consistency in written communication.",
    "Literary devices like metaphor, simile, and personification add depth and meaning to texts.",
    "When analyzing literature, consider the author's background, the historical context, and the themes presented.",
    "Effective communication involves not just speaking or writing clearly, but also active listening and understanding.",
  ],
  programming: [
    "In programming, variables are used to store data that can be referenced and manipulated in a computer program.",
    "Functions allow you to group code that performs a specific task, making your code more organized and reusable.",
    "Loops are used to execute a block of code multiple times, which is useful for iterating through data.",
    "Object-oriented programming (OOP) is a programming paradigm based on the concept of 'objects', which can contain data and code.",
    "Debugging is the process of finding and resolving bugs or defects in a computer program.",
  ],
}

// Helper function to get a random response based on the query
function getAIResponse(query: string): string {
  const lowerQuery = query.toLowerCase()

  // Check if the query contains keywords related to specific subjects
  if (
    lowerQuery.includes("math") ||
    lowerQuery.includes("equation") ||
    lowerQuery.includes("calculus") ||
    lowerQuery.includes("algebra")
  ) {
    return subjectResponses.math[Math.floor(Math.random() * subjectResponses.math.length)]
  } else if (
    lowerQuery.includes("science") ||
    lowerQuery.includes("physics") ||
    lowerQuery.includes("chemistry") ||
    lowerQuery.includes("biology")
  ) {
    return subjectResponses.science[Math.floor(Math.random() * subjectResponses.science.length)]
  } else if (
    lowerQuery.includes("history") ||
    lowerQuery.includes("war") ||
    lowerQuery.includes("revolution") ||
    lowerQuery.includes("civilization")
  ) {
    return subjectResponses.history[Math.floor(Math.random() * subjectResponses.history.length)]
  } else if (
    lowerQuery.includes("english") ||
    lowerQuery.includes("essay") ||
    lowerQuery.includes("grammar") ||
    lowerQuery.includes("literature")
  ) {
    return subjectResponses.language[Math.floor(Math.random() * subjectResponses.language.length)]
  } else if (
    lowerQuery.includes("code") ||
    lowerQuery.includes("programming") ||
    lowerQuery.includes("function") ||
    lowerQuery.includes("variable")
  ) {
    return subjectResponses.programming[Math.floor(Math.random() * subjectResponses.programming.length)]
  }

  // Default response if no specific subject is detected
  return "I'm here to help with your school work! Could you provide more details about what subject you're studying?"
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "system",
      content: "Hello! I'm your AI study assistant. How can I help with your school work today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI typing
    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(
      () => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: getAIResponse(input),
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 2000,
    )
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Robot className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            <AnimatedText text="AI Assistant" className="text-gradient" />
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar with subject options */}
          <div className="md:col-span-1">
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-white">Subjects</CardTitle>
                <CardDescription>Get help with your studies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => setInput("Help me with math")}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Mathematics
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => setInput("Help me with science")}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Science
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => setInput("Help me with history")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  History
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => setInput("Help me with English")}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Language Arts
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => setInput("Help me with programming")}
                >
                  <Code className="mr-2 h-4 w-4" />
                  Programming
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
                  <p>Ask for step-by-step explanations</p>
                </div>
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-primary mt-1" />
                  <p>Use the AI to check your understanding</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat area */}
          <div className="md:col-span-3">
            <Card className="glass border-primary/20 h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl text-white">Study Assistant</CardTitle>
                <CardDescription>Ask questions about your homework or studies</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-primary/20 border border-primary/30"
                            : message.role === "system"
                              ? "bg-gray-800/50 border border-gray-700/30"
                              : "bg-gray-800/50 border border-gray-700/30"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <div className="flex items-center mb-1">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                              <Robot className="h-3 w-3 text-primary" />
                            </div>
                            <span className="text-xs font-medium text-primary/80">AI Assistant</span>
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
                          <span className="text-xs font-medium text-primary/80">AI Assistant</span>
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
                    placeholder="Ask a question about your homework..."
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
