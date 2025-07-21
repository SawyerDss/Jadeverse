"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Settings {
  // Display Settings
  theme: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  borderColor: string
  glowIntensity: number
  animationSpeed: number
  particleCount: number
  showParticles: boolean
  showGlow: boolean
  showAnimations: boolean
  showSoundEffects: boolean
  backgroundMusic: boolean

  // Privacy Settings
  analytics: boolean
  cookies: boolean
  dataCollection: boolean
  autoTabCloaking: boolean
  tabTitle: string
  tabIcon: string
  panicKey: string

  // Feature Flags
  showExploits: boolean
  showDownloads: boolean
  showBrowser: boolean
  showProxy: boolean
  showMovies: boolean
  showJadeAI: boolean
  showAbout: boolean
  showSuggestions: boolean

  // Accessibility
  highContrast: boolean
  reducedMotion: boolean
  fontSize: number

  // Performance
  enableHardwareAcceleration: boolean
  maxFPS: number

  // Experimental Features
  betaFeatures: boolean
  experimentalUI: boolean
}

const defaultSettings: Settings = {
  // Display Settings
  theme: "neon",
  primaryColor: "#10b981",
  secondaryColor: "#059669",
  accentColor: "#34d399",
  backgroundColor: "#000000",
  textColor: "#ffffff",
  borderColor: "#10b981",
  glowIntensity: 50,
  animationSpeed: 50,
  particleCount: 50,
  showParticles: true,
  showGlow: true,
  showAnimations: true,
  showSoundEffects: true,
  backgroundMusic: false,

  // Privacy Settings
  analytics: false,
  cookies: true,
  dataCollection: false,
  autoTabCloaking: false,
  tabTitle: "s0lara - The Ultimate Gaming Experience",
  tabIcon: "/favicon.ico",
  panicKey: "Escape",

  // Feature Flags
  showExploits: false, // Hidden by default
  showDownloads: false, // Hidden by default
  showBrowser: false, // Hidden by default
  showProxy: false, // Hidden by default
  showMovies: false, // Hidden by default
  showJadeAI: false, // Experimental feature, hidden by default
  showAbout: false,
  showSuggestions: false,

  // Accessibility
  highContrast: false,
  reducedMotion: false,
  fontSize: 16,

  // Performance
  enableHardwareAcceleration: true,
  maxFPS: 60,

  // Experimental Features
  betaFeatures: false,
  experimentalUI: false,
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  resetSettings: () => void
  exportSettings: () => string
  importSettings: (settingsJson: string) => boolean
  isFeatureEnabled: (feature: keyof Settings) => boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("s0lara-settings") // Updated key
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        // Merge with default settings to ensure all properties exist
        setSettings((prev) => ({ ...defaultSettings, ...prev, ...parsed }))
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("s0lara-settings", JSON.stringify(settings)) // Updated key
      } catch (error) {
        console.error("Failed to save settings:", error)
      }
    }
  }, [settings, isInitialized])

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    try {
      localStorage.removeItem("s0lara-settings") // Updated key
    } catch (error) {
      console.error("Failed to reset settings:", error)
    }
  }

  const exportSettings = () => {
    return JSON.stringify(settings, null, 2)
  }

  const importSettings = (settingsJson: string): boolean => {
    try {
      const parsed = JSON.parse(settingsJson)
      // Validate that it's a valid settings object
      if (typeof parsed === "object" && parsed !== null) {
        setSettings({ ...defaultSettings, ...parsed })
        return true
      }
      return false
    } catch (error) {
      console.error("Failed to import settings:", error)
      return false
    }
  }

  const isFeatureEnabled = (feature: keyof Settings): boolean => {
    return Boolean(settings[feature])
  }

  const value: SettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
    isFeatureEnabled,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
