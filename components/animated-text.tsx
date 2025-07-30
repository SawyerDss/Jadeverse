"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useTheme } from "@/lib/theme-context" // Import useTheme

interface AnimatedTextProps {
  text: string
  className?: string
  gradient?: boolean
}

export default function AnimatedText({ text, className, gradient = false }: AnimatedTextProps) {
  const [glowIntensity, setGlowIntensity] = useState(0.5)
  const [direction, setDirection] = useState(1)
  const [gradientPosition, setGradientPosition] = useState(0)
  const { theme, customColors } = useTheme() // Use the theme context

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity((prevIntensity) => {
        let newIntensity = prevIntensity + direction * 0.02
        if (newIntensity > 1.0) {
          newIntensity = 1.0
          setDirection(-1)
        } else if (newIntensity < 0.5) {
          newIntensity = 0.5
          setDirection(1)
        }
        return newIntensity
      })

      if (gradient) {
        setGradientPosition((prev) => (prev + 1) % 200)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [direction, gradient])

  // Get theme colors dynamically
  const getThemeColors = () => {
    if (theme === "custom" && customColors) {
      return {
        primary: customColors.primary,
        secondary: customColors.secondary,
      }
    }

    const themeMap: Record<string, { primary: string; secondary: string }> = {
      jade: { primary: "#10b981", secondary: "#059669" },
      blue: { primary: "#3b82f6", secondary: "#1d4ed8" },
      purple: { primary: "#8b5cf6", secondary: "#7c3aed" },
      red: { primary: "#ef4444", secondary: "#dc2626" },
      orange: { primary: "#f97316", secondary: "#ea580c" },
      neon: { primary: "#00ff00", secondary: "#00cc00" },
      rainbow: { primary: "#ff0000", secondary: "#00ff00" }, // Example, adjust as needed
    }

    return themeMap[theme] || themeMap.jade
  }

  const colors = getThemeColors()
  const glowColor = colors.primary // Use primary theme color for glow

  const shadow = `0 0 ${glowIntensity * 10}px ${glowColor}, 0 0 ${glowIntensity * 20}px ${glowColor}, 0 0 ${glowIntensity * 30}px ${glowColor}`

  if (gradient) {
    return (
      <div className={cn("relative inline-block", className)}>
        <span
          className="font-bold transition-all duration-50 ease-linear"
          style={{
            backgroundImage: `linear-gradient(90deg, 
              ${colors.primary} ${gradientPosition}%, 
              ${colors.secondary} ${(gradientPosition + 25) % 100}%, 
              ${colors.primary} ${(gradientPosition + 50) % 100}%)`,
            backgroundSize: "200% 100%",
            backgroundPosition: "0% 50%", // Explicitly set background-position
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: shadow,
          }}
        >
          {text}
          {/* No need for style jsx for keyframes if using Tailwind's animate-gradient-x or similar */}
        </span>
      </div>
    )
  }

  return (
    <div className={cn("relative inline-block", className)}>
      <span
        className="font-bold transition-all duration-50 ease-linear"
        style={{
          textShadow: shadow,
          color: "white",
        }}
      >
        {text}
        {/* No need for style jsx for keyframes if using Tailwind's animate-pulse or similar */}
      </span>
    </div>
  )
}
