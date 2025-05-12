"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type ExperimentalFeature =
  | "showMovies"
  | "showExploits"
  | "showDownloads"
  | "showBrowser"
  | "showProxy"
  | "showJadeAI"
  | "enableMouseTrail"

interface SettingsContextType {
  experimentalFeatures: Record<ExperimentalFeature, boolean>
  toggleFeature: (feature: ExperimentalFeature) => void
  isFeatureEnabled: (feature: ExperimentalFeature) => boolean
}

const defaultExperimentalFeatures: Record<ExperimentalFeature, boolean> = {
  showMovies: true,
  showExploits: true,
  showDownloads: true,
  showBrowser: true,
  showProxy: true,
  showJadeAI: false, // JadeAI is now experimental and off by default
  enableMouseTrail: false,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [experimentalFeatures, setExperimentalFeatures] =
    useState<Record<ExperimentalFeature, boolean>>(defaultExperimentalFeatures)

  // Load settings from localStorage
  useEffect(() => {
    try {
      const savedFeatures = localStorage.getItem("experimental-features")
      if (savedFeatures) {
        const parsedFeatures = JSON.parse(savedFeatures)
        // Merge with default features to ensure all keys exist
        setExperimentalFeatures({
          ...defaultExperimentalFeatures,
          ...parsedFeatures,
        })
      }
    } catch (error) {
      console.error("Error loading experimental features:", error)
    }
  }, [])

  const toggleFeature = (feature: ExperimentalFeature) => {
    try {
      const updatedFeatures = {
        ...experimentalFeatures,
        [feature]: !experimentalFeatures[feature],
      }
      setExperimentalFeatures(updatedFeatures)
      localStorage.setItem("experimental-features", JSON.stringify(updatedFeatures))
    } catch (error) {
      console.error("Error toggling feature:", error)
    }
  }

  const isFeatureEnabled = (feature: ExperimentalFeature) => {
    return experimentalFeatures[feature] || false
  }

  return (
    <SettingsContext.Provider value={{ experimentalFeatures, toggleFeature, isFeatureEnabled }}>
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
