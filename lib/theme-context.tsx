"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { NotificationContext } from "@/lib/notification-context"

type Theme = "jade" | "blue" | "purple" | "red" | "orange" | "rainbow" | "custom" | "neon"

type CustomColors = {
  primary: string
  secondary: string
  text: string
  background: string
}

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme, customColors?: CustomColors) => void
  customColors: CustomColors | null
}

const defaultCustomColors: CustomColors = {
  primary: "#10b981",
  secondary: "#059669",
  text: "#ffffff",
  background: "#000000",
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("jade")
  const [customColors, setCustomColors] = useState<CustomColors | null>(null)
  const notificationContext = useContext(NotificationContext)
  const addNotification = notificationContext?.addNotification || (() => {})

  // Load theme from localStorage on initial load
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme
    const storedCustomColors = localStorage.getItem("custom-colors")

    if (storedTheme) {
      setThemeState(storedTheme)
      document.documentElement.setAttribute("data-theme", storedTheme)
    }

    if (storedCustomColors) {
      try {
        const parsedColors = JSON.parse(storedCustomColors)
        setCustomColors(parsedColors)

        if (storedTheme === "custom") {
          applyCustomColors(parsedColors)
        }
      } catch (e) {
        console.error("Failed to parse custom colors:", e)
      }
    }
  }, [])

  // Apply custom colors to CSS variables
  const applyCustomColors = (colors: CustomColors) => {
    const root = document.documentElement
    const { primary, secondary, text, background } = colors

    // Convert hex to HSL
    const primaryHSL = hexToHSL(primary)
    const secondaryHSL = hexToHSL(secondary)

    if (primaryHSL && secondaryHSL) {
      root.style.setProperty("--primary", primaryHSL)
      root.style.setProperty("--secondary", secondaryHSL)
      root.style.setProperty("--accent", primaryHSL)
      root.style.setProperty("--ring", primaryHSL)
      root.style.setProperty("--border", primaryHSL)
      root.style.setProperty("--input", primaryHSL)

      // Set foreground and background colors
      root.style.setProperty("--foreground", hexToHSL(text) || "0 0% 100%")
      root.style.setProperty("--background", hexToHSL(background) || "0 0% 0%")
    }
  }

  // Set theme and save to localStorage
  const setTheme = (newTheme: Theme, newCustomColors?: CustomColors) => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)

    // Reset custom color styles when not using custom theme
    if (newTheme !== "custom") {
      const root = document.documentElement
      root.style.removeProperty("--primary")
      root.style.removeProperty("--secondary")
      root.style.removeProperty("--accent")
      root.style.removeProperty("--ring")
      root.style.removeProperty("--border")
      root.style.removeProperty("--input")
      root.style.removeProperty("--foreground")
      root.style.removeProperty("--background")
    }

    // Handle custom theme colors
    if (newTheme === "custom") {
      const colors = newCustomColors || customColors || defaultCustomColors
      setCustomColors(colors)
      localStorage.setItem("custom-colors", JSON.stringify(colors))
      applyCustomColors(colors)
    }

    // Show notification
    addNotification({
      title: "Theme Changed",
      message: `Theme has been updated to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}`,
      type: "success",
      duration: 3000,
    })
  }

  return <ThemeContext.Provider value={{ theme, setTheme, customColors }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

// Helper function to convert hex to HSL string format
function hexToHSL(hex: string): string | null {
  // Remove the # if present
  hex = hex.replace("#", "")

  // Convert hex to RGB
  const r = Number.parseInt(hex.substring(0, 2), 16) / 255
  const g = Number.parseInt(hex.substring(2, 4), 16) / 255
  const b = Number.parseInt(hex.substring(4, 6), 16) / 255

  // Find min and max values of RGB
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  // Calculate lightness
  let l = (max + min) / 2

  let h, s

  if (max === min) {
    // Achromatic (grey)
    h = 0
    s = 0
  } else {
    // Calculate saturation
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    // Calculate hue
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
      default:
        h = 0
    }

    h = Math.round(h * 60)
    if (h < 0) h += 360
  }

  // Convert to percentages
  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return `${h}, ${s}%, ${l}%`
}
