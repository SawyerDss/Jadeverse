"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNotification } from "./notification-context"

export interface Settings {
  // General settings
  soundEffects: boolean
  notifications: boolean
  animatedBackground: boolean

  // Appearance settings
  bloomIntensity: number
  textBloom: boolean
  neonGlow: boolean
  particleEffects: boolean

  // Feature visibility
  showMovies: boolean
  showJadeAI: boolean
  showBrowser: boolean
  showProxy: boolean
  showExploits: boolean
  showDownloads: boolean
  showAbout: boolean
  showSuggestions: boolean

  // Privacy settings
  tabTitle: string
  tabIcon: string
  aboutBlankCloaking: boolean
  autoTabCloaking: boolean
  panicKey: string

  // Custom settings
  customLogo: string
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  resetSettings: () => void
  isFeatureEnabled: (feature: keyof Settings) => boolean
}

const defaultSettings: Settings = {
  // General settings
  soundEffects: true,
  notifications: true,
  animatedBackground: true,

  // Appearance settings
  bloomIntensity: 0.5,
  textBloom: true,
  neonGlow: true,
  particleEffects: true,

  // Feature visibility - showJadeAI is now enabled by default
  showMovies: true,
  showJadeAI: true, // Changed to true
  showBrowser: true,
  showProxy: true,
  showExploits: false, // Keep disabled by default
  showDownloads: false, // Keep disabled by default
  showAbout: true,
  showSuggestions: true,

  // Privacy settings
  tabTitle: "s0lara",
  tabIcon: "",
  aboutBlankCloaking: false,
  autoTabCloaking: false,
  panicKey: "Escape",

  // Custom settings
  customLogo: "",
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const { addNotification } = useNotification()

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("s0lara-settings")
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
      addNotification({
        id: "settings-load-error",
        title: "Settings Error",
        message: "Failed to load saved settings. Using defaults.",
        type: "error",
      })
    }
  }, [addNotification])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("s0lara-settings", JSON.stringify(settings))
    } catch (error) {
      console.error("Failed to save settings:", error)
      addNotification({
        id: "settings-save-error",
        title: "Settings Error",
        message: "Failed to save settings.",
        type: "error",
      })
    }
  }, [settings, addNotification])

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
    addNotification({
      id: "settings-updated",
      title: "Settings Updated",
      message: "Your settings have been saved.",
      type: "success",
      duration: 2000,
    })
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    addNotification({
      id: "settings-reset",
      title: "Settings Reset",
      message: "All settings have been reset to defaults.",
      type: "info",
    })
  }

  const isFeatureEnabled = (feature: keyof Settings): boolean => {
    return Boolean(settings[feature])
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, isFeatureEnabled }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
