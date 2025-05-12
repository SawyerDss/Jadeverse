"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Film, ArrowLeft, Star, Trash2, Edit, ExternalLink, Heart } from "lucide-react"
import { useMovies, type Movie } from "@/lib/movies-context"
import { useAuth } from "@/lib/auth-context"
import { useNotification } from "@/lib/notification-context"
import GlowingButton from "@/components/glowing-button"
import { Button } from "@/components/ui/button"

export default function EntertainmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { movies, removeMovie, toggleFavorite } = useMovies()
  const { user } = useAuth()
  const { addNotification } = useNotification()
  const [item, setItem] = useState<Movie | null>(null)

  useEffect(() => {
    if (params.id) {
      const foundItem = movies.find((m) => m.id === params.id)
      if (foundItem) {
        setItem(foundItem)
      } else {
        router.push("/entertainment")
      }
    }
  }, [params.id, movies, router])

  if (!item) {
    return (
      <div className="py-16 text-center">
        <Film className="h-16 w-16 text-primary/50 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Loading content...</h2>
      </div>
    )
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      removeMovie(item.id)
      addNotification({
        title: "Item Deleted",
        message: `${item.title} has been removed from your collection.`,
        type: "success",
        duration: 3000,
      })
      router.push("/entertainment")
    }
  }

  const handleFavorite = () => {
    toggleFavorite(item.id)
    addNotification({
      title: item.isFavorite ? "Removed from Favorites" : "Added to Favorites",
      message: `${item.title} has been ${item.isFavorite ? "removed from" : "added to"} your favorites.`,
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
            onClick={() => router.push("/entertainment")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Entertainment
          </Button>
        </div>

        <div className="glass border border-primary/20 rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
            {/* Poster */}
            <div className="aspect-[2/3] bg-black/50 rounded-lg overflow-hidden relative">
              {item.image ? (
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="h-16 w-16 text-primary/50" />
                </div>
              )}

              {/* Content type badge */}
              {item.contentType === "show" && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-primary/80 text-white text-xs rounded-md">
                  TV Show
                </div>
              )}
            </div>

            {/* Details */}
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{item.title}</h1>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/20 text-white rounded-full text-sm">
                  {item.genre || "Unknown Genre"}
                </span>

                {item.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-white">{item.rating}</span>
                  </div>
                )}
              </div>

              <p className="text-white/80 mb-6">{item.description}</p>

              <div className="flex flex-wrap gap-3">
                {item.url && (
                  <GlowingButton
                    icon={<ExternalLink className="h-5 w-5" />}
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    Watch {item.contentType === "show" ? "Show" : "Movie"}
                  </GlowingButton>
                )}

                <Button
                  variant="outline"
                  className="border-primary/30 text-white hover:bg-primary/10"
                  onClick={handleFavorite}
                >
                  <Heart className={`h-5 w-5 mr-2 ${item.isFavorite ? "text-red-500 fill-red-500" : "text-white"}`} />
                  {item.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </Button>

                {user && !item.isPermanent && (
                  <>
                    <Button
                      variant="outline"
                      className="border-primary/30 text-white hover:bg-primary/10"
                      onClick={() => router.push(`/edit-content?type=movie&id=${item.id}`)}
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
