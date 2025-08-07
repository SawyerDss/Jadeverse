"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { DEFAULT_GAMES as FALLBACK_DEFAULT_GAMES } from "./default-games-data" // Import the default games as a fallback

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
  const [games, setGames] = useState<Game[]>([])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const loadGames = async () => {
      let apiGames: Game[] = []
      try {
        // Always fetch default games from API first
        const response = await fetch("/api/games")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        apiGames = await response.json()
      } catch (error) {
        console.error("Error fetching games from API, falling back to local defaults:", error)
        apiGames = FALLBACK_DEFAULT_GAMES // Use hardcoded fallback if API fails
      }

      // Load custom games from localStorage
      let customGames: Game[] = []
      try {
        const storedGames = localStorage.getItem("games")
        if (storedGames) {
          const parsedStoredGames: Game[] = JSON.parse(storedGames)
          // Filter out permanent games from localStorage to avoid duplicates/overwrites
          // and only keep truly custom (non-permanent) games added by the user
          customGames = parsedStoredGames.filter((game) => !game.isPermanent)
        }
      } catch (error) {
        console.error("Error loading custom games from localStorage:", error)
      }

      // Combine API games with custom games, ensuring uniqueness by ID
      const combinedGamesMap = new Map<string, Game>()

      // Add API games first (these are considered the "source of truth" for defaults)
      apiGames.forEach((game) => combinedGamesMap.set(game.id, game))

      // Add custom games, overwriting if an ID conflict exists (though it shouldn't for custom IDs)
      // or adding if new. Favorites from custom games should be preserved.
      customGames.forEach((customGame) => {
        const existingGame = combinedGamesMap.get(customGame.id)
        if (existingGame) {
          // If a custom game has the same ID as an API game, prioritize API game's core data
          // but keep custom game's favorite status if it's a custom game.
          if (customGame.isCustom) {
            combinedGamesMap.set(customGame.id, { ...existingGame, isFavorite: customGame.isFavorite })
          }
        } else {
          combinedGamesMap.set(customGame.id, customGame)
        }
      })

      setGames(Array.from(combinedGamesMap.values()))
      setInitialized(true)
    }

    loadGames()
  }, []) // Empty dependency array means this runs once on mount

  // Save games to localStorage whenever they change
  useEffect(() => {
    if (initialized) {
      // Only save custom games and favorite status of all games
      const gamesToSave = games.map((game) => ({
        ...game,
        // Only save isCustom and isFavorite for non-permanent games
        // For permanent games, only save isFavorite if it's toggled by user
        isCustom: game.isCustom || false,
        isPermanent: game.isPermanent || false, // Ensure this is saved correctly
        isFavorite: game.isFavorite || false,
      }))
      localStorage.setItem("games", JSON.stringify(gamesToSave))
    }
  }, [games, initialized])

  const addGame = useCallback((game: Omit<Game, "id">) => {
    const isDev = game.createdBy === DEV_EMAIL

    const newGame = {
      ...game,
      id: (game.type || "game") + "_" + Math.random().toString(36).substr(2, 9),
      isCustom: true,
      isPermanent: isDev, // Make games permanent if added by dev
      isDev: isDev, // Add dev tag
    }

    setGames((prevGames) => [...prevGames, newGame])
  }, [])

  const removeGame = useCallback((id: string) => {
    setGames((prevGames) => {
      const gameToRemove = prevGames.find((game) => game.id === id)
      if (gameToRemove?.isPermanent) {
        // If it's a permanent game, we don't remove it from the list,
        // but we can mark it as unfavorited if it was favorited.
        return prevGames.map((game) => (game.id === id ? { ...game, isFavorite: false } : game))
      }
      return prevGames.filter((game) => game.id !== id)
    })
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setGames((prevGames) =>
      prevGames.map((game) => (game.id === id ? { ...game, isFavorite: !game.isFavorite } : game)),
    )
  }, [])

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
