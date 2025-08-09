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
// Removed Button import as it's no longer needed for the manual open button

const inter = Inter({ subsets: ["latin"] })

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  const [mouseTrailEnabled, setMouseTrailEnabled] = useState(false)
  const [buttonEffectsEnabled, setButtonEffectsEnabled] = useState(true)
  const [popupBlocked, setPopupBlocked] = useState(false)

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

    // Only attempt to cloak if not already in an iframe and not already about:blank
    const isInIframe = window !== window.top
    if (window.location.href === "about:blank" || isInIframe) {
      console.log("Already in about:blank or an iframe. Not attempting to re-cloak.")
      return
    }

    // Store the original URL before opening about:blank
    const originalUrl = window.location.href
    const originalTitle = document.title
    const originalFavicon = document.querySelector("link[rel*='icon']")?.getAttribute("href")

    try {
      const newWindow = window.open("about:blank", "_blank")
      if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
        // This indicates a popup blocker
        console.warn("Automatic 'about:blank' cloaking might have been blocked by the browser.")
        setPopupBlocked(true)
      } else {
        console.log("Successfully opened 'about:blank' for cloaking.")
        setPopupBlocked(false)

        // Write the iframe into the new about:blank window
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${originalTitle}</title>
            ${originalFavicon ? `<link rel="icon" href="${originalFavicon}">` : ""}
            <style>
              body { margin: 0; overflow: hidden; }
              iframe { position: fixed; top: 0; left: 0; bottom: 0; right: 0; width: 100%; height: 100%; border: none; margin: 0; padding: 0; overflow: hidden; z-index: 999999; }
            </style>
          </head>
          <body>
            <iframe src="${originalUrl}"></iframe>
          </body>
          </html>
        `)
        newWindow.document.close() // Close the document stream

        // Attempt to close the original window
        try {
          window.close()
        } catch (e) {
          console.warn("Could not close original window, likely due to browser security policies.", e)
          // If window.close() fails, redirect the original window to about:blank as a fallback
          window.location.href = "about:blank"
        }
      }
    } catch (error) {
      console.error("Error trying to open 'about:blank' for cloaking automatically:", error)
      setPopupBlocked(true)
    }
  }, []) // Empty dependency array to run only once on mount

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
                                  Your browser blocked the automatic cloaking. Please click the top-right icon in your
                                  browser to allow popups for this site, then refresh.
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
