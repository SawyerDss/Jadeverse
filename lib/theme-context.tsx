"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "jade" | "blue" | "purple" | "red" | "orange" | "rainbow" | "custom" | "neon"

type CustomColors = {
  primary: string
  secondary: string
  text: string
  background: string
  accent?: string
  muted?: string
  border?: string
}

type CustomEffects = {
  bloomIntensity?: number
  animationSpeed?: number
  borderRadius?: number
  glassOpacity?: number
  enableGlow?: boolean
  enableAnimations?: boolean
  enableBlur?: boolean
  enableGradients?: boolean
}

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme, customColors?: CustomColors, customEffects?: CustomEffects) => void
  customColors: CustomColors | null
  customEffects: CustomEffects | null
}

const defaultCustomColors: CustomColors = {
  primary: "#10b981",
  secondary: "#059669",
  text: "#ffffff",
  background: "#000000",
  accent: "#3b82f6",
  muted: "#1f2937",
  border: "#374151",
}

const defaultCustomEffects: CustomEffects = {
  bloomIntensity: 0.5,
  animationSpeed: 1.0,
  borderRadius: 0.5,
  glassOpacity: 0.3,
  enableGlow: true,
  enableAnimations: true,
  enableBlur: true,
  enableGradients: true,
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("jade")
  const [customColors, setCustomColors] = useState<CustomColors | null>(null)
  const [customEffects, setCustomEffects] = useState<CustomEffects | null>(null)

  // Load theme from localStorage on initial load
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme
    const storedCustomColors = localStorage.getItem("custom-colors")
    const storedCustomEffects = localStorage.getItem("custom-effects")

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

    if (storedCustomEffects) {
      try {
        const parsedEffects = JSON.parse(storedCustomEffects)
        setCustomEffects(parsedEffects)

        if (storedTheme === "custom") {
          applyCustomEffects(parsedEffects)
        }
      } catch (e) {
        console.error("Failed to parse custom effects:", e)
      }
    }
  }, [])

  // Apply custom colors to CSS variables
  const applyCustomColors = (colors: CustomColors) => {
    const root = document.documentElement
    const { primary, secondary, text, background, accent, muted, border } = colors

    // Convert hex to HSL
    const primaryHSL = hexToHSL(primary)
    const secondaryHSL = hexToHSL(secondary)
    const accentHSL = accent ? hexToHSL(accent) : primaryHSL
    const mutedHSL = muted ? hexToHSL(muted) : "215 25% 27%"
    const borderHSL = border ? hexToHSL(border) : primaryHSL

    if (primaryHSL && secondaryHSL) {
      root.style.setProperty("--primary", primaryHSL)
      root.style.setProperty("--secondary", secondaryHSL)
      root.style.setProperty("--accent", accentHSL)
      root.style.setProperty("--ring", primaryHSL)
      root.style.setProperty("--border", borderHSL)
      root.style.setProperty("--input", primaryHSL)
      root.style.setProperty("--muted", mutedHSL)

      // Set foreground and background colors
      root.style.setProperty("--foreground", hexToHSL(text) || "0 0% 100%")
      root.style.setProperty("--background", hexToHSL(background) || "0 0% 0%")
    }
  }

  // Apply custom effects to CSS variables
  const applyCustomEffects = (effects: CustomEffects) => {
    const root = document.documentElement

    if (effects.bloomIntensity !== undefined) {
      root.style.setProperty("--bloom-intensity", effects.bloomIntensity.toString())
    }

    if (effects.animationSpeed !== undefined) {
      root.style.setProperty("--animation-speed", effects.animationSpeed.toString())
    }

    if (effects.borderRadius !== undefined) {
      root.style.setProperty("--border-radius", `${effects.borderRadius * 20}px`)
    }

    if (effects.glassOpacity !== undefined) {
      root.style.setProperty("--glass-opacity", effects.glassOpacity.toString())
    }

    // Toggle effect classes
    if (effects.enableGlow !== undefined) {
      root.classList.toggle("disable-glow", !effects.enableGlow)
    }

    if (effects.enableAnimations !== undefined) {
      root.classList.toggle("disable-animations", !effects.enableAnimations)
    }

    if (effects.enableBlur !== undefined) {
      root.classList.toggle("disable-blur", !effects.enableBlur)
    }

    if (effects.enableGradients !== undefined) {
      root.classList.toggle("disable-gradients", !effects.enableGradients)
    }
  }

  // Set theme and save to localStorage
  const setTheme = (newTheme: Theme, newCustomColors?: CustomColors, newCustomEffects?: CustomEffects) => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)

    // Reset custom styles when not using custom theme
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
      root.style.removeProperty("--muted")

      // Reset effect properties
      root.style.removeProperty("--bloom-intensity")
      root.style.removeProperty("--animation-speed")
      root.style.removeProperty("--border-radius")
      root.style.removeProperty("--glass-opacity")

      // Reset effect classes
      root.classList.remove("disable-glow", "disable-animations", "disable-blur", "disable-gradients")
    }

    // Handle custom theme colors and effects
    if (newTheme === "custom") {
      const colors = newCustomColors || customColors || defaultCustomColors
      setCustomColors(colors)
      localStorage.setItem("custom-colors", JSON.stringify(colors))
      applyCustomColors(colors)

      const effects = newCustomEffects || customEffects || defaultCustomEffects
      setCustomEffects(effects)
      localStorage.setItem("custom-effects", JSON.stringify(effects))
      applyCustomEffects(effects)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, customColors, customEffects }}>{children}</ThemeContext.Provider>
  )
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
