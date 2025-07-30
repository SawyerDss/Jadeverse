"use client"

import { useChat } from "ai/react"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef } from "react"

export default function JadeAIPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="py-8 h-screen flex flex-col">
      <div className="max-w-4xl mx-auto flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-bloom-primary">
            <span className="text-gradient">s0lara</span> AI Assistant
          </h1>
          <p className="text-white/70 text-lg">
            Your intelligent companion for learning, problem-solving, and creative assistance.
          </p>
        </div>

        <Card className="glass border-primary/20 flex-1 flex flex-col">
          <CardHeader className="border-b border-primary/20">
            <CardTitle className="text-white flex items-center">
              <Bot className="h-5 w-5 mr-2 text-primary" />
              Chat with s0lara AI
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                    <p className="text-white/70">
                      Hello! I'm s0lara AI. Ask me anything about math, science, English, or any topic you'd like help
                      with.
                    </p>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user" ? "bg-primary/20 text-white ml-auto" : "bg-black/30 text-white/90"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-black/30 text-white/90 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>s0lara AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200">
                    <p className="font-semibold">Error:</p>
                    <p>{error.message}</p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t border-primary/20 p-4">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-black/50 border-primary/30 focus:border-primary text-white placeholder-white/50"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-primary hover:bg-primary/80 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
