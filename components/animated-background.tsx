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
  interactive?: boolean
  originalX?: number
  originalY?: number
}

interface Hexagon {
  x: number
  y: number
  size: number
  rotation: number
  rotationSpeed: number
  opacity: number
  pulseDirection: number
  pulseSpeed: number
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, active: false })

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

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    // Create particles
    const particles: Particle[] = []
    const particleCount = Math.min(Math.floor(window.innerWidth / 8), 200)
    const colors = [
      "#10b981", // Primary jade
      "#059669", // Darker jade
      "#047857", // Even darker jade
      "#064e3b", // Darkest jade
      "#34d399", // Lighter jade
      "#6ee7b7", // Lightest jade
    ]

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const interactive = Math.random() > 0.7 // 30% of particles are interactive

      particles.push({
        x,
        y,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        interactive,
        originalX: interactive ? x : undefined,
        originalY: interactive ? y : undefined,
      })
    }

    // Create hexagons
    const hexagons: Hexagon[] = []
    const hexagonCount = Math.min(Math.floor(window.innerWidth / 150), 20)

    for (let i = 0; i < hexagonCount; i++) {
      hexagons.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 60 + 30,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() * 0.001 - 0.0005) * (Math.random() > 0.5 ? 1 : -1),
        opacity: Math.random() * 0.15 + 0.05,
        pulseDirection: 1,
        pulseSpeed: Math.random() * 0.002 + 0.001,
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

        // Pulse effect
        hexagon.opacity += hexagon.pulseSpeed * hexagon.pulseDirection
        if (hexagon.opacity > 0.2 || hexagon.opacity < 0.05) {
          hexagon.pulseDirection *= -1
        }

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
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Add a subtle fill
        ctx.fillStyle = `rgba(16, 185, 129, ${hexagon.opacity * 0.2})`
        ctx.fill()

        ctx.restore()

        // Slow drift movement
        hexagon.x += Math.sin(Date.now() * 0.0005) * 0.2
        hexagon.y += Math.cos(Date.now() * 0.0005) * 0.2

        // Reset position if off screen
        if (
          hexagon.x < -hexagon.size * 2 ||
          hexagon.x > canvas.width + hexagon.size * 2 ||
          hexagon.y < -hexagon.size * 2 ||
          hexagon.y > canvas.height + hexagon.size * 2
        ) {
          hexagon.x = Math.random() * canvas.width
          hexagon.y = Math.random() * canvas.height
        }
      })

      // Draw and update particles
      particles.forEach((particle) => {
        // Interactive particles
        if (particle.interactive && mouseRef.current.active && particle.originalX && particle.originalY) {
          const dx = mouseRef.current.x - particle.x
          const dy = mouseRef.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 150

          if (distance < maxDistance) {
            // Move away from mouse
            const force = (1 - distance / maxDistance) * 2
            particle.x -= dx * force * 0.05
            particle.y -= dy * force * 0.05
          } else {
            // Return to original position
            const returnForce = 0.05
            particle.x += (particle.originalX - particle.x) * returnForce
            particle.y += (particle.originalY - particle.y) * returnForce
          }
        } else {
          // Regular movement
          particle.x += particle.speedX
          particle.y += particle.speedY
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle =
          particle.color +
          Math.floor(particle.opacity * 255)
            .toString(16)
            .padStart(2, "0")
        ctx.fill()

        // Add glow effect to some particles
        if (particle.size > 1.5) {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
          ctx.fillStyle = particle.color + "20" // Very transparent
          ctx.fill()
        }

        // Reset position if off screen
        if (particle.x < -50 || particle.x > canvas.width + 50 || particle.y < -50 || particle.y > canvas.height + 50) {
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
          if (particle.interactive && particle.originalX !== undefined && particle.originalY !== undefined) {
            particle.originalX = particle.x
            particle.originalY = particle.y
          }
        }
      })

      // Draw gradient overlay
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 1.5,
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
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />
}
