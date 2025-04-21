"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useNotification } from "@/lib/notification-context"

type User = {
  id: string
  username: string
  email: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (username: string, email: string, password: string) => Promise<void>
  signOut: () => void
  updateUser: (updatedUser: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Always call useNotification to prevent hook order issues
  const { addNotification } = useNotification()

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse user data:", e)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login
      const mockUser = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        username: email.split("@")[0],
        email,
        avatar: "/placeholder.svg?height=100&width=100&text=1",
      }

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)

      // Show success notification
      addNotification({
        title: "Welcome back!",
        message: `You've successfully signed in as ${mockUser.username}`,
        type: "success",
      })

      return Promise.resolve()
    } catch (error) {
      console.error("Login failed:", error)
      return Promise.reject(error)
    } finally {
      setLoading(false)
    }
  }

  // Sign up function
  const signUp = async (username: string, email: string, password: string) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful registration
      const mockUser = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        username,
        email,
        avatar: "/placeholder.svg?height=100&width=100&text=1",
      }

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)

      // Show success notification
      addNotification({
        title: "Account Created",
        message: `Welcome to JadeVerse, ${username}!`,
        type: "success",
      })

      return Promise.resolve()
    } catch (error) {
      console.error("Registration failed:", error)
      return Promise.reject(error)
    } finally {
      setLoading(false)
    }
  }

  // Sign out function
  const signOut = () => {
    localStorage.removeItem("user")
    setUser(null)

    // Show notification
    addNotification({
      title: "Signed Out",
      message: "You've been successfully signed out",
      type: "info",
    })

    router.push("/")
  }

  // Update user function
  const updateUser = (updatedUser: User) => {
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
