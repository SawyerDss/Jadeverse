"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, AlertCircle } from "lucide-react"
import { useSound } from "@/lib/sound-context"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function JadeAIPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { playSound } = useSound()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    playSound("click")

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to get response")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "s0lara AI is currently undergoing maintenance due to dependency updates. Please try again later.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      playSound("success")
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I'm currently experiencing technical difficulties. Please try again later.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      playSound("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader className="border-b border-cyan-500/30">
            <CardTitle className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
              <Bot className="w-8 h-8" />
              s0lara AI
              <AlertCircle className="w-5 h-5 text-yellow-500 ml-2" />
            </CardTitle>
            <p className="text-cyan-300/70">AI Assistant temporarily under maintenance</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col h-[600px]">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-cyan-300/50 py-8">
                      <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>s0lara AI is currently under maintenance.</p>
                      <p className="text-sm mt-2">We're working to restore full functionality soon.</p>
                    </div>
                  )}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${
                          message.role === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === "user" ? "bg-cyan-500" : "bg-purple-500"
                          }`}
                        >
                          {message.role === "user" ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-cyan-500/20 text-cyan-100"
                              : "bg-purple-500/20 text-purple-100"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-50 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-purple-500/20 text-purple-100 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <span className="text-sm ml-2">s0lara AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="border-t border-cyan-500/30 p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask s0lara AI anything... (Currently under maintenance)"
                    className="flex-1 bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-300/50"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-cyan-500 hover:bg-cyan-600 text-black"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
