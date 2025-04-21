"use client"

import { useEffect } from "react"

interface ButtonEffectsProps {
  enabled?: boolean
}

export function ButtonEffects({ enabled = true }: ButtonEffectsProps) {
  useEffect(() => {
    if (!enabled) return

    // Add hover sound effect to buttons
    const addHoverSound = () => {
      const buttons = document.querySelectorAll("button, a.btn, .btn, [role='button']")

      buttons.forEach((button) => {
        // Skip if already has hover sound
        if (button.classList.contains("has-hover-sound")) return

        button.classList.add("has-hover-sound")

        button.addEventListener("mouseenter", () => {
          const audio = new Audio("/sounds/hover.mp3")
          audio.volume = 0.2
          audio.play().catch((e) => console.log("Audio play failed:", e))
        })

        button.addEventListener("click", () => {
          const audio = new Audio("/sounds/click.mp3")
          audio.volume = 0.3
          audio.play().catch((e) => console.log("Audio play failed:", e))
        })
      })
    }

    // Initial setup
    addHoverSound()

    // Set up a MutationObserver to watch for new buttons
    const observer = new MutationObserver((mutations) => {
      addHoverSound()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()

      // Remove event listeners
      const buttons = document.querySelectorAll(".has-hover-sound")
      buttons.forEach((button) => {
        button.classList.remove("has-hover-sound")
        button.replaceWith(button.cloneNode(true))
      })
    }
  }, [enabled])

  return null
}

// For backward compatibility
export default ButtonEffects
