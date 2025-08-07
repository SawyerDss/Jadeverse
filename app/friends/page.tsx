"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, UserMinus, Check, X, User, Users, Clock, MessageSquare, UserCheck, Gamepad2 } from "lucide-react"
import { useNotification } from "@/lib/notification-context"
import AnimatedText from "@/components/animated-text"

// Mock data for friends
const mockUsers = [
  { id: "user1", username: "test1", status: "online" },
  { id: "user2", username: "test2", status: "online" },
  { id: "user3", username: "test3", status: "offline" },
  { id: "user4", username: "test4", status: "online" },
  { id: "user5", username: "test5", status: "offline" },
  { id: "user6", username: "test6", status: "online" },
  { id: "user7", username: "test7", status: "offline" },
  { id: "user8", username: "test8", status: "online" },
]

export default function FriendsPage() {
  const { user, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend, updateUser } = useAuth()
  const router = useRouter()
  const { addNotification } = useNotification()
  const [username, setUsername] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const updateFriendsList = useCallback(
    (updatedUser: any) => {
      updateUser(updatedUser)
    },
    [updateUser],
  )

  // For demo purposes, we'll add some mock friends if the user doesn't have any
  useEffect(() => {
    if (user && user.friends.length === 0) {
      // Add some mock friends
      const mockFriends = mockUsers.slice(0, 3).map((mockUser) => ({
        id: mockUser.id,
        username: mockUser.username,
        status: mockUser.status,
        avatar: `/placeholder.svg?height=100&width=100&text=${mockUser.username.charAt(0).toUpperCase()}`,
      }))

      // Update user with mock friends
      const updatedUser = {
        ...user,
        friends: mockFriends,
      }

      // Update the user context
      setTimeout(() => {
        updateFriendsList(updatedUser)
      }, 500)
    }
  }, [user, updateFriendsList])

  if (!user) {
    router.push("/login")
    return null
  }

  const pendingRequests = user.friendRequests.filter((req) => req.status === "pending")
  const onlineFriends = user.friends.filter((friend) => friend.status === "online")
  const offlineFriends = user.friends.filter((friend) => friend.status !== "online")

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsSubmitting(true)
    try {
      await sendFriendRequest(username)
      setUsername("")
      setSearchResults([])
    } catch (error) {
      console.error("Failed to send friend request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSearch = () => {
    if (!username.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    // Simulate API call to search for users
    setTimeout(() => {
      const results = mockUsers
        .filter((u) => u.username.toLowerCase().includes(username.toLowerCase()))
        .filter((u) => !user.friends.some((f) => f.id === u.id))
        .slice(0, 5)

      setSearchResults(results)
      setIsSearching(false)
    }, 500)
  }

  const handleUserClick = (selectedUser: any) => {
    setUsername(selectedUser.username)
    setSearchResults([])
  }

  const sendMessage = (friendUsername: string) => {
    addNotification({
      title: "Message Sent",
      message: `Your message has been sent to ${friendUsername}`,
      type: "success",
    })
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Users className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            <AnimatedText text="Friends" className="text-gradient" />
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Friend Card */}
          <Card className="glass border-primary/20 md:col-span-3">
            <CardHeader>
              <CardTitle className="text-xl text-white">Add Friend (THIS IS FAKE, ITS A TEST)</CardTitle>
              <CardDescription>Send a friend request to another s0lara user</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendRequest} className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      if (e.target.value.length > 2) {
                        handleSearch()
                      } else {
                        setSearchResults([])
                      }
                    }}
                    placeholder="Enter username"
                    className="flex-1 bg-black/50 border-primary/30 focus:border-primary"
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-black/90 border border-primary/30 rounded-md z-10 max-h-60 overflow-y-auto">
                      {searchResults.map((result) => (
                        <div
                          key={result.id}
                          className="p-2 hover:bg-primary/20 cursor-pointer flex items-center"
                          onClick={() => handleUserClick(result)}
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                            <span className="text-primary font-bold">{result.username.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <div className="text-white">{result.username}</div>
                            <div className="text-xs text-white/50 capitalize">{result.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button type="submit" disabled={!username.trim() || isSubmitting}>
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  Send Request
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Friends List */}
          <div className="md:col-span-2">
            <Tabs defaultValue="all">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="all">All Friends</TabsTrigger>
                <TabsTrigger value="online">Online</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">All Friends</CardTitle>
                    <CardDescription>
                      {user.friends.length === 0
                        ? "You don't have any friends yet"
                        : `You have ${user.friends.length} friends`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.friends.length === 0 ? (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                          <p className="text-white/70">Send a friend request to get started</p>
                        </div>
                      ) : (
                        user.friends.map((friend) => (
                          <div
                            key={friend.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-primary/10"
                          >
                            <div className="flex items-center">
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <div
                                  className={`absolute bottom-0 right-2 w-3 h-3 rounded-full border-2 border-black ${
                                    friend.status === "online" ? "bg-green-500" : "bg-gray-500"
                                  }`}
                                ></div>
                              </div>
                              <div>
                                <p className="font-medium text-white">{friend.username}</p>
                                <p className="text-xs text-white/50 capitalize">{friend.status}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => sendMessage(friend.username)}
                                className="text-primary hover:text-primary-foreground hover:bg-primary border-primary/30"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFriend(friend.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="online">
                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">Online Friends</CardTitle>
                    <CardDescription>
                      {onlineFriends.length === 0
                        ? "No friends are currently online"
                        : `${onlineFriends.length} friends online`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {onlineFriends.length === 0 ? (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                          <p className="text-white/70">No friends are currently online</p>
                        </div>
                      ) : (
                        onlineFriends.map((friend) => (
                          <div
                            key={friend.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-primary/10"
                          >
                            <div className="flex items-center">
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <div className="absolute bottom-0 right-2 w-3 h-3 rounded-full border-2 border-black bg-green-500"></div>
                              </div>
                              <div>
                                <p className="font-medium text-white">{friend.username}</p>
                                <p className="text-xs text-white/50">Online</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  addNotification({
                                    title: "Game Invitation Sent",
                                    message: `Invitation sent to ${friend.username}`,
                                    type: "success",
                                  })
                                }}
                                className="text-primary hover:text-primary-foreground hover:bg-primary border-primary/30"
                              >
                                <Gamepad2 className="h-4 w-4 mr-1" />
                                Invite
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => sendMessage(friend.username)}
                                className="text-primary hover:text-primary-foreground hover:bg-primary border-primary/30"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pending">
                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">Pending Requests</CardTitle>
                    <CardDescription>
                      {pendingRequests.length === 0
                        ? "No pending friend requests"
                        : `You have ${pendingRequests.length} pending requests`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingRequests.length === 0 ? (
                        <div className="text-center py-8">
                          <Clock className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                          <p className="text-white/70">No pending friend requests</p>
                        </div>
                      ) : (
                        pendingRequests.map((request) => (
                          <div
                            key={request.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-primary/10"
                          >
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-white">{request.fromUsername}</p>
                                <p className="text-xs text-white/50">
                                  Sent{" "}
                                  {new Date(request.timestamp).toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => acceptFriendRequest(request.id)}
                                className="text-green-400 hover:text-green-300 hover:bg-green-500/10 border-green-500/30"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => rejectFriendRequest(request.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/30"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Friend Activity */}
          <div className="md:col-span-1">
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-white">Friend Activity</CardTitle>
                <CardDescription>See what your friends are up to</CardDescription>
              </CardHeader>
              <CardContent>
                {user.friends.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                    <p className="text-white/70">Add friends to see their activity</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {onlineFriends.map((friend) => (
                      <div key={friend.id} className="p-3 rounded-lg bg-black/30 border border-primary/10">
                        <div className="flex items-center mb-2">
                          <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div className="absolute bottom-0 right-1 w-2 h-2 rounded-full border-2 border-black bg-green-500"></div>
                          </div>
                          <p className="font-medium text-white text-sm">{friend.username}</p>
                        </div>
                        <p className="text-xs text-white/70">
                          {Math.random() > 0.5
                            ? "Playing Minecraft"
                            : Math.random() > 0.5
                              ? "Browsing games"
                              : "Just logged in"}
                        </p>
                      </div>
                    ))}

                    <div className="border-t border-primary/10 pt-4 mt-4">
                      <h4 className="text-sm font-semibold text-white/50 mb-2">Suggested Friends</h4>
                      {mockUsers
                        .filter((u) => !user.friends.some((f) => f.id === u.id))
                        .slice(0, 3)
                        .map((suggestedUser) => (
                          <div
                            key={suggestedUser.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-black/20 mb-2"
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                                <span className="text-primary font-bold">
                                  {suggestedUser.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <p className="text-sm text-white">{suggestedUser.username}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setUsername(suggestedUser.username)
                                setTimeout(
                                  () => handleSendRequest({ preventDefault: () => {} } as React.FormEvent),
                                  100,
                                )
                              }}
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
