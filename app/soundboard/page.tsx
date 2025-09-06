"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Play, Pause, Volume2, Search, Filter, Grid, List, ExternalLink } from "lucide-react"
import { GlowingButton } from "@/components/glowing-button"

interface SoundEffect {
  id: string
  name: string
  category: string
  duration: string
  file: string
  description: string
}

const soundEffects: SoundEffect[] = [
  {
    id: "click",
    name: "Click Sound",
    category: "UI",
    duration: "0.1s",
    file: "/sounds/click.mp3",
    description: "Standard UI click sound effect",
  },
  {
    id: "hover",
    name: "Hover Sound",
    category: "UI",
    duration: "0.2s",
    file: "/sounds/hover.mp3",
    description: "Subtle hover interaction sound",
  },
  {
    id: "success",
    name: "Success Chime",
    category: "Feedback",
    duration: "1.2s",
    file: "/sounds/success.mp3",
    description: "Positive feedback sound for successful actions",
  },
  {
    id: "error",
    name: "Error Alert",
    category: "Feedback",
    duration: "0.8s",
    file: "/sounds/error.mp3",
    description: "Alert sound for errors and warnings",
  },
  {
    id: "notification",
    name: "Notification Bell",
    category: "Alerts",
    duration: "1.5s",
    file: "/sounds/notification.mp3",
    description: "Gentle notification sound",
  },
  {
    id: "background",
    name: "Ambient Background",
    category: "Music",
    duration: "30s",
    file: "/sounds/background.mp3",
    description: "Looping ambient background music",
  },
]

const categories = ["All", "UI", "Feedback", "Alerts", "Music"]

export default function SoundboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [playingSound, setPlayingSound] = useState<string | null>(null)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})
  const [iframeUrl, setIframeUrl] = useState("")

  useEffect(() => {
    // Default URL - hardcoded
    const defaultUrl = "https://www.myinstants.com/"
    setIframeUrl(defaultUrl)
  }, [])

  const filteredSounds = soundEffects.filter((sound) => {
    const matchesSearch =
      sound.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sound.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || sound.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const playSound = (soundId: string, file: string) => {
    // Stop any currently playing sound
    if (playingSound && audioRefs.current[playingSound]) {
      audioRefs.current[playingSound].pause()
      audioRefs.current[playingSound].currentTime = 0
    }

    // Create or get audio element
    if (!audioRefs.current[soundId]) {
      audioRefs.current[soundId] = new Audio(file)
      audioRefs.current[soundId].addEventListener("ended", () => {
        setPlayingSound(null)
      })
    }

    // Play the sound
    setPlayingSound(soundId)
    audioRefs.current[soundId].play().catch((error) => {
      console.error("Error playing sound:", error)
      setPlayingSound(null)
    })
  }

  const stopSound = (soundId: string) => {
    if (audioRefs.current[soundId]) {
      audioRefs.current[soundId].pause()
      audioRefs.current[soundId].currentTime = 0
    }
    setPlayingSound(null)
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-primary/20 bg-black/20">
        <div className="flex items-center">
          <Volume2 className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-2xl font-bold text-white">Soundboard</h1>
        </div>
        <div className="flex items-center gap-2">
          {iframeUrl && (
            <Button
              onClick={() => window.open(iframeUrl, "_blank")}
              variant="outline"
              size="sm"
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1">
        {iframeUrl ? (
          <iframe
            src={iframeUrl}
            className="w-full h-full border-0"
            title="Soundboard"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        ) : (
          <div className="py-16">
            <div className="max-w-7xl mx-auto px-4">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4">
                  <span className="text-gradient">Soundboard</span>
                </h1>
                <p className="text-xl text-white/70 max-w-2xl mx-auto">
                  Explore and play various sound effects and audio clips
                </p>
              </div>

              {/* Not Working Alert */}
              <div className="mb-8">
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-red-400 font-medium">NOT WORKING - Under Development</span>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                    <Input
                      placeholder="Search sounds..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-black/50 border-primary/30 focus:border-primary"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className="bg-primary/20 border-primary/30 hover:bg-primary/30"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className="bg-primary/20 border-primary/30 hover:bg-primary/30"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  <Filter className="h-4 w-4 text-white/50 mt-2" />
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={
                        selectedCategory === category
                          ? "bg-primary text-black"
                          : "bg-black/50 border-primary/30 text-white hover:bg-primary/20"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sound Effects Grid/List */}
              {filteredSounds.length === 0 ? (
                <div className="text-center py-12">
                  <Volume2 className="h-16 w-16 text-white/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No sounds found</h3>
                  <p className="text-white/60">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div
                  className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
                >
                  {filteredSounds.map((sound) => (
                    <Card
                      key={sound.id}
                      className={`glass border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 ${
                        viewMode === "list" ? "flex flex-row items-center" : ""
                      }`}
                    >
                      <CardHeader className={viewMode === "list" ? "flex-1" : ""}>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white flex items-center gap-2">
                            <Volume2 className="h-5 w-5 text-primary" />
                            {sound.name}
                          </CardTitle>
                          <Badge variant="outline" className="border-primary/30 text-primary">
                            {sound.category}
                          </Badge>
                        </div>
                        <CardDescription className="text-white/70">{sound.description}</CardDescription>
                        <div className="text-sm text-white/50">Duration: {sound.duration}</div>
                      </CardHeader>

                      <CardContent className={`pt-0 ${viewMode === "list" ? "flex items-center" : ""}`}>
                        <div className="flex gap-2">
                          {playingSound === sound.id ? (
                            <GlowingButton
                              onClick={() => stopSound(sound.id)}
                              size="sm"
                              className="bg-red-500/20 hover:bg-red-500/30 border-red-500/30"
                            >
                              <Pause className="h-4 w-4 mr-2" />
                              Stop
                            </GlowingButton>
                          ) : (
                            <GlowingButton onClick={() => playSound(sound.id, sound.file)} size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              Play
                            </GlowingButton>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-4 bg-black/30 rounded-lg px-6 py-3 border border-primary/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{soundEffects.length}</div>
                    <div className="text-sm text-white/60">Total Sounds</div>
                  </div>
                  <div className="w-px h-8 bg-primary/30"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{categories.length - 1}</div>
                    <div className="text-sm text-white/60">Categories</div>
                  </div>
                  <div className="w-px h-8 bg-primary/30"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{filteredSounds.length}</div>
                    <div className="text-sm text-white/60">Filtered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
