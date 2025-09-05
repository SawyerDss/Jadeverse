"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, AlertTriangle } from "lucide-react"

export default function JadeAIPage() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Show maintenance message
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I apologize, but the AI service is currently under maintenance. Please try again later.",
          },
        ])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again later.",
        },
      ])
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="h-[80vh] flex flex-col bg-black/40 border-primary/20">
        <CardHeader className="border-b border-primary/20">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Bot className="h-6 w-6" />
            s0lara AI
            <AlertTriangle className="h-5 w-5 text-yellow-500 ml-2" />
            <span className="text-sm text-yellow-500">Under Maintenance</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-primary/10 rounded-lg p-3 max-w-[80%]">
                  <p className="text-white">
                    Hello! I'm s0lara AI, your gaming assistant. I'm currently undergoing maintenance to improve my
                    capabilities. Please check back later!
                  </p>
                </div>
              </div>

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user" ? "bg-secondary/20" : "bg-primary/20"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4 text-secondary" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 max-w-[80%] ${
                      message.role === "user" ? "bg-secondary/10 text-white" : "bg-primary/10 text-white"
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-primary/20 p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about games, tips, or anything gaming related..."
                className="flex-1 bg-white/5 border-primary/30 text-white placeholder-white/50"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()} className="bg-primary hover:bg-primary/80">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
