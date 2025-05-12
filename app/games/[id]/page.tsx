"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useGames, type Game } from "@/lib/games-context"
import { Maximize, Minimize, ArrowLeft, ExternalLink, Save, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotification } from "@/lib/notification-context"

export default function GamePage() {
  const { id } = useParams()
  const { games } = useGames()
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [gameSaves, setGameSaves] = useState<{ [key: string]: string }>({})
  const { addNotification } = useNotification()
  const gameContainerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const foundGame = games.find((g) => g.id === id)
    if (foundGame) {
      setGame(foundGame)

      // Load saved games from localStorage
      const savedGames = localStorage.getItem(`game_saves_${foundGame.id}`)
      if (savedGames) {
        try {
          setGameSaves(JSON.parse(savedGames))
        } catch (e) {
          console.error("Failed to parse saved games:", e)
        }
      }
    } else {
      router.push("/games")
    }
  }, [games, id, router])

  const toggleFullscreen = () => {
    if (!gameContainerRef.current) return

    if (!isFullscreen) {
      if (gameContainerRef.current.requestFullscreen) {
        gameContainerRef.current
          .requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch((err) => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`)
            // Fallback to our custom fullscreen if browser API fails
            setIsFullscreen(true)
          })
      } else {
        // Fallback for browsers that don't support the Fullscreen API
        setIsFullscreen(true)
      }
    } else {
      if (document.fullscreenElement) {
        document
          .exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch((err) => {
            console.error(`Error attempting to exit fullscreen: ${err.message}`)
            setIsFullscreen(false)
          })
      } else {
        // Just use our custom fullscreen exit if not using browser API
        setIsFullscreen(false)
      }
    }
  }

  // Listen for fullscreen change events from the browser
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const goBack = () => {
    router.push("/games")
  }

  const saveGame = () => {
    if (!game) return

    const saveName = `Save_${new Date().toISOString().slice(0, 10)}_${Math.floor(Math.random() * 1000)}`
    const saveData = {
      gameId: game.id,
      gameName: game.title,
      timestamp: new Date().toISOString(),
      // In a real implementation, you would save actual game state data
      data: JSON.stringify({
        level: Math.floor(Math.random() * 10) + 1,
        score: Math.floor(Math.random() * 10000),
        items: ["sword", "shield", "potion"],
        position: { x: Math.random() * 100, y: Math.random() * 100 },
      }),
    }

    const updatedSaves = {
      ...gameSaves,
      [saveName]: JSON.stringify(saveData),
    }

    setGameSaves(updatedSaves)
    localStorage.setItem(`game_saves_${game.id}`, JSON.stringify(updatedSaves))

    addNotification({
      title: "Game Saved",
      message: `Your progress in ${game.title} has been saved`,
      type: "success",
      duration: 3000,
    })
  }

  const downloadSave = (saveName: string) => {
    if (!gameSaves[saveName]) return

    const saveData = gameSaves[saveName]
    const blob = new Blob([saveData], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `${saveName}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    addNotification({
      title: "Save Downloaded",
      message: `Your save file has been downloaded`,
      type: "success",
      duration: 3000,
    })
  }

  const uploadSave = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!game || !e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const saveData = JSON.parse(event.target?.result as string)

        // Validate the save data
        if (!saveData.gameId || saveData.gameId !== game.id) {
          throw new Error("Invalid save file for this game")
        }

        const saveName = `Uploaded_${new Date().toISOString().slice(0, 10)}_${Math.floor(Math.random() * 1000)}`
        const updatedSaves = {
          ...gameSaves,
          [saveName]: event.target?.result as string,
        }

        setGameSaves(updatedSaves)
        localStorage.setItem(`game_saves_${game.id}`, JSON.stringify(updatedSaves))

        addNotification({
          title: "Save Uploaded",
          message: `Your save file has been uploaded successfully`,
          type: "success",
          duration: 3000,
        })
      } catch (error) {
        addNotification({
          title: "Upload Failed",
          message: `Failed to upload save file: ${error instanceof Error ? error.message : "Unknown error"}`,
          type: "error",
          duration: 5000,
        })
      }
    }

    reader.readAsText(file)
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
            <div className="relative">
              <input type="file" id="save-upload" className="hidden" accept=".json" onChange={uploadSave} />
              <Button
                variant="outline"
                onClick={() => document.getElementById("save-upload")?.click()}
                className="border-primary/30"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Save
              </Button>
            </div>
            <Button variant="outline" onClick={saveGame} className="border-primary/30">
              <Save className="h-4 w-4 mr-2" />
              Save Game
            </Button>
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
        ref={gameContainerRef}
        className={`relative bg-black ${
          isFullscreen
            ? "w-full h-full"
            : "aspect-video max-w-7xl mx-auto rounded-lg overflow-hidden border border-primary/20"
        }`}
      >
        {/* Game iframe */}
        {game.url ? (
          <iframe
            ref={iframeRef}
            src={game.url}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
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

      {/* Game saves section - only visible when not fullscreen */}
      {!isFullscreen && Object.keys(gameSaves).length > 0 && (
        <div className="max-w-7xl mx-auto mt-6">
          <h2 className="text-xl font-bold text-white mb-4">Your Saved Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(gameSaves).map(([saveName, saveData]) => {
              const saveInfo = { timestamp: "", level: 0, score: 0 }
              try {
                const parsed = JSON.parse(saveData)
                saveInfo.timestamp = new Date(parsed.timestamp).toLocaleString()
                const gameData = JSON.parse(parsed.data)
                saveInfo.level = gameData.level
                saveInfo.score = gameData.score
              } catch (e) {
                console.error("Failed to parse save data:", e)
              }

              return (
                <div key={saveName} className="glass rounded-lg p-4 border border-primary/20">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white">{saveName.replace(/_/g, " ")}</h3>
                    <Button variant="ghost" size="sm" onClick={() => downloadSave(saveName)} className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                  <div className="text-sm text-white/70">
                    <p>Saved: {saveInfo.timestamp}</p>
                    <p>Level: {saveInfo.level}</p>
                    <p>Score: {saveInfo.score.toLocaleString()}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
