"use client"

import { useEffect, useState } from "react"

interface MouseTrailProps {
  enabled?: boolean
  particleCount?: number
  particleSize?: number
  particleColor?: string
}

export function MouseTrail({ enabled = true, particleCount = 20, particleSize = 10, particleColor }: MouseTrailProps) {
  const [particles, setParticles] = useState<HTMLDivElement[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!enabled) {
      // Clean up any existing particles
      particles.forEach((p) => {
        if (p.parentNode) {
          p.parentNode.removeChild(p)
        }
      })
      setParticles([])
      return
    }

    // Create particles
    const newParticles: HTMLDivElement[] = []
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "mouse-trail"
      particle.style.width = `${particleSize}px`
      particle.style.height = `${particleSize}px`
      particle.style.position = "fixed"
      particle.style.borderRadius = "50%"
      particle.style.backgroundColor = particleColor || "rgba(var(--primary), 0.7)"
      particle.style.pointerEvents = "none"
      particle.style.zIndex = "9999"
      particle.style.transition = "opacity 0.5s ease"
      document.body.appendChild(particle)
      newParticles.push(particle)
    }
    setParticles(newParticles)

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Clean up
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      newParticles.forEach((p) => {
        if (p.parentNode) {
          p.parentNode.removeChild(p)
        }
      })
    }
  }, [enabled, particleCount, particleSize, particleColor])

  // Update particle positions
  useEffect(() => {
    if (!enabled || particles.length === 0) return

    let index = 0
    const interval = setInterval(() => {
      if (index < particles.length) {
        const particle = particles[index]
        particle.style.left = `${mousePos.x}px`
        particle.style.top = `${mousePos.y}px`

        // Fade out effect
        setTimeout(() => {
          particle.style.opacity = "0"
        }, 100)

        // Reset opacity after animation
        setTimeout(() => {
          particle.style.opacity = "0.7"
        }, 500)

        index = (index + 1) % particles.length
      }
    }, 20)

    return () => clearInterval(interval)
  }, [enabled, particles, mousePos])

  return null
}

// For backward compatibility
export default MouseTrail
