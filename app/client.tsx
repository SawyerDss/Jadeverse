"use client"

import type React from "react"

import "./globals.css"
import "./neon-theme.css" // Add this import for neon theme support
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/lib/theme-context"
import Sidebar from "@/components/sidebar"
import AnimatedBackground from "@/components/animated-background"
import FloatingHexagons from "@/components/floating-hexagons"
import { AuthProvider } from "@/lib/auth-context"
import { GamesProvider } from "@/lib/games-context"
import { NotificationProvider } from "@/lib/notification-context"
import { ChatProvider } from "@/lib/chat-context"
import NotificationCenter from "@/components/notification-center"
import ChatPanel from "@/components/chat-panel"
import CustomContextMenu from "@/components/custom-context-menu"
import { useState, useEffect } from "react"
import { MouseTrail } from "@/components/mouse-trail"
import { ButtonEffects } from "@/components/button-effects"
import { SoundProvider } from "@/lib/sound-context"

const inter = Inter({ subsets: ["latin"] })

export default function ClientRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [mounted, setMounted] = useState(false)
  const [effectsEnabled, setEffectsEnabled] = useState(false)
  const [mouseTrailEnabled, setMouseTrailEnabled] = useState(false)

  // Check user preferences from localStorage after mount
  useEffect(() => {
    setMounted(true)
    const storedEffects = localStorage.getItem("buttonEffects")
    const storedMouseTrail = localStorage.getItem("mouseTrail")

    if (storedEffects) setEffectsEnabled(storedEffects === "true")
    if (storedMouseTrail) setMouseTrailEnabled(storedMouseTrail === "true")
  }, [])

  // Custom tab title and favicon
  useEffect(() => {
    const customTitle = localStorage.getItem("customTabTitle")
    const customFavicon = localStorage.getItem("customTabFavicon")

    if (customTitle) document.title = customTitle
    if (customFavicon) {
      const linkElements = document.querySelectorAll("link[rel='icon']")
      if (linkElements.length > 0) {
        // Update existing favicon
        linkElements.forEach((link) => {
          link.setAttribute("href", customFavicon)
        })
      } else {
        // Create new favicon link
        const link = document.createElement("link")
        link.rel = "icon"
        link.href = customFavicon
        document.head.appendChild(link)
      }
    }
  }, [mounted])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <NotificationProvider>
            <GamesProvider>
              <AuthProvider>
                <ChatProvider>
                  <SoundProvider>
                    <div className="relative min-h-screen bg-black overflow-hidden">
                      {/* Animated background */}
                      <AnimatedBackground />
                      <FloatingHexagons />

                      {/* Mouse trail effect (conditionally rendered) */}
                      {mouseTrailEnabled && <MouseTrail enabled={true} />}

                      {/* Button effects (conditionally rendered) */}
                      {effectsEnabled && <ButtonEffects enabled={true} />}

                      {/* Sidebar navigation */}
                      <Sidebar />

                      {/* Main content - with transition for sidebar collapse */}
                      <main className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 ml-16 transition-all duration-300">
                        {children}
                      </main>

                      {/* Notification center */}
                      <div className="fixed top-4 right-4 z-50">
                        <NotificationCenter />
                      </div>

                      {/* Chat panel */}
                      <ChatPanel />

                      {/* Custom context menu */}
                      <CustomContextMenu />

                      {/* Jade glow effect */}
                      <div className="fixed bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-primary/50 to-transparent z-0"></div>
                    </div>
                  </SoundProvider>
                </ChatProvider>
              </AuthProvider>
            </GamesProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
