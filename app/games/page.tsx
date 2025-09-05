"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useGames } from "@/lib/games-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Search, Heart, HeartCrack, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useSettings } from "@/lib/settings-context"

export default function GamesPage() {
  const { games, toggleFavorite } = useGames()
  const { user } = useAuth()
  const { settings } = useSettings()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")
  const [showFavorites, setShowFavorites] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [sortOption, setSortOption] = useState("recently-played")

  useEffect(() => {
    setIsClient(true)
  }, [])

  const categories = useMemo(() => {
    const uniqueCategories = new Set(games.map((game) => game.category))
    return ["All", ...Array.from(uniqueCategories)].sort()
  }, [games])

  const filteredGames = useMemo(() => {
    let filtered = games

    if (searchTerm) {
      filtered = filtered.filter((game) => game.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (filterCategory !== "All") {
      filtered = filtered.filter((game) => game.category === filterCategory)
    }

    if (showFavorites) {
      filtered = filtered.filter((game) => game.isFavorite)
    }

    // Apply sorting
    if (sortOption === "a-z") {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortOption === "z-a") {
      filtered = filtered.sort((a, b) => b.title.localeCompare(a.title))
    } else if (sortOption === "recently-played") {
      // Sort by recently played (assuming games have a lastPlayed property, or just keep original order)
      filtered = [...filtered] // Keep original order for now
    }

    return filtered
  }, [games, searchTerm, filterCategory, showFavorites, sortOption])

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg">Loading experiences...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">Experience Library</h1>

      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-1/2">
          <Input
            type="text"
            placeholder="Search experiences..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 border border-primary/30 text-white placeholder-white/70 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
        </div>

        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 rounded-full bg-white/10 border border-primary/30 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          >
            {categories.map((category) => (
              <option key={category} value={category} className="bg-black text-white">
                {category}
              </option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 rounded-full bg-white/10 border border-primary/30 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          >
            <option value="recently-played" className="bg-black text-white">
              Recently Played
            </option>
            <option value="a-z" className="bg-black text-white">
              A-Z
            </option>
            <option value="z-a" className="bg-black text-white">
              Z-A
            </option>
          </select>

          <Button
            onClick={() => {
              const randomGame = filteredGames[Math.floor(Math.random() * filteredGames.length)]
              if (randomGame) {
                window.location.href = `/games/${randomGame.id}`
              }
            }}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform duration-300"
          >
            🎲 Random Game
          </Button>

          {user && (
            <Button
              onClick={() => setShowFavorites(!showFavorites)}
              className={cn(
                "px-4 py-2 rounded-full transition-all duration-300",
                showFavorites
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-white/10 text-white/70 hover:bg-primary/20 hover:text-white",
              )}
            >
              {showFavorites ? <HeartCrack className="mr-2" size={20} /> : <Heart className="mr-2" size={20} />}
              {showFavorites ? "Show All" : "Favorites"}
            </Button>
          )}

          {user && settings.allowCustomContent && (
            <Link href="/add-game">
              <Button className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30 hover:scale-105 transition-transform duration-300">
                <PlusCircle className="mr-2" size={20} />
                Add Experience
              </Button>
            </Link>
          )}
        </div>
      </div>

      {filteredGames.length === 0 ? (
        <p className="text-white text-center text-lg mt-16">No experiences found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredGames.map((game, index) => (
            <Card
              key={game.id}
              className="bg-white/5 border border-primary/20 rounded-xl overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 relative group"
            >
              <Link href={`/games/${game.id}`} className="block">
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={game.image || "/placeholder.svg?height=192&width=256&text=Game"}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 10}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=192&width=256&text=Game"
                    }}
                  />
                  {game.icon && (
                    <div className="absolute top-2 left-2 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-lg">
                      {game.icon}
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <CardTitle className="text-white text-lg font-semibold truncate mb-2">{game.title}</CardTitle>
                  <div className="flex items-center justify-between mt-3 text-white/80 text-xs">
                    <span className="bg-primary/20 text-primary px-2 py-1 rounded-full">{game.category}</span>
                    {game.isDev && <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">Dev</span>}
                  </div>
                </CardContent>
              </Link>
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(game.id)}
                  className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 hover:text-primary transition-all duration-300 rounded-full p-2"
                  aria-label={game.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  {game.isFavorite ? <Heart className="fill-primary text-primary" size={20} /> : <Heart size={20} />}
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
