"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useRef } from "react"

type Sound = {
  id: string
  src: string
  volume: number
  loop?: boolean
}

type SoundContextType = {
  playSound: (id: string) => void
  stopSound: (id: string) => void
  setVolume: (id: string, volume: number) => void
  isMuted: boolean
  toggleMute: () => void
  masterVolume: number
  setMasterVolume: (volume: number) => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

const sounds: Sound[] = [
  { id: "click", src: "/sounds/click.mp3", volume: 0.5 },
  { id: "hover", src: "/sounds/hover.mp3", volume: 0.3 },
  { id: "success", src: "/sounds/success.mp3", volume: 0.5 },
  { id: "error", src: "/sounds/error.mp3", volume: 0.5 },
  { id: "notification", src: "/sounds/notification.mp3", volume: 0.5 },
  { id: "background", src: "/sounds/background.mp3", volume: 0.3, loop: true },
]

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false)
  const [masterVolume, setMasterVolume] = useState(0.5)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({})
  const [isClient, setIsClient] = useState(false)

  // Initialize on client side only
  useEffect(() => {
    setIsClient(true)

    // Load saved settings
    const savedMute = localStorage.getItem("sound-muted")
    const savedVolume = localStorage.getItem("sound-volume")

    if (savedMute !== null) {
      setIsMuted(savedMute === "true")
    }

    if (savedVolume !== null) {
      setMasterVolume(Number.parseFloat(savedVolume))
    }

    // Create audio elements
    sounds.forEach((sound) => {
      if (typeof window !== "undefined") {
        const audio = new Audio(sound.src)
        audio.volume = sound.volume * masterVolume
        audio.loop = !!sound.loop
        audioRefs.current[sound.id] = audio
      }
    })

    // Clean up
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause()
          audio.src = ""
        }
      })
    }
  }, [])

  // Save settings when they change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("sound-muted", String(isMuted))
      localStorage.setItem("sound-volume", String(masterVolume))
    }
  }, [isMuted, masterVolume, isClient])

  const playSound = (id: string) => {
    if (isClient && !isMuted && audioRefs.current[id]) {
      const audio = audioRefs.current[id]
      if (audio) {
        audio.currentTime = 0
        audio.play().catch((e) => console.error("Error playing sound:", e))
      }
    }
  }

  const stopSound = (id: string) => {
    if (isClient && audioRefs.current[id]) {
      const audio = audioRefs.current[id]
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }

  const setVolume = (id: string, volume: number) => {
    if (isClient && audioRefs.current[id]) {
      const audio = audioRefs.current[id]
      const sound = sounds.find((s) => s.id === id)
      if (audio && sound) {
        audio.volume = sound.volume * masterVolume * volume
      }
    }
  }

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  // Update all volumes when master volume changes
  useEffect(() => {
    if (isClient) {
      sounds.forEach((sound) => {
        const audio = audioRefs.current[sound.id]
        if (audio) {
          audio.volume = sound.volume * masterVolume
        }
      })
    }
  }, [masterVolume, isClient])

  return (
    <SoundContext.Provider
      value={{
        playSound,
        stopSound,
        setVolume,
        isMuted,
        toggleMute,
        masterVolume,
        setMasterVolume,
      }}
    >
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider")
  }
  return context
}
