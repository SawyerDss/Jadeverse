"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    handleResize()
    window.addEventListener("resize", handleResize)

    // Create particles
    const particles: Particle[] = []
    const particleCount = Math.min(Math.floor(window.innerWidth / 10), 150)
    const colors = ["#10b981", "#059669", "#047857", "#064e3b", "#065f46"]

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: Math.random() * 0.2 - 0.1,
        speedY: Math.random() * 0.2 - 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    // Create hexagons
    const hexagons: {
      x: number
      y: number
      size: number
      rotation: number
      rotationSpeed: number
      opacity: number
    }[] = []
    const hexagonCount = Math.min(Math.floor(window.innerWidth / 200), 15)

    for (let i = 0; i < hexagonCount; i++) {
      hexagons.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 50 + 20,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() * 0.001 - 0.0005) * (Math.random() > 0.5 ? 1 : -1),
        opacity: Math.random() * 0.1 + 0.05,
      })
    }

    // Animation loop
    let animationFrameId: number
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw hexagons
      hexagons.forEach((hexagon) => {
        ctx.save()
        ctx.translate(hexagon.x, hexagon.y)
        ctx.rotate(hexagon.rotation)
        hexagon.rotation += hexagon.rotationSpeed

        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i
          const x = hexagon.size * Math.cos(angle)
          const y = hexagon.size * Math.sin(angle)
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.strokeStyle = `rgba(16, 185, 129, ${hexagon.opacity})`
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.restore()

        // Reset position if off screen
        if (
          hexagon.x < -hexagon.size ||
          hexagon.x > canvas.width + hexagon.size ||
          hexagon.y < -hexagon.size ||
          hexagon.y > canvas.height + hexagon.size
        ) {
          hexagon.x = Math.random() * canvas.width
          hexagon.y = Math.random() * canvas.height
        }
      })

      // Draw and update particles
      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle =
          particle.color +
          Math.floor(particle.opacity * 255)
            .toString(16)
            .padStart(2, "0")
        ctx.fill()

        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Reset position if off screen
        if (particle.x < 0 || particle.x > canvas.width || particle.y < 0 || particle.y > canvas.height) {
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
        }
      })

      // Draw gradient overlay
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
      )
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.05)")
      gradient.addColorStop(0.5, "rgba(16, 185, 129, 0.02)")
      gradient.addColorStop(1, "rgba(16, 185, 129, 0)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />
}
