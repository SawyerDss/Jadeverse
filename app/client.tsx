"use client"

import type React from "react"

import { Inter } from "next/font/google"
import { useEffect, useState, useRef } from "react" // Import useRef
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
// No longer need Button component if removing the manual open button

const inter = Inter({ subsets: ["latin"] })

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  const [mouseTrailEnabled, setMouseTrailEnabled] = useState(false)
  const [buttonEffectsEnabled, setButtonEffectsEnabled] = useState(true)
  const [popupBlocked, setPopupBlocked] = useState(false)
  const blankWindowRef = useRef<Window | null>(null) // Ref to store the opened window

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

    // Prevent opening if current window is already about:blank
    if (window.location.href === "about:blank") {
      console.log("Current window is already about:blank. Not opening another.")
      return
    }

    // Prevent opening if a blank window is already open and not closed
    if (blankWindowRef.current && !blankWindowRef.current.closed) {
      console.log("An about:blank window is already open. Not opening another.")
      return
    }

    // Attempt to open about:blank automatically
    try {
      const newWindow = window.open("about:blank", "_blank")
      if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
        console.warn("Automatic 'about:blank' popup might have been blocked by the browser.")
        setPopupBlocked(true)
      } else {
        console.log("Successfully opened 'about:blank' automatically.")
        blankWindowRef.current = newWindow // Store reference to the new window
        setPopupBlocked(false)
      }
    } catch (error) {
      console.error("Error trying to open 'about:blank' automatically:", error)
      setPopupBlocked(true)
    }
  }, [])

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <NotificationProvider>
            <SettingsProvider>
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
                            {popupBlocked && (
                              <div className="fixed bottom-4 right-4 p-4 bg-red-800 text-white rounded-lg shadow-lg z-50">
                                <p className="mb-2">
                                  Your browser blocked an automatic popup. Please click the top-right icon in your
                                  browser to allow popups for this site.
                                </p>
                              </div>
                            )}
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
            </SettingsProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
