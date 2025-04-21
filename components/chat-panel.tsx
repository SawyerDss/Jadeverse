"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send, X, ChevronDown, Users } from "lucide-react"
import { useChat } from "@/lib/chat-context"
import { useAuth } from "@/lib/auth-context"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function ChatPanel() {
  const { messages, sendMessage, isChatOpen, toggleChat, unreadCount, markAllAsRead, onlineUsers } = useChat()
  const { user } = useAuth()
  const [messageText, setMessageText] = useState("")
  const [activeTab, setActiveTab] = useState<"chat" | "users">("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change or chat opens
  useEffect(() => {
    if (isChatOpen && activeTab === "chat") {
      scrollToBottom()
      markAllAsRead()
    }
  }, [messages, isChatOpen, activeTab, markAllAsRead])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageText.trim() && user) {
      sendMessage(messageText)
      setMessageText("")
    }
  }

  const handleToggleChat = () => {
    toggleChat()
  }

  if (!isChatOpen) {
    return (
      <button
        className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/80 transition-colors z-50 flex items-center justify-center"
        onClick={handleToggleChat}
      >
        <MessageSquare className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    )
  }

  const getStatusColor = (status: "online" | "away" | "offline") => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-500"
    }
  }

  return (
    <div className="fixed bottom-0 right-4 w-80 h-96 bg-black border border-primary/20 rounded-t-lg shadow-lg z-50 flex flex-col glass">
      {/* Chat Header */}
      <div className="p-3 border-b border-primary/20 flex justify-between items-center">
        <div className="flex items-center">
          <button
            className={cn(
              "p-1.5 rounded-md transition-colors",
              activeTab === "chat" ? "bg-primary/20 text-primary" : "text-white/70 hover:text-white",
            )}
            onClick={() => setActiveTab("chat")}
          >
            <MessageSquare className="h-5 w-5" />
          </button>
          <button
            className={cn(
              "p-1.5 rounded-md transition-colors ml-1",
              activeTab === "users" ? "bg-primary/20 text-primary" : "text-white/70 hover:text-white",
            )}
            onClick={() => setActiveTab("users")}
          >
            <Users className="h-5 w-5" />
          </button>
          <h3 className="font-medium text-white ml-2">{activeTab === "chat" ? "Chat" : "Online Users"}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-white/70 hover:text-white" onClick={handleToggleChat} title="Minimize">
            <ChevronDown className="h-5 w-5" />
          </button>
          <button className="text-white/70 hover:text-white" onClick={handleToggleChat} title="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {activeTab === "chat" ? (
        <>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col max-w-[80%] rounded-lg p-2 break-words",
                  message.isSystem
                    ? "bg-primary/10 border border-primary/20 mx-auto max-w-full text-center"
                    : message.senderId === user?.id
                      ? "bg-primary/20 border border-primary/20 ml-auto"
                      : "bg-gray-800/50 border border-gray-700/20 mr-auto",
                )}
              >
                {!message.isSystem && (
                  <div className="flex items-center gap-1.5 mb-1">
                    {message.avatar && message.senderId !== user?.id && (
                      <div className="w-5 h-5 rounded-full overflow-hidden">
                        <Image
                          src={message.avatar || "/placeholder.svg"}
                          alt={message.sender}
                          width={20}
                          height={20}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span
                      className={cn(
                        "text-xs font-medium",
                        message.senderId === user?.id ? "text-primary/80" : "text-blue-300",
                      )}
                    >
                      {message.sender}
                    </span>
                  </div>
                )}
                <span className="text-white text-sm">{message.content}</span>
                <span className="text-white/50 text-xs mt-1 self-end">
                  {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          {user ? (
            <form onSubmit={handleSendMessage} className="p-3 border-t border-primary/20 flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-black/50 border border-primary/30 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="bg-primary text-white p-2 rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <div className="p-3 border-t border-primary/20 text-center">
              <a href="/login" className="text-primary hover:text-primary/80 text-sm">
                Sign in to chat
              </a>
            </div>
          )}
        </>
      ) : (
        /* Online Users Tab */
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="text-xs text-white/50 mb-2">
            {onlineUsers.filter((u) => u.status === "online").length} users online
          </div>

          {onlineUsers.map((u) => (
            <div key={u.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 transition-colors">
              <div className="relative">
                {u.avatar ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={u.avatar || "/placeholder.svg"}
                      alt={u.username}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${getStatusColor(u.status)} border border-black`}
                ></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white text-sm truncate">{u.username}</span>
                  <span className="text-xs text-white/50 capitalize">{u.status}</span>
                </div>
              </div>
            </div>
          ))}

          {user && (
            <div className="mt-4 pt-4 border-t border-primary/20">
              <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-md">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white text-sm truncate">{user.username}</span>
                    <span className="text-xs text-primary">You</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
