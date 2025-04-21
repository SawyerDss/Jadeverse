"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

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

// DEVELOPER CONFIGURATION: Add your default games and apps here
// You can customize this array to add your own default content
const DEFAULT_GAMES: Game[] = [
  {
    id: "7",
    title: "Monkey Mart",
    description: "Classic 2048 puzzle game with a jade theme.",
    image: "https://selenite.global.ssl.fastly.net/semag/monkeymart/unnamed.png",
    category: "Puzzle",
    icon: "🎮",
    url: "https://selenite.global.ssl.fastly.net/semag/monkeymart/index.html",
    type: "game",
    isPermanent: true,
  },
  // Example apps
  {
    id: "app_1",
    title: "Achievement Unlocked",
    description: "Simple calculator app for basic math operations.",
    image: "https://selenite.global.ssl.fastly.net/semag/achieveunlocked/icon.png",
    category: "Entertainment",
    icon: "?",
    url: "https://selenite.global.ssl.fastly.net/semag/achieveunlocked/index.html",
    type: "game",
    isPermanent: true,
  },
  {
    id: "app_2",
    title: "Achievement Unlocked 2",
    description: "Check the weather forecast for any location.",
    image: "https://selenite.global.ssl.fastly.net/semag/achieveunlocked2/icon.png",
    category: "Utility",
    icon: "?",
    url: "https://selenite.global.ssl.fastly.net/semag/achieveunlocked2/index.html",
    type: "game",
    isPermanent: true,
  },
  {
    id: "app_3",
    title: "Bad Ice-Cream",
    description: "Take and organize your notes.",
    image: "https://selenite.global.ssl.fastly.net/semag/badicecream/bad-ice-cream.png",
    category: "Productivity",
    icon: "?",
    url: "https://selenite.global.ssl.fastly.net/semag/badicecream/index.html",
    type: "game",
    isPermanent: true,
  },
  {
    id: "app_4",
    title: "Bad Ice-Cream 2",
    description: "Take and organize your notes.",
    image: "https://selenite.global.ssl.fastly.net/semag/badicecream2/bad-ice-cream-2.png",
    category: "Productivity",
    icon: "?",
    url: "https://selenite.global.ssl.fastly.net/semag/badicecream2/index.html",
    type: "game",
    isPermanent: true,
  },
  {
    id: "app_5",
    title: "Bad Ice-Cream 3",
    description: "Take and organize your notes.",
    image: "https://selenite.global.ssl.fastly.net/semag/badicecream3/bad-ice-cream-3.png",
    category: "Productivity",
    icon: "?",
    url: "https://selenite.global.ssl.fastly.net/semag/badicecream3/index.html",
    type: "game",
    isPermanent: true,
  },
  {
    id: "app_6",
    title: "Bad Time Simulator",
    description: "Take and organize your notes.",
    image: "https://selenite.global.ssl.fastly.net/semag/badtimesimulator/icon-114.png",
    category: "Productivity",
    icon: "?",
    url: "https://selenite.global.ssl.fastly.net/semag/badtimesimulator/index.html",
    type: "game",
    isPermanent: true,
  },
  {
    id: "app_7",
    title: "Cut the Rope",
    description: "Take and organize your notes.",
    image: "https://selenite.global.ssl.fastly.net/semag/cuttherope/icon.png",
    category: "Productivity",
    icon: "?",
    url: "https://selenite.global.ssl.fastly.net/semag/cuttherope/index.html",
    type: "game",
    isPermanent: true,
  },
  {
    id: "app_8",
    title: "Cut the Rope Holiday",
    description: "Take and organize your notes.",
    image: "https://selenite.global.ssl.fastly.net/semag/cuttherope-holiday/Holiday_Gift.webp",
    category: "Productivity",
    icon: "?",
    url: "https://selenite.global.ssl.fastly.net/semag/cuttherope-holiday/index.html",
    type: "game",
    isPermanent: true,
  },
  // Add more default games and apps here
]

export function GamesProvider({ children }: { children: React.ReactNode }) {
  const [games, setGames] = useState<Game[]>(DEFAULT_GAMES)

  // Load games from localStorage on initial load
  useEffect(() => {
    const storedGames = localStorage.getItem("games")
    if (storedGames) {
      setGames(JSON.parse(storedGames))
    }
  }, [])

  // Save games to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("games", JSON.stringify(games))
  }, [games])

  const addGame = (game: Omit<Game, "id">) => {
    const isDev = game.createdBy === DEV_EMAIL

    const newGame = {
      ...game,
      id: (game.type || "game") + "_" + Math.random().toString(36).substr(2, 9),
      isCustom: true,
      isPermanent: isDev, // Make games permanent if added by dev
      isDev: isDev, // Add dev tag
    }
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
