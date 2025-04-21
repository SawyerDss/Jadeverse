"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useGames, type Game } from "@/lib/games-context"
import { Maximize, Minimize, ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GamePage() {
  const { id } = useParams()
  const { games } = useGames()
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const foundGame = games.find((g) => g.id === id)
    if (foundGame) {
      setGame(foundGame)
    } else {
      router.push("/games")
    }
  }, [games, id, router])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const goBack = () => {
    router.push("/games")
  }

  if (!game) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-primary">Loading game...</div>
      </div>
    )
  }

  return (
    <div className={`relative ${isFullscreen ? "fixed inset-0 z-50 bg-black" : "py-8"}`}>
      {/* Game header - only visible when not fullscreen */}
      {!isFullscreen && (
        <div className="max-w-7xl mx-auto mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={goBack} className="mr-2">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Games
            </Button>
            <h1 className="text-2xl font-bold text-white">{game.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {game.url && (
              <Button variant="outline" onClick={() => window.open(game.url, "_blank")} className="border-primary/30">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            )}
            <Button variant="outline" onClick={toggleFullscreen} className="border-primary/30">
              <Maximize className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
          </div>
        </div>
      )}

      {/* Game iframe container */}
      <div
        className={`relative bg-black ${
          isFullscreen
            ? "w-full h-full"
            : "aspect-video max-w-7xl mx-auto rounded-lg overflow-hidden border border-primary/20"
        }`}
      >
        {/* Game iframe */}
        {game.url ? (
          <iframe
            src={game.url}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white/70 text-center p-8">
              <div className="text-6xl mb-4">{game.icon || "🎮"}</div>
              <h2 className="text-2xl font-bold mb-2">{game.title}</h2>
              <p className="text-white/50 max-w-md mx-auto">{game.description}</p>
            </div>
          </div>
        )}

        {/* Fullscreen toggle button - only visible when fullscreen */}
        {isFullscreen && (
          <Button
            variant="outline"
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 bg-black/70 border-primary/30 hover:bg-black"
          >
            <Minimize className="h-4 w-4 mr-2" />
            Exit Fullscreen
          </Button>
        )}
      </div>
    </div>
  )
}
