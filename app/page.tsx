"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import {
  Sparkles,
  Gamepad2,
  AppWindow,
  BookOpen,
  MessageSquare,
  DiscIcon as Discord,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { GlowingButton } from "@/components/glowing-button"
import AnimatedText from "@/components/animated-text"
import { useAuth } from "@/lib/auth-context"
import { useGames } from "@/lib/games-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { user } = useAuth()
  const { games } = useGames()
  const [featuredGames, setFeaturedGames] = useState<any[]>([])
  const [featuredGamesExpanded, setFeaturedGamesExpanded] = useState(true)
  const featuredGamesRef = useRef<HTMLDivElement>(null)

  // Get featured games
  useEffect(() => {
    if (games && games.length > 0) {
      // Get 3 random games to feature
      const randomGames = [...games].sort(() => 0.5 - Math.random()).slice(0, 3)
      setFeaturedGames(randomGames)
    }
  }, [games])

  const toggleFeaturedGames = () => {
    setFeaturedGamesExpanded(!featuredGamesExpanded)

    // Scroll to the section if expanding
    if (!featuredGamesExpanded && featuredGamesRef.current) {
      setTimeout(() => {
        featuredGamesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto">
        {/* Animated Mega Title */}
        <div className="mb-16 mt-8 text-center">
          <div className="animated-title-container">
            <h1 className="mega-title">
              <span className="jade-mega-text">s0l</span>
              <span className="verse-mega-text">ara</span>
            </h1>
            <div className="jade-text-glow w-64 h-1 mx-auto mt-4 rounded-full"></div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 text-bloom">
            <AnimatedText>Welcome to the Digital Universe</AnimatedText>
          </h2>
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mb-8 text-bloom">
            The best gaming website of 2025; play any game you want, request games at https://www.surveymonkey.com/r/XVWCP62
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/games">
              <GlowingButton icon={<Gamepad2 className="h-5 w-5" />}>Explore Games</GlowingButton>
            </Link>
            <Link href="/apps">
              <GlowingButton icon={<AppWindow className="h-5 w-5" />}>Discover Apps</GlowingButton>
            </Link>
            <Link href="https://discord.gg/k6m5xjwu" target="_blank" rel="noopener noreferrer">
              <GlowingButton icon={<Discord className="h-5 w-5" />}>Join Discord</GlowingButton>
            </Link>
          </div>
        </div>

        {/* Featured Games Section */}
        <div className="mb-16" ref={featuredGamesRef}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Star className="h-6 w-6 text-yellow-400 mr-2" />
              <h2 className="text-2xl md:text-3xl font-bold text-white text-bloom">Featured Games</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFeaturedGames}
              className="flex items-center text-primary hover:text-primary/80 hover:bg-primary/10"
            >
              {featuredGamesExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  <span>Show</span>
                </>
              )}
            </Button>
          </div>

          {featuredGamesExpanded && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredGames.map((game) => (
                  <Link href={`/games/${game.id}`} key={game.id}>
                    <Card className="glass border-primary/20 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20 group">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <div className="aspect-video bg-black/50 relative">
                            {game.image ? (
                              <img
                                src={game.image || "/placeholder.svg"}
                                alt={game.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Gamepad2 className="h-12 w-12 text-primary/50" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                              {game.title}
                            </h3>
                            <p className="text-sm text-white/70 line-clamp-1">{game.description}</p>
                          </div>
                          <div className="absolute top-2 right-2 bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                            Featured
                          </div>
                        </div>
                        <div className="p-4 pt-2 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="text-xs bg-black/30 text-white/70 px-2 py-1 rounded">
                              {game.category || "Action"}
                            </div>
                          </div>
                          <div className="text-xs text-white/50">{Math.floor(Math.random() * 1000) + 100} plays</div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-6">
                <Link href="/games">
                  <GlowingButton icon={<Gamepad2 className="h-5 w-5" />}>View All Games</GlowingButton>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="glass rounded-xl p-6 border border-primary/20 hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Gamepad2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-bloom-primary">Endless Games</h3>
            <p className="text-white/70">
              access many free games
            </p>
          </div>

          <div className="glass rounded-xl p-6 border border-primary/20 hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <AppWindow className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-bloom-primary">Useful Apps</h3>
            <p className="text-white/70">
              so many games to choose from
            </p>
          </div>

          <div className="glass rounded-xl p-6 border border-primary/20 hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-bloom-primary">Learning Resources</h3>
            <p className="text-white/70">
             you can even use the ai tool!
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass rounded-xl p-8 border border-primary/20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 text-bloom">Ready to Join the Adventure?</h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-6">
            create an account too
          </p>
          {!user ? (
            <Link href="/login">
              <GlowingButton icon={<Sparkles className="h-5 w-5" />}>Get Started</GlowingButton>
            </Link>
          ) : (
            <Link href="/games">
              <GlowingButton icon={<MessageSquare className="h-5 w-5" />}>go on the main website</GlowingButton>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
