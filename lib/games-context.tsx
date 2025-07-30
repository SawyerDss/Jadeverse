"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { DEFAULT_GAMES } from "./default-games-data" // Import the default games as a fallback

export type Game = {
  id: string
  title: string
  description: string
  image: string
  category: string
  icon?: string
  url?: string
  createdBy?: string
  isCustom?: boolean
  type?: "game" | "app"
  isPermanent?: boolean
  isDev?: boolean
  isFavorite?: boolean
}

type GamesContextType = {
  games: Game[]
  addGame: (game: Omit<Game, "id">) => void
  removeGame: (id: string) => void
  toggleFavorite: (id: string) => void
}

const GamesContext = createContext<GamesContextType | undefined>(undefined)

// Developer email for permanent content
const DEV_EMAIL = "sawyer.debolt@stu.hsv-k12.org"

export function GamesProvider({ children }: { children: React.ReactNode }) {
  const [games, setGames] = useState<Game[]>([]) // Start with an empty array
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const loadGames = async () => {
      try {
        // Try to load from localStorage first
        const storedGames = localStorage.getItem("games")
        if (storedGames) {
          setGames(JSON.parse(storedGames))
        } else {
          // If no stored games, fetch from API
          const response = await fetch("/api/games")
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const apiGames: Game[] = await response.json()
          setGames(apiGames)
        }
      } catch (error) {
        console.error("Error loading games:", error)
        // Fallback to hardcoded defaults if API fails or localStorage is empty/corrupt
        setGames(DEFAULT_GAMES)
      } finally {
        setInitialized(true)
      }
    }

    loadGames()
  }, [])

  // Save games to localStorage whenever they change
  useEffect(() => {
    if (initialized) {
      localStorage.setItem("games", JSON.stringify(games))
    }
  }, [games, initialized])

  const addGame = (game: Omit<Game, "id">) => {
    const isDev = game.createdBy === DEV_EMAIL

    const newGame = {
      ...game,
      id: (game.type || "game") + "_" + Math.random().toString(36).substr(2, 9),
      isCustom: true,
      isPermanent: isDev, // Make games permanent if added by dev
      isDev: isDev, // Add dev tag
    }

    // Immediately update state for faster UI response
    setGames((prevGames) => [...prevGames, newGame])
  }

  const removeGame = (id: string) => {
    setGames((prevGames) => {
      // Don't remove permanent games
      const gameToRemove = prevGames.find((game) => game.id === id)
      if (gameToRemove?.isPermanent) return prevGames

      return prevGames.filter((game) => game.id !== id)
    })
  }

  const toggleFavorite = (id: string) => {
    setGames((prevGames) =>
      prevGames.map((game) => (game.id === id ? { ...game, isFavorite: !game.isFavorite } : game)),
    )
  }

  return (
    <GamesContext.Provider value={{ games, addGame, removeGame, toggleFavorite }}>{children}</GamesContext.Provider>
  )
}

export function useGames() {
  const context = useContext(GamesContext)
  if (context === undefined) {
    throw new Error("useGames must be used within a GamesProvider")
  }
  return context
}
