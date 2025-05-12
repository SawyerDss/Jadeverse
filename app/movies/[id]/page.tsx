"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Film, ArrowLeft, Star, Calendar, Clock, Trash2, Edit, ExternalLink } from "lucide-react"
import { useMovies, type Movie } from "@/lib/movies-context"
import { useAuth } from "@/lib/auth-context"
import { useNotification } from "@/lib/notification-context"
import GlowingButton from "@/components/glowing-button"
import { Button } from "@/components/ui/button"

export default function MovieDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { movies, removeMovie, toggleFavorite } = useMovies()
  const { user } = useAuth()
  const { addNotification } = useNotification()
  const [movie, setMovie] = useState<Movie | null>(null)

  useEffect(() => {
    if (params.id) {
      const foundMovie = movies.find((m) => m.id === params.id)
      if (foundMovie) {
        setMovie(foundMovie)
      } else {
        router.push("/movies")
      }
    }
  }, [params.id, movies, router])

  if (!movie) {
    return (
      <div className="py-16 text-center">
        <Film className="h-16 w-16 text-primary/50 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Loading movie...</h2>
      </div>
    )
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      removeMovie(movie.id)
      addNotification({
        title: "Movie Deleted",
        message: `${movie.title} has been removed from your collection.`,
        type: "success",
        duration: 3000,
      })
      router.push("/movies")
    }
  }

  const handleFavorite = () => {
    toggleFavorite(movie.id)
    addNotification({
      title: movie.isFavorite ? "Removed from Favorites" : "Added to Favorites",
      message: `${movie.title} has been ${movie.isFavorite ? "removed from" : "added to"} your favorites.`,
      type: "success",
      duration: 3000,
    })
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-primary/10"
            onClick={() => router.push("/movies")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Movies
          </Button>
        </div>

        <div className="glass border border-primary/20 rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
            {/* Movie Poster */}
            <div className="aspect-[2/3] bg-black/50 rounded-lg overflow-hidden relative">
              {movie.image ? (
                <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="h-16 w-16 text-primary/50" />
                </div>
              )}

              {movie.isFavorite && (
                <div className="absolute top-2 right-2 bg-black/50 p-2 rounded-full">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                </div>
              )}
            </div>

            {/* Movie Details */}
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{movie.title}</h1>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/20 text-white rounded-full text-sm">
                  {movie.genre || "Unknown Genre"}
                </span>

                {movie.releaseYear && (
                  <div className="flex items-center text-white/70">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{movie.releaseYear}</span>
                  </div>
                )}

                {movie.duration && (
                  <div className="flex items-center text-white/70">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{movie.duration}</span>
                  </div>
                )}

                {movie.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-white">{movie.rating}</span>
                  </div>
                )}
              </div>

              <p className="text-white/80 mb-6">{movie.description}</p>

              <div className="flex flex-wrap gap-3">
                {movie.url && (
                  <GlowingButton
                    icon={<ExternalLink className="h-5 w-5" />}
                    onClick={() => window.open(movie.url, "_blank")}
                  >
                    Watch Movie
                  </GlowingButton>
                )}

                <Button
                  variant="outline"
                  className="border-primary/30 text-white hover:bg-primary/10"
                  onClick={handleFavorite}
                >
                  <Star
                    className={`h-5 w-5 mr-2 ${movie.isFavorite ? "text-yellow-400 fill-yellow-400" : "text-white"}`}
                  />
                  {movie.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </Button>

                {user && !movie.isPermanent && (
                  <>
                    <Button
                      variant="outline"
                      className="border-primary/30 text-white hover:bg-primary/10"
                      onClick={() => router.push(`/edit-content?type=movie&id=${movie.id}`)}
                    >
                      <Edit className="h-5 w-5 mr-2" />
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-5 w-5 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
