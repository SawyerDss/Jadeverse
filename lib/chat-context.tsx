"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { useAuth } from "@/lib/auth-context"
import { useNotification } from "@/lib/notification-context"

export type ChatMessage = {
  id: string
  sender: string
  senderId: string
  content: string
  timestamp: Date
  isSystem?: boolean
  avatar?: string
}

type ChatContextType = {
  messages: ChatMessage[]
  sendMessage: (content: string) => void
  isChatOpen: boolean
  toggleChat: () => void
  unreadCount: number
  markAllAsRead: () => void
  onlineUsers: { id: string; username: string; avatar?: string; status: "online" | "away" | "offline" }[]
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Real users for the chat (simulated)
const realUsers = [
  { id: "user1", username: "JadeMaster", status: "online" as const, avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user2", username: "EmeraldQueen", status: "online" as const, avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user3", username: "VoidWalker", status: "away" as const, avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user4", username: "CrystalHunter", status: "online" as const, avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user5", username: "NeonRider", status: "offline" as const, avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user6", username: "PixelWarrior", status: "online" as const, avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user7", username: "GlitchMaster", status: "online" as const, avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user8", username: "CyberNinja", status: "away" as const, avatar: "/placeholder.svg?height=40&width=40" },
]

// Real user messages for the chat (simulated)
const realUserMessages = [
  "Hey everyone! Anyone playing Jade Racer tonight?",
  "I just hit a new high score in Emerald Assault!",
  "Looking for teammates for Crystal Legends, anyone interested?",
  "The graphics in Void Explorers are amazing!",
  "Has anyone found all the hidden gems in Jade Puzzle?",
  "I'm stuck on level 7, any tips?",
  "Just joined JadeVerse today, loving it so far!",
  "Who's up for a tournament this weekend?",
  "Check out my custom game I just added!",
  "Anyone know how to unlock the secret level in Emerald Survivor?",
  "The new update is awesome!",
  "I'm hosting a game night tomorrow at 8PM EST if anyone wants to join",
  "What's everyone's favorite game on here?",
  "Just beat the final boss in Crystal Legends!",
]

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [onlineUsers, setOnlineUsers] = useState(realUsers)
  const { user } = useAuth()
  const { addNotification } = useNotification()

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("chat-messages")
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages)
      // Convert string timestamps back to Date objects
      const withDates = parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      }))
      setMessages(withDates)
    } else {
      // Add welcome message if no messages exist
      const welcomeMessage: ChatMessage = {
        id: uuidv4(),
        sender: "JadeVerse",
        senderId: "system",
        content: "Welcome to JadeVerse Chat! Connect with other gamers and share your experiences.",
        timestamp: new Date(),
        isSystem: true,
      }
      setMessages([welcomeMessage])
    }
  }, [])

  // Simulate users coming online/offline
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers((prev) => {
        return prev.map((u) => {
          // Randomly change status sometimes
          if (Math.random() > 0.8) {
            const statuses: ("online" | "away" | "offline")[] = ["online", "away", "offline"]
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
            return { ...u, status: newStatus }
          }
          return u
        })
      })
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem("chat-messages", JSON.stringify(messages))
  }, [messages])

  // Update unread count when messages change or chat is opened
  useEffect(() => {
    if (isChatOpen) {
      setUnreadCount(0)
    } else {
      // Count messages that came in while chat was closed
      const lastOpenTime = localStorage.getItem("chat-last-open")
      if (lastOpenTime) {
        const count = messages.filter((m) => m.timestamp > new Date(lastOpenTime) && m.senderId !== user?.id).length
        setUnreadCount(count)
      } else {
        setUnreadCount(messages.length > 0 ? 1 : 0)
      }
    }
  }, [messages, isChatOpen, user])

  // Save last open time when chat is closed
  useEffect(() => {
    if (!isChatOpen) {
      localStorage.setItem("chat-last-open", new Date().toISOString())
    }
  }, [isChatOpen])

  // Simulate real users chatting occasionally
  useEffect(() => {
    if (messages.length > 0) {
      const interval = setInterval(() => {
        // Only send random messages sometimes
        if (Math.random() > 0.7) {
          const onlineUser = onlineUsers.filter((u) => u.status === "online" && u.id !== user?.id)
          if (onlineUser.length > 0) {
            const randomUser = onlineUser[Math.floor(Math.random() * onlineUser.length)]
            const randomMessage = realUserMessages[Math.floor(Math.random() * realUserMessages.length)]

            const responseMessage: ChatMessage = {
              id: uuidv4(),
              sender: randomUser.username,
              senderId: randomUser.id,
              content: randomMessage,
              timestamp: new Date(),
              avatar: randomUser.avatar,
            }

            setMessages((prev) => [...prev, responseMessage])

            // Add notification if chat is closed
            if (!isChatOpen) {
              addNotification({
                title: `New message from ${randomUser.username}`,
                message: randomMessage,
                type: "info",
                duration: 5000,
              })
            }
          }
        }
      }, 15000) // Every 15 seconds

      return () => clearInterval(interval)
    }
  }, [messages, isChatOpen, onlineUsers, user, addNotification])

  const sendMessage = (content: string) => {
    if (!content.trim() || !user) return

    const newMessage: ChatMessage = {
      id: uuidv4(),
      sender: user.username,
      senderId: user.id,
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])

    // Simulate response from a real user after a random delay
    setTimeout(
      () => {
        // Find online users
        const availableUsers = onlineUsers.filter((u) => u.status === "online" && u.id !== user.id)
        if (availableUsers.length > 0) {
          const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)]
          const randomMessage = realUserMessages[Math.floor(Math.random() * realUserMessages.length)]

          const responseMessage: ChatMessage = {
            id: uuidv4(),
            sender: randomUser.username,
            senderId: randomUser.id,
            content: randomMessage,
            timestamp: new Date(),
            avatar: randomUser.avatar,
          }

          setMessages((prev) => [...prev, responseMessage])

          // Add notification if chat is closed
          if (!isChatOpen) {
            addNotification({
              title: `New message from ${randomUser.username}`,
              message: randomMessage,
              type: "info",
              duration: 5000,
            })
          }
        }
      },
      1000 + Math.random() * 3000,
    )
  }

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev)
    if (!isChatOpen) {
      setUnreadCount(0)
      localStorage.setItem("chat-last-open", new Date().toISOString())
    }
  }

  const markAllAsRead = () => {
    setUnreadCount(0)
    localStorage.setItem("chat-last-open", new Date().toISOString())
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        isChatOpen,
        toggleChat,
        unreadCount,
        markAllAsRead,
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
