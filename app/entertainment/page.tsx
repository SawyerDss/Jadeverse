"use client"

import type React from "react"

import { useState } from "react"
import { Film, Plus, Search, Filter, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useMovies, type Movie } from "@/lib/movies-context"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import GlowingButton from "@/components/glowing-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EntertainmentPage() {
  const { movies, toggleFavorite } = useMovies()
  const { user } = useAuth()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("title")
  const [contentType, setContentType] = useState<string>("all")

  // Get unique genres from movies
  const genres = ["all", ...Array.from(new Set(movies.map((movie) => movie.genre)))].filter(Boolean)

  // Filter and sort movies
  const filteredContent = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = selectedGenre === "all" || movie.genre === selectedGenre
    const matchesType =
      contentType === "all" ||
      (contentType === "movies" && movie.contentType !== "show") ||
      (contentType === "shows" && movie.contentType === "show")
    return matchesSearch && matchesGenre && matchesType
  })

  // Sort content
  const sortedContent = [...filteredContent].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    } else if (sortBy === "releaseYear") {
      return (b.releaseYear || "0").localeCompare(a.releaseYear || "0")
    } else if (sortBy === "rating") {
      const ratingA = Number.parseFloat((a.rating || "0").split("/")[0])
      const ratingB = Number.parseFloat((b.rating || "0").split("/")[0])
      return ratingB - ratingA
    }
    return 0
  })

  const handleFavoriteToggle = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(id)
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Film className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              <span className="text-gradient">Entertainment</span>
            </h1>
          </div>

          {user && (
            <GlowingButton icon={<Plus className="h-5 w-5" />} onClick={() => router.push("/add-content?type=movie")}>
              Add Content
            </GlowingButton>
          )}
        </div>

        {/* Content Type Tabs */}
        <div className="mb-4">
          <Tabs defaultValue="all" value={contentType} onValueChange={setContentType} className="w-full">
            <TabsList className="grid grid-cols-3 max-w-md">
              <TabsTrigger value="all">All Content</TabsTrigger>
              <TabsTrigger value="movies">Movies</TabsTrigger>
              <TabsTrigger value="shows">TV Shows</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filters and Search */}
        <div className="glass border border-primary/20 rounded-xl p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                placeholder="Search entertainment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/30 border-primary/30 focus:border-primary"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-white/50" />
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="bg-black/30 border-primary/30 focus:border-primary">
                  <SelectValue placeholder="Filter by genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre === "all" ? "All Genres" : genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {sortedContent.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedContent.map((item) => (
              <EntertainmentCard key={item.id} item={item} onFavorite={(e) => handleFavoriteToggle(e, item.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Film className="h-16 w-16 text-primary/50 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No content found</h3>
            <p className="text-white/70 mb-6">
              {searchTerm || selectedGenre !== "all" || contentType !== "all"
                ? "Try adjusting your search or filters"
                : "Add some movies or shows to your collection"}
            </p>
            {user && (
              <GlowingButton icon={<Plus className="h-5 w-5" />} onClick={() => router.push("/add-content?type=movie")}>
                Add Content
              </GlowingButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function EntertainmentCard({ item, onFavorite }: { item: Movie; onFavorite: (e: React.MouseEvent) => void }) {
  return (
    <Link href={`/entertainment/${item.id}`}>
      <Card className="glass border-primary/20 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20 group overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <div className="aspect-[2/3] bg-black/50 relative">
              {item.image ? (
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="h-12 w-12 text-primary/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {item.title}
              </h3>
            </div>

            {/* Favorite button */}
            <button
              onClick={onFavorite}
              className="absolute top-2 right-2 p-2 bg-black/50 rounded-full transition-all duration-300 hover:bg-black/70"
            >
              <Heart className={`h-5 w-5 ${item.isFavorite ? "text-red-500 fill-red-500" : "text-white/70"}`} />
            </button>

            {/* Content type badge */}
            {item.contentType === "show" && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-primary/80 text-white text-xs rounded-md">TV Show</div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
