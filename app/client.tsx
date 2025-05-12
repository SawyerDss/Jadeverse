"use client"

import type React from "react"

import { Inter } from "next/font/google"
import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import { ThemeProvider } from "@/lib/theme-context"
import { AuthProvider } from "@/lib/auth-context"
import { GamesProvider } from "@/lib/games-context"
import { NotificationProvider } from "@/lib/notification-context"
import MouseTrail from "@/components/mouse-trail"
import ButtonEffects from "@/components/button-effects"
import CustomContextMenu from "@/components/custom-context-menu"
import { ChatProvider } from "@/lib/chat-context"
import { SoundProvider } from "@/lib/sound-context"
import { SettingsProvider } from "@/lib/settings-context"
import { MoviesProvider } from "@/lib/movies-context"
import "../app/globals.css"
import "../app/neon-theme.css"

const inter = Inter({ subsets: ["latin"] })

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  const [mouseTrailEnabled, setMouseTrailEnabled] = useState(false)
  const [buttonEffectsEnabled, setButtonEffectsEnabled] = useState(true)

  useEffect(() => {
    // Load settings from localStorage
    const mouseTrail = localStorage.getItem("mouseTrail")
    if (mouseTrail !== null) {
      setMouseTrailEnabled(mouseTrail === "true")
    }

    const buttonEffects = localStorage.getItem("buttonEffects")
    if (buttonEffects !== null) {
      setButtonEffectsEnabled(buttonEffects === "true")
    }
  }, [])

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <SettingsProvider>
            <NotificationProvider>
              <AuthProvider>
                <GamesProvider>
                  <MoviesProvider>
                    <ChatProvider>
                      <SoundProvider>
                        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
                          <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
                          <div className="fixed inset-0 bg-gradient-radial from-transparent to-background pointer-events-none"></div>

                          <Sidebar />

                          <main className="ml-16 md:ml-64 min-h-screen relative">
                            <div className="container mx-auto px-4">{children}</div>
                          </main>

                          <CustomContextMenu />
                          {mouseTrailEnabled && <MouseTrail />}
                          {buttonEffectsEnabled && <ButtonEffects />}
                        </div>
                      </SoundProvider>
                    </ChatProvider>
                  </MoviesProvider>
                </GamesProvider>
              </AuthProvider>
            </NotificationProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
