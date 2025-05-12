"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useNotification } from "@/lib/notification-context"

type Friend = {
  id: string
  username: string
  avatar?: string
  status: "online" | "offline" | "away" | "busy"
}

type FriendRequest = {
  id: string
  from: string
  to: string
  fromUsername: string
  toUsername: string
  status: "pending" | "accepted" | "rejected"
  timestamp: Date
}

type User = {
  id: string
  username: string
  email: string
  avatar?: string
  friends: Friend[]
  friendRequests: FriendRequest[]
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (username: string, email: string, password: string) => Promise<void>
  signOut: () => void
  updateUser: (updatedUser: User) => void
  sendFriendRequest: (username: string) => Promise<void>
  acceptFriendRequest: (requestId: string) => void
  rejectFriendRequest: (requestId: string) => void
  removeFriend: (friendId: string) => void
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
        friends: [],
        friendRequests: [],
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
        friends: [],
        friendRequests: [],
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

  // Send friend request
  const sendFriendRequest = async (username: string) => {
    if (!user) return Promise.reject("You must be logged in to send friend requests")

    // In a real app, this would be an API call
    // For demo purposes, we'll simulate a successful friend request

    // Check if the user exists (mock check)
    const userExists = Math.random() > 0.2 // 80% chance the user exists

    if (!userExists) {
      addNotification({
        title: "User Not Found",
        message: `Could not find user ${username}`,
        type: "error",
      })
      return Promise.reject("User not found")
    }

    // Check if already friends or request already sent
    const alreadyFriend = user.friends.some((friend) => friend.username.toLowerCase() === username.toLowerCase())
    const requestAlreadySent = user.friendRequests.some(
      (req) => req.toUsername.toLowerCase() === username.toLowerCase() && req.status === "pending",
    )

    if (alreadyFriend) {
      addNotification({
        title: "Already Friends",
        message: `You are already friends with ${username}`,
        type: "info",
      })
      return Promise.reject("Already friends")
    }

    if (requestAlreadySent) {
      addNotification({
        title: "Request Already Sent",
        message: `You have already sent a friend request to ${username}`,
        type: "info",
      })
      return Promise.reject("Request already sent")
    }

    // Create a new friend request
    const newRequest: FriendRequest = {
      id: "req_" + Math.random().toString(36).substr(2, 9),
      from: user.id,
      to: "user_" + Math.random().toString(36).substr(2, 9), // Mock recipient ID
      fromUsername: user.username,
      toUsername: username,
      status: "pending",
      timestamp: new Date(),
    }

    // Update user with new friend request
    const updatedUser = {
      ...user,
      friendRequests: [...user.friendRequests, newRequest],
    }

    updateUser(updatedUser)

    addNotification({
      title: "Friend Request Sent",
      message: `Friend request sent to ${username}`,
      type: "success",
    })

    return Promise.resolve()
  }

  // Accept friend request
  const acceptFriendRequest = (requestId: string) => {
    if (!user) return

    const request = user.friendRequests.find((req) => req.id === requestId)
    if (!request) return

    // Update request status
    const updatedRequests = user.friendRequests.map((req) =>
      req.id === requestId ? { ...req, status: "accepted" } : req,
    )

    // Add new friend
    const newFriend: Friend = {
      id: request.from,
      username: request.fromUsername,
      avatar: "/placeholder.svg?height=100&width=100&text=" + request.fromUsername.charAt(0).toUpperCase(),
      status: "online",
    }

    const updatedUser = {
      ...user,
      friends: [...user.friends, newFriend],
      friendRequests: updatedRequests,
    }

    updateUser(updatedUser)

    addNotification({
      title: "Friend Request Accepted",
      message: `You are now friends with ${request.fromUsername}`,
      type: "success",
    })
  }

  // Reject friend request
  const rejectFriendRequest = (requestId: string) => {
    if (!user) return

    const request = user.friendRequests.find((req) => req.id === requestId)
    if (!request) return

    // Update request status
    const updatedRequests = user.friendRequests.map((req) =>
      req.id === requestId ? { ...req, status: "rejected" } : req,
    )

    const updatedUser = {
      ...user,
      friendRequests: updatedRequests,
    }

    updateUser(updatedUser)

    addNotification({
      title: "Friend Request Rejected",
      message: `You rejected the friend request from ${request.fromUsername}`,
      type: "info",
    })
  }

  // Remove friend
  const removeFriend = (friendId: string) => {
    if (!user) return

    const friend = user.friends.find((f) => f.id === friendId)
    if (!friend) return

    const updatedFriends = user.friends.filter((f) => f.id !== friendId)

    const updatedUser = {
      ...user,
      friends: updatedFriends,
    }

    updateUser(updatedUser)

    addNotification({
      title: "Friend Removed",
      message: `You removed ${friend.username} from your friends list`,
      type: "info",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateUser,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        removeFriend,
      }}
    >
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
