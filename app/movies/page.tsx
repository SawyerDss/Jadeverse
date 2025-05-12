"use client"

import { useState } from "react"
import { Film, Plus, Search, Star, Clock, Calendar, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useMovies, type Movie } from "@/lib/movies-context"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import GlowingButton from "@/components/glowing-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MoviesPage() {
  const { movies, toggleFavorite } = useMovies()
  const { user } = useAuth()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("title")

  // Get unique genres from movies
  const genres = ["all", ...Array.from(new Set(movies.map((movie) => movie.genre)))].filter(Boolean)

  // Filter and sort movies
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = selectedGenre === "all" || movie.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  // Sort movies
  const sortedMovies = [...filteredMovies].sort((a, b) => {
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

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Film className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              <span className="text-gradient">Movies</span>
            </h1>
          </div>

          {user && (
            <GlowingButton icon={<Plus className="h-5 w-5" />} onClick={() => router.push("/add-content?type=movie")}>
              Add Movie
            </GlowingButton>
          )}
        </div>

        {/* Filters and Search */}
        <div className="glass border border-primary/20 rounded-xl p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                placeholder="Search movies..."
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

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-white/50" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-black/30 border-primary/30 focus:border-primary">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                  <SelectItem value="releaseYear">Release Year (Newest)</SelectItem>
                  <SelectItem value="rating">Rating (Highest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        {sortedMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onFavorite={toggleFavorite} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Film className="h-16 w-16 text-primary/50 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No movies found</h3>
            <p className="text-white/70 mb-6">
              {searchTerm || selectedGenre !== "all"
                ? "Try adjusting your search or filters"
                : "Add some movies to your collection"}
            </p>
            {user && (
              <GlowingButton icon={<Plus className="h-5 w-5" />} onClick={() => router.push("/add-content?type=movie")}>
                Add Movie
              </GlowingButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function MovieCard({ movie, onFavorite }: { movie: Movie; onFavorite: (id: string) => void }) {
  return (
    <Link href={`/movies/${movie.id}`}>
      <Card className="glass border-primary/20 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20 group overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <div className="aspect-[2/3] bg-black/50 relative">
              {movie.image ? (
                <img
                  src={movie.image || "/placeholder.svg"}
                  alt={movie.title}
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
                {movie.title}
              </h3>

              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center">
                  <span className="text-xs bg-primary/20 text-white/90 px-2 py-1 rounded">
                    {movie.genre || "Unknown"}
                  </span>
                </div>
                {movie.rating && (
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 mr-1" />
                    <span className="text-xs text-white/90">{movie.rating}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center mt-2 text-xs text-white/70">
                {movie.releaseYear && (
                  <div className="flex items-center mr-3">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{movie.releaseYear}</span>
                  </div>
                )}
                {movie.duration && (
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{movie.duration}</span>
                  </div>
                )}
              </div>
            </div>

            {movie.isFavorite && (
              <div className="absolute top-2 right-2">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
