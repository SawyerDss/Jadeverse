"use client"

import { useEffect, useRef } from "react"

export default function EnhancedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create hexagons
    const hexagons: { x: number; y: number; size: number; opacity: number; pulse: number; pulseSpeed: number }[] = []

    for (let i = 0; i < 50; i++) {
      hexagons.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 30 + 10,
        opacity: Math.random() * 0.2 + 0.1,
        pulse: 0,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      })
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "#0a1a15") // Dark jade
      gradient.addColorStop(1, "#0f2a20") // Slightly lighter jade

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw hexagons
      hexagons.forEach((hex) => {
        hex.pulse += hex.pulseSpeed
        const pulseOpacity = hex.opacity + Math.sin(hex.pulse) * 0.1

        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i
          const x = hex.x + hex.size * Math.cos(angle)
          const y = hex.y + hex.size * Math.sin(angle)

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()

        ctx.strokeStyle = `rgba(0, 255, 191, ${pulseOpacity})`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Draw glow spots
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 100 + 50

        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius)
        glow.addColorStop(0, "rgba(0, 255, 191, 0.05)")
        glow.addColorStop(1, "rgba(0, 255, 191, 0)")

        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none" />
}
