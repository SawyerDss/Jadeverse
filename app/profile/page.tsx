"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useGames, type Game } from "@/lib/games-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Gamepad2, Clock, Trophy, Edit, Trash2, Plus, Camera, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import GlowingButton from "@/components/glowing-button"
import AnimatedText from "@/components/animated-text"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useNotification } from "@/lib/notification-context"

// Avatar options
const avatarOptions = [
  "/placeholder.svg?height=100&width=100&text=1",
  "/placeholder.svg?height=100&width=100&text=2",
  "/placeholder.svg?height=100&width=100&text=3",
  "/placeholder.svg?height=100&width=100&text=4",
  "/placeholder.svg?height=100&width=100&text=5",
  "/placeholder.svg?height=100&width=100&text=6",
]

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const { games, removeGame } = useGames()
  const { addNotification } = useNotification()
  const router = useRouter()
  const [userGames, setUserGames] = useState<Game[]>([])
  const [recentActivity, setRecentActivity] = useState<{ action: string; game: string; date: Date }[]>([])
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)
  const [customAvatarUrl, setCustomAvatarUrl] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState("")

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      // Set initial avatar
      setSelectedAvatar(user.avatar || avatarOptions[0])
    }
  }, [user, router])

  // Filter games created by the user
  useEffect(() => {
    if (user) {
      const filteredGames = games.filter((game) => game.createdBy === user.username)
      setUserGames(filteredGames)

      // Generate mock recent activity
      const mockActivity = [
        { action: "Played", game: "Jade Racer", date: new Date(Date.now() - 1000 * 60 * 60 * 2) },
        {
          action: "Added",
          game: filteredGames[0]?.title || "Custom Game",
          date: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
        { action: "Achieved high score in", game: "Emerald Assault", date: new Date(Date.now() - 1000 * 60 * 60 * 48) },
        { action: "Played", game: "Void Explorers", date: new Date(Date.now() - 1000 * 60 * 60 * 72) },
      ]
      setRecentActivity(mockActivity)
    }
  }, [games, user])

  if (!user) {
    return null
  }

  const handleDeleteGame = (gameId: string) => {
    if (confirm("Are you sure you want to delete this game?")) {
      removeGame(gameId)
    }
  }

  const handleSaveAvatar = () => {
    const newAvatar = customAvatarUrl || selectedAvatar

    // Update user avatar
    updateUser({ ...user, avatar: newAvatar })

    // Show notification
    addNotification({
      title: "Profile Updated",
      message: "Your profile picture has been updated successfully",
      type: "success",
    })

    // Close avatar selector
    setShowAvatarSelector(false)
    setCustomAvatarUrl("")
  }

  // Format date to relative time
  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <User className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            <AnimatedText text="Profile" className="text-gradient" />
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card className="glass border-primary/20 md:col-span-1">
            <CardHeader>
              <CardTitle className="text-xl text-white text-bloom">User Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary/20 overflow-hidden mb-4 border-2 border-primary/30">
                    <Image
                      src={user.avatar || avatarOptions[0]}
                      alt={user.username}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <button
                    className="absolute bottom-4 right-0 bg-primary text-white p-1 rounded-full shadow-lg"
                    onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                {showAvatarSelector && (
                  <div className="w-full mb-4 p-3 bg-black/50 rounded-lg border border-primary/30 animate-fadeIn">
                    <h3 className="text-sm font-medium text-white mb-2">Choose Avatar</h3>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {avatarOptions.map((avatar, index) => (
                        <button
                          key={index}
                          className={`relative w-full pt-[100%] rounded-md overflow-hidden border-2 ${
                            selectedAvatar === avatar ? "border-primary" : "border-transparent"
                          } hover:border-primary/50 transition-all`}
                          onClick={() => setSelectedAvatar(avatar)}
                        >
                          <Image
                            src={avatar || "/placeholder.svg"}
                            alt={`Avatar ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {selectedAvatar === avatar && (
                            <div className="absolute bottom-1 right-1 bg-primary rounded-full p-0.5">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="customAvatar" className="text-xs text-white/70">
                        Custom URL (optional)
                      </Label>
                      <Input
                        id="customAvatar"
                        value={customAvatarUrl}
                        onChange={(e) => setCustomAvatarUrl(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="mt-1 bg-black/50 border-primary/30 text-sm"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowAvatarSelector(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveAvatar} className="bg-primary hover:bg-primary/80">
                        Save
                      </Button>
                    </div>
                  </div>
                )}

                <h2 className="text-xl font-bold text-white mb-1">{user.username}</h2>
                <p className="text-white/70 text-sm mb-4">{user.email}</p>
                <div className="w-full border-t border-primary/20 pt-4 mt-2">
                  <div className="flex justify-between mb-2">
                    <span className="text-white/70">Member since:</span>
                    <span className="text-white">Today</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/70">Custom games:</span>
                    <span className="text-white">{userGames.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Status:</span>
                    <span className="text-primary">Active</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="games">
              <TabsList className="grid w-full grid-cols-3 bg-black/50">
                <TabsTrigger value="games" className="data-[state=active]:bg-primary/20">
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  My Content
                </TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:bg-primary/20">
                  <Clock className="h-4 w-4 mr-2" />
                  Activity
                </TabsTrigger>
                <TabsTrigger value="achievements" className="data-[state=active]:bg-primary/20">
                  <Trophy className="h-4 w-4 mr-2" />
                  Achievements
                </TabsTrigger>
              </TabsList>

              {/* My Games Tab */}
              <TabsContent value="games">
                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-white text-bloom">My Content</CardTitle>
                    <CardDescription>Games and apps you've added to JadeVerse</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userGames.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-white/70 mb-4">You haven't added any content yet.</p>
                        <Link href="/add-content">
                          <GlowingButton>Add Your First Game or App</GlowingButton>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userGames.map((game) => (
                          <div
                            key={game.id}
                            className="flex items-center gap-4 p-3 bg-black/30 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors"
                          >
                            <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={game.image || "/placeholder.svg"}
                                alt={game.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium truncate">{game.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs bg-primary/30 text-primary px-2 py-0.5 rounded-full">
                                  {game.category}
                                </span>
                                {game.type === "app" ? (
                                  <span className="text-xs bg-emerald-600/30 text-emerald-400 px-2 py-0.5 rounded-full">
                                    App
                                  </span>
                                ) : (
                                  <span className="text-xs bg-blue-600/30 text-blue-400 px-2 py-0.5 rounded-full">
                                    Game
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link href={game.type === "app" ? `/apps/${game.id}` : `/games/${game.id}`}>
                                <button className="p-2 text-white/70 hover:text-white hover:bg-primary/10 rounded-full transition-colors">
                                  <Gamepad2 className="h-5 w-5" />
                                </button>
                              </Link>
                              <Link href={`/add-content?edit=${game.id}`}>
                                <button className="p-2 text-white/70 hover:text-white hover:bg-primary/10 rounded-full transition-colors">
                                  <Edit className="h-5 w-5" />
                                </button>
                              </Link>
                              <button
                                onClick={() => handleDeleteGame(game.id)}
                                className="p-2 text-white/70 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-white text-bloom">Recent Activity</CardTitle>
                    <CardDescription>Your recent activity on JadeVerse</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-3 bg-black/30 rounded-lg border border-primary/10"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            {activity.action === "Played" ? (
                              <Gamepad2 className="h-5 w-5 text-primary" />
                            ) : activity.action === "Added" ? (
                              <Plus className="h-5 w-5 text-primary" />
                            ) : (
                              <Trophy className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-white">
                              <span className="font-medium">{activity.action}</span> {activity.game}
                            </p>
                            <p className="text-white/50 text-sm">{formatDate(activity.date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements">
                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-white text-bloom">Achievements</CardTitle>
                    <CardDescription>Your gaming achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: "First Game", description: "Added your first game", icon: "🎮", unlocked: true },
                        { name: "Game Master", description: "Played 10 different games", icon: "🏆", unlocked: false },
                        {
                          name: "Content Creator",
                          description: "Added 5 custom games or apps",
                          icon: "🔨",
                          unlocked: true,
                        },
                        {
                          name: "Explorer",
                          description: "Visited all sections of JadeVerse",
                          icon: "🧭",
                          unlocked: true,
                        },
                        { name: "Customizer", description: "Changed your theme color", icon: "🎨", unlocked: false },
                        {
                          name: "High Scorer",
                          description: "Reached the top of a leaderboard",
                          icon: "🥇",
                          unlocked: false,
                        },
                        {
                          name: "Web Surfer",
                          description: "Used the proxy to visit 5 websites",
                          icon: "🌐",
                          unlocked: false,
                        },
                        {
                          name: "AI Scholar",
                          description: "Asked JadeAI 10 questions",
                          icon: "🤖",
                          unlocked: true,
                        },
                      ].map((achievement, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            achievement.unlocked
                              ? "bg-primary/10 border-primary/30"
                              : "bg-black/30 border-white/10 opacity-60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div>
                              <h3 className="font-medium text-white">{achievement.name}</h3>
                              <p className="text-white/70 text-sm">{achievement.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
