"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GlowingButtonProps {
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  disabled?: boolean
}

export function GlowingButton({
  children,
  className,
  icon,
  onClick,
  type = "button",
  disabled = false,
}: GlowingButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isRainbow, setIsRainbow] = useState(false)

  // Check if rainbow theme is active
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme")
      setIsRainbow(theme === "rainbow")
    }

    // Check on mount
    checkTheme()

    // Set up a mutation observer to watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div
        className={cn(
          "absolute -inset-0.5 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000",
          isRainbow
            ? "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-pulse-slow"
            : "bg-gradient-to-r from-primary via-primary/50 to-primary animate-pulse-slow",
          isHovered ? "animate-glow scale-105" : "",
          disabled ? "opacity-50" : "",
        )}
      />

      {/* Button */}
      <Button
        type={type}
        disabled={disabled}
        className={cn(
          "relative bg-black border border-primary/50 hover:border-primary text-white px-8 py-6 rounded-full text-lg font-medium transition-all duration-300 overflow-hidden",
          isHovered && !disabled ? "shadow-[0_0_15px_rgba(var(--primary),0.5)] translate-y-[-2px]" : "",
          isRainbow ? "rainbow-btn" : "",
          disabled ? "opacity-50 cursor-not-allowed" : "",
          className,
        )}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => !disabled && setIsHovered(false)}
        onClick={onClick}
      >
        {/* Shine effect */}
        <span
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full",
            isHovered && !disabled ? "animate-shine" : "",
          )}
        />

        {icon && <span className="mr-2">{icon}</span>}
        <span className="relative z-10">{children}</span>
      </Button>
    </div>
  )
}

// For backward compatibility
export default GlowingButton
