"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Sparkles, Search, Plus, Shuffle, Heart } from "lucide-react"
import { GlowingButton } from "@/components/glowing-button"
import { useGames } from "@/lib/games-context"
import { useAuth } from "@/lib/auth-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function GamesPage() {
  const { games, toggleFavorite } = useGames()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const router = useRouter()

  // Filter games based on search term, type, and favorites
  const filteredGames = games.filter(
    (game) =>
      (game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (game.type === "game" || !game.type) && // Include games without a type for backward compatibility
      (!showFavoritesOnly || game.isFavorite),
  )

  const goToRandomGame = () => {
    if (filteredGames.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredGames.length)
      const randomGame = filteredGames[randomIndex]
      router.push(`/games/${randomGame.id}`)
    }
  }

  const handleFavoriteToggle = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(id)
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-bloom-primary">
            <span className="text-gradient">Games</span> Library
          </h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
              <Input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/50 border-primary/30 focus:border-primary w-full md:w-64"
              />
            </div>

            <Button
              variant="outline"
              className={`border-primary/30 ${showFavoritesOnly ? "bg-primary/20" : ""}`}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Heart className={`h-4 w-4 mr-2 ${showFavoritesOnly ? "fill-primary" : ""}`} />
              Favorites
            </Button>

            <Button variant="outline" className="border-primary/30 hover:bg-primary/20" onClick={goToRandomGame}>
              <Shuffle className="h-4 w-4 mr-2" />
              Random
            </Button>

            {user && (
              <Link href="/add-content">
                <GlowingButton icon={<Plus className="h-4 w-4" />} className="whitespace-nowrap">
                  Add Content
                </GlowingButton>
              </Link>
            )}
          </div>
        </div>

        {filteredGames.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2 text-bloom">No games found</h3>
            <p className="text-white/70 mb-6">
              {showFavoritesOnly
                ? "You don't have any favorite games yet. Add some favorites to see them here."
                : "We couldn't find any games matching your search. Try different keywords or browse all games."}
            </p>
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="text-primary hover:text-primary/80">
                Clear search
              </button>
            )}
            {showFavoritesOnly && (
              <button onClick={() => setShowFavoritesOnly(false)} className="text-primary hover:text-primary/80 ml-4">
                Show all games
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="game-card glass rounded-xl overflow-hidden group relative"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={game.image || "/placeholder.svg"}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                  <div className="absolute top-2 right-2 bg-primary/80 text-white text-xs px-2 py-1 rounded-full shadow-lg shadow-primary/20">
                    {game.category}
                  </div>
                  {game.isDev && (
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                      DEV
                    </div>
                  )}
                  <button
                    onClick={(e) => handleFavoriteToggle(e, game.id)}
                    className="absolute top-2 right-16 p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${game.isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                        <span className="text-lg">{game.icon || "🎮"}</span>
                      </div>
                      <h3 className="game-card-title text-lg group-hover:text-primary transition-colors duration-300">
                        {game.title}
                      </h3>
                    </div>
                  </div>
                  <GlowingButton className="w-full py-2 px-4 text-base mt-4">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Play Now
                  </GlowingButton>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
