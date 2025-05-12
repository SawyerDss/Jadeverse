"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useGames, type Game } from "@/lib/games-context"
import { Maximize, Minimize, ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AppPage() {
  const { id } = useParams()
  const { games } = useGames()
  const router = useRouter()
  const [app, setApp] = useState<Game | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const appContainerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const foundApp = games.find((g) => g.id === id)
    if (foundApp && foundApp.type === "app") {
      setApp(foundApp)
    } else {
      router.push("/apps")
    }
  }, [games, id, router])

  const toggleFullscreen = () => {
    if (!appContainerRef.current) return

    if (!isFullscreen) {
      if (appContainerRef.current.requestFullscreen) {
        appContainerRef.current
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
    router.push("/apps")
  }

  if (!app) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-primary">Loading app...</div>
      </div>
    )
  }

  return (
    <div className={`relative ${isFullscreen ? "fixed inset-0 z-50 bg-black" : "py-8"}`}>
      {/* App header - only visible when not fullscreen */}
      {!isFullscreen && (
        <div className="max-w-7xl mx-auto mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={goBack} className="mr-2">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Apps
            </Button>
            <h1 className="text-2xl font-bold text-white text-bloom-primary">{app.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {app.url && (
              <Button variant="outline" onClick={() => window.open(app.url, "_blank")} className="border-primary/30">
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

      {/* App iframe container */}
      <div
        ref={appContainerRef}
        className={`relative bg-black ${
          isFullscreen
            ? "w-full h-full"
            : "aspect-video max-w-7xl mx-auto rounded-lg overflow-hidden border border-primary/20"
        }`}
      >
        {/* App iframe */}
        {app.url ? (
          <iframe
            ref={iframeRef}
            src={app.url}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white/70 text-center p-8">
              <div className="text-6xl mb-4">{app.icon || "📱"}</div>
              <h2 className="text-2xl font-bold mb-2 text-bloom">{app.title}</h2>
              <p className="text-white/50 max-w-md mx-auto">{app.description}</p>
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
