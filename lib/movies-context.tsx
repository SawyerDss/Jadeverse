"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Movie = {
  id: string
  title: string
  description: string
  image: string
  genre: string
  icon?: string
  url?: string
  createdBy?: string
  isCustom?: boolean
  isPermanent?: boolean
  isDev?: boolean
  isFavorite?: boolean
  releaseYear?: string
  duration?: string
  rating?: string
  contentType?: "movie" | "show"
  seasons?: number
  episodes?: number
}

type MoviesContextType = {
  movies: Movie[]
  addMovie: (movie: Omit<Movie, "id">) => void
  removeMovie: (id: string) => void
  toggleFavorite: (id: string) => void
}

// Developer email for permanent content
const DEV_EMAIL = "sawyer.debolt@stu.hsv-k12.org"

// Default movies and shows
const DEFAULT_CONTENT: Movie[] = [
  {
    id: "movie_1",
    title: "The Matrix",
    description:
      "A computer hacker learns about the true nature of reality and his role in the war against its controllers.",
    image:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    genre: "Sci-Fi",
    icon: "🎬",
    url: "https://www.youtube.com/embed/vKQi3bBA1y8",
    releaseYear: "1999",
    duration: "2h 16m",
    rating: "8.7/10",
    isPermanent: true,
    contentType: "movie",
  },
  {
    id: "movie_2",
    title: "Inception",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    image: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    genre: "Sci-Fi",
    icon: "🎬",
    url: "https://www.youtube.com/embed/YoHD9XEInc0",
    releaseYear: "2010",
    duration: "2h 28m",
    rating: "8.8/10",
    isPermanent: true,
    contentType: "movie",
  },
  {
    id: "movie_3",
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    image:
      "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    genre: "Sci-Fi",
    icon: "🎬",
    url: "https://www.youtube.com/embed/zSWdZVtXT7E",
    releaseYear: "2014",
    duration: "2h 49m",
    rating: "8.6/10",
    isPermanent: true,
    contentType: "movie",
  },
  {
    id: "show_1",
    title: "Stranger Things",
    description:
      "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.",
    image:
      "https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    genre: "Sci-Fi",
    icon: "📺",
    url: "https://www.youtube.com/embed/b9EkMc79ZSU",
    releaseYear: "2016",
    rating: "8.7/10",
    isPermanent: true,
    contentType: "show",
    seasons: 4,
    episodes: 34,
  },
  {
    id: "show_2",
    title: "Breaking Bad",
    description:
      "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    image:
      "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
    genre: "Drama",
    icon: "📺",
    url: "https://www.youtube.com/embed/HhesaQXLuRY",
    releaseYear: "2008",
    rating: "9.5/10",
    isPermanent: true,
    contentType: "show",
    seasons: 5,
    episodes: 62,
  },
]

const MoviesContext = createContext<MoviesContextType | undefined>(undefined)

export function MoviesProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>(DEFAULT_CONTENT)

  // Load movies from localStorage on initial load
  useEffect(() => {
    try {
      const storedMovies = localStorage.getItem("entertainment")
      if (storedMovies) {
        setMovies(JSON.parse(storedMovies))
      }
    } catch (error) {
      console.error("Error loading entertainment from localStorage:", error)
    }
  }, [])

  // Save movies to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("entertainment", JSON.stringify(movies))
    } catch (error) {
      console.error("Error saving entertainment to localStorage:", error)
    }
  }, [movies])

  const addMovie = (movie: Omit<Movie, "id">) => {
    try {
      const isDev = movie.createdBy === DEV_EMAIL
      const contentType = movie.contentType || "movie"
      const idPrefix = contentType === "show" ? "show_" : "movie_"

      const newMovie = {
        ...movie,
        id: idPrefix + Math.random().toString(36).substr(2, 9),
        isCustom: true,
        isPermanent: isDev,
        isDev: isDev,
        contentType,
      }
      setMovies((prevMovies) => [...prevMovies, newMovie])
    } catch (error) {
      console.error("Error adding entertainment item:", error)
    }
  }

  const removeMovie = (id: string) => {
    try {
      setMovies((prevMovies) => {
        // Don't remove permanent movies
        const movieToRemove = prevMovies.find((movie) => movie.id === id)
        if (movieToRemove?.isPermanent) return prevMovies

        return prevMovies.filter((movie) => movie.id !== id)
      })
    } catch (error) {
      console.error("Error removing entertainment item:", error)
    }
  }

  const toggleFavorite = (id: string) => {
    try {
      setMovies((prevMovies) =>
        prevMovies.map((movie) => (movie.id === id ? { ...movie, isFavorite: !movie.isFavorite } : movie)),
      )
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  return (
    <MoviesContext.Provider value={{ movies, addMovie, removeMovie, toggleFavorite }}>
      {children}
    </MoviesContext.Provider>
  )
}

export function useMovies() {
  const context = useContext(MoviesContext)
  if (context === undefined) {
    throw new Error("useMovies must be used within a MoviesProvider")
  }
  return context
}
