"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, Send } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { GlowingButton } from "@/components/glowing-button"

type Message = {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export default function JadeAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm JadeAI powered by Grok. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call the Grok API
      const response = await fetch("/api/grok", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from JadeAI")
      }

      const data = await response.json()

      // Add AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: data.text || "I'm not sure how to respond to that.",
            sender: "ai",
            timestamp: new Date(),
          },
        ])
        setIsLoading(false)
      }, 500) // Small delay for natural feel
    } catch (error) {
      console.error("Error:", error)

      // Add error message
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
            sender: "ai",
            timestamp: new Date(),
          },
        ])
        setIsLoading(false)
      }, 500)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Bot className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            <span className="text-gradient">JadeAI</span>
            <span className="ml-2 text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">Powered by Grok</span>
          </h1>
        </div>

        <Card className="border-primary/20 bg-black/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>Ask JadeAI anything - homework help, general knowledge, and more</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="h-[60vh] overflow-y-auto p-4 space-y-4 rounded-md bg-black/20">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary/20 text-white ml-auto"
                        : "bg-black/40 border border-primary/20 text-white"
                    }`}
                  >
                    {message.sender === "ai" && (
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="h-4 w-4 text-primary" />
                        <span className="text-xs opacity-70">JadeAI</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-50 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-black/40 border border-primary/20 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="h-4 w-4 text-primary" />
                      <span className="text-xs opacity-70">JadeAI</span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                      <div
                        className="h-2 w-2 rounded-full bg-primary animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 rounded-full bg-primary animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <CardFooter>
            <form onSubmit={handleSubmit} className="w-full flex gap-2">
              <Input
                placeholder="Ask JadeAI anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <GlowingButton type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </GlowingButton>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
