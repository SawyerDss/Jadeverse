"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Home,
  Plus,
  X,
  Search,
  Star,
  Menu,
  User,
  Lock,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNotification } from "@/lib/notification-context"
import { useTheme } from "@/lib/theme-context"

interface BrowserTab {
  id: string
  title: string
  url: string
  favicon: string
  active: boolean
}

export default function BrowserPage() {
  const { addNotification } = useNotification()
  const { theme } = useTheme()
  const [tabs, setTabs] = useState<BrowserTab[]>([])
  const [currentUrl, setCurrentUrl] = useState("")
  const [inputUrl, setInputUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const [bookmarks] = useState([
    { title: "JadeVerse", url: "/" },
    { title: "Games", url: "/games" },
    { title: "Apps", url: "/apps" },
  ])
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [proxyLoaded, setProxyLoaded] = useState(false)

  // Load Interstellar proxy scripts
  useEffect(() => {
    const loadInterstellarProxy = async () => {
      try {
        // Create script elements for Interstellar
        const interstellarScript = document.createElement("script")
        interstellarScript.src = "https://cdn.jsdelivr.net/gh/UseInterstellar/Interstellar/static/uv/uv.bundle.js"

        const interstellarConfigScript = document.createElement("script")
        interstellarConfigScript.src = "https://cdn.jsdelivr.net/gh/UseInterstellar/Interstellar/static/uv/uv.config.js"

        const interstellarHandlerScript = document.createElement("script")
        interstellarHandlerScript.src = "https://cdn.jsdelivr.net/gh/UseInterstellar/Interstellar/static/index.js"

        // Append scripts to document
        document.body.appendChild(interstellarScript)
        document.body.appendChild(interstellarConfigScript)
        document.body.appendChild(interstellarHandlerScript)

        // Wait for scripts to load
        interstellarScript.onload = () => {
          interstellarConfigScript.onload = () => {
            interstellarHandlerScript.onload = () => {
              setProxyLoaded(true)
              addNotification({
                title: "Browser Ready",
                message: "JadeVerse Browser with Interstellar proxy is ready to use",
                type: "success",
              })
            }
          }
        }
      } catch (error) {
        console.error("Failed to load Interstellar proxy:", error)
        addNotification({
          title: "Browser Error",
          message: "Failed to initialize browser. Please try again later.",
          type: "error",
        })
      }
    }

    loadInterstellarProxy()
  }, [addNotification])

  // Initialize with a default tab
  useEffect(() => {
    if (tabs.length === 0) {
      const newTabId = generateTabId()
      const newTab = {
        id: newTabId,
        title: "New Tab",
        url: "about:blank",
        favicon: "/placeholder.svg?height=16&width=16",
        active: true,
      }
      setTabs([newTab])
      setActiveTabId(newTabId)
    }
  }, [tabs])

  const generateTabId = () => {
    return Math.random().toString(36).substring(2, 9)
  }

  const addNewTab = () => {
    const newTabId = generateTabId()
    const newTab = {
      id: newTabId,
      title: "New Tab",
      url: "about:blank",
      favicon: "/placeholder.svg?height=16&width=16",
      active: true,
    }

    // Set all existing tabs to inactive
    const updatedTabs = tabs.map((tab) => ({
      ...tab,
      active: false,
    }))

    setTabs([...updatedTabs, newTab])
    setActiveTabId(newTabId)
    setCurrentUrl("")
    setInputUrl("")

    if (iframeRef.current) {
      iframeRef.current.src = "about:blank"
    }
  }

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (tabs.length === 1) {
      // If it's the last tab, create a new one instead of closing
      const newTabId = generateTabId()
      const newTab = {
        id: newTabId,
        title: "New Tab",
        url: "about:blank",
        favicon: "/placeholder.svg?height=16&width=16",
        active: true,
      }
      setTabs([newTab])
      setActiveTabId(newTabId)
      setCurrentUrl("")
      setInputUrl("")

      if (iframeRef.current) {
        iframeRef.current.src = "about:blank"
      }
      return
    }

    const tabIndex = tabs.findIndex((tab) => tab.id === tabId)
    const newTabs = tabs.filter((tab) => tab.id !== tabId)

    // If we're closing the active tab, activate another one
    if (tabId === activeTabId) {
      const newActiveIndex = tabIndex === 0 ? 0 : tabIndex - 1
      const newActiveTab = newTabs[newActiveIndex]
      newTabs[newActiveIndex] = { ...newActiveTab, active: true }
      setActiveTabId(newActiveTab.id)
      setCurrentUrl(newActiveTab.url)
      setInputUrl(newActiveTab.url)

      if (iframeRef.current && newActiveTab.url !== "about:blank") {
        navigateToUrl(newActiveTab.url)
      } else if (iframeRef.current) {
        iframeRef.current.src = "about:blank"
      }
    }

    setTabs(newTabs)
  }

  const activateTab = (tabId: string) => {
    const updatedTabs = tabs.map((tab) => ({
      ...tab,
      active: tab.id === tabId,
    }))

    setTabs(updatedTabs)
    setActiveTabId(tabId)

    const activeTab = tabs.find((tab) => tab.id === tabId)
    if (activeTab) {
      setCurrentUrl(activeTab.url)
      setInputUrl(activeTab.url)

      if (iframeRef.current && activeTab.url !== "about:blank") {
        navigateToUrl(activeTab.url)
      } else if (iframeRef.current) {
        iframeRef.current.src = "about:blank"
      }
    }
  }

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputUrl) {
      addNotification({
        title: "Enter URL",
        message: "Please enter a URL to navigate",
        type: "warning",
      })
      return
    }

    // Add https if not present
    let navigateUrl = inputUrl
    if (
      !navigateUrl.startsWith("http://") &&
      !navigateUrl.startsWith("https://") &&
      !navigateUrl.startsWith("about:")
    ) {
      navigateUrl = "https://" + navigateUrl
      setInputUrl(navigateUrl)
    }

    setCurrentUrl(navigateUrl)
    navigateToUrl(navigateUrl)

    // Update the active tab
    if (activeTabId) {
      const updatedTabs = tabs.map((tab) => {
        if (tab.id === activeTabId) {
          return {
            ...tab,
            url: navigateUrl,
            title: navigateUrl.split("/")[2] || "New Tab", // Use domain as title
          }
        }
        return tab
      })
      setTabs(updatedTabs)
    }
  }

  const navigateToUrl = (url: string) => {
    setIsLoading(true)

    try {
      // Skip proxy for about: URLs
      if (url.startsWith("about:")) {
        if (iframeRef.current) {
          iframeRef.current.src = url
        }
        return
      }

      // Use Interstellar proxy
      if (window.__uv && proxyLoaded) {
        const encodedUrl = window.__uv.codec.encode(url)
        const fullUrl = window.__uv.prefix + encodedUrl

        if (iframeRef.current) {
          iframeRef.current.src = fullUrl
        }
      } else {
        // Fallback if proxy is not loaded
        if (iframeRef.current) {
          iframeRef.current.src = url
        }

        addNotification({
          title: "Browser Warning",
          message: "Proxy not fully loaded. Using direct navigation which may not work for all sites.",
          type: "warning",
        })
      }
    } catch (error) {
      console.error("Navigation error:", error)
      addNotification({
        title: "Navigation Error",
        message: "Failed to navigate to the requested URL",
        type: "error",
      })
      setIsLoading(false)
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)

    // Try to update tab title and favicon
    try {
      if (iframeRef.current && iframeRef.current.contentDocument) {
        const title = iframeRef.current.contentDocument.title || currentUrl.split("/")[2] || "New Tab"

        // Update the active tab
        if (activeTabId) {
          const updatedTabs = tabs.map((tab) => {
            if (tab.id === activeTabId) {
              return {
                ...tab,
                title: title,
              }
            }
            return tab
          })
          setTabs(updatedTabs)
        }
      }
    } catch (e) {
      // Cross-origin restrictions might prevent accessing contentDocument
      console.log("Could not access iframe content due to cross-origin restrictions")
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  const handleBack = () => {
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.history.back()
      } catch (e) {
        // Cross-origin restrictions might prevent this
        addNotification({
          title: "Navigation Error",
          message: "Could not go back due to cross-origin restrictions",
          type: "error",
        })
      }
    }
  }

  const handleForward = () => {
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.history.forward()
      } catch (e) {
        // Cross-origin restrictions might prevent this
        addNotification({
          title: "Navigation Error",
          message: "Could not go forward due to cross-origin restrictions",
          type: "error",
        })
      }
    }
  }

  const handleHome = () => {
    setCurrentUrl("")
    setInputUrl("")
    if (iframeRef.current) {
      iframeRef.current.src = "about:blank"
    }

    // Update the active tab
    if (activeTabId) {
      const updatedTabs = tabs.map((tab) => {
        if (tab.id === activeTabId) {
          return {
            ...tab,
            url: "about:blank",
            title: "New Tab",
          }
        }
        return tab
      })
      setTabs(updatedTabs)
    }
  }

  const navigateToBookmark = (url: string) => {
    // For internal links, just navigate normally
    if (url.startsWith("/")) {
      window.location.href = url
      return
    }

    setInputUrl(url)
    setCurrentUrl(url)
    navigateToUrl(url)

    // Update the active tab
    if (activeTabId) {
      const updatedTabs = tabs.map((tab) => {
        if (tab.id === activeTabId) {
          return {
            ...tab,
            url: url,
            title: url.split("/")[2] || "New Tab",
          }
        }
        return tab
      })
      setTabs(updatedTabs)
    }
  }

  // Get theme-specific colors
  const getThemeColors = () => {
    switch (theme) {
      case "jade":
        return {
          primary: "#10b981",
          secondary: "#065f46",
          accent: "#059669",
        }
      case "neon":
        return {
          primary: "#f472b6",
          secondary: "#db2777",
          accent: "#ec4899",
        }
      case "cyber":
        return {
          primary: "#3b82f6",
          secondary: "#1d4ed8",
          accent: "#60a5fa",
        }
      case "rainbow":
        return {
          primary: "#8b5cf6",
          secondary: "#7c3aed",
          accent: "#a78bfa",
        }
      default:
        return {
          primary: "#10b981",
          secondary: "#065f46",
          accent: "#059669",
        }
    }
  }

  const themeColors = getThemeColors()

  return (
    <div className="flex flex-col h-screen">
      {/* Browser Chrome UI */}
      <div
        className="browser-chrome bg-gray-900 border-b border-gray-800"
        style={
          {
            "--theme-primary": themeColors.primary,
            "--theme-secondary": themeColors.secondary,
            "--theme-accent": themeColors.accent,
          } as React.CSSProperties
        }
      >
        {/* Tab Bar */}
        <div className="flex items-center px-2 pt-2">
          <div className="flex-1 flex items-center space-x-1 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex items-center min-w-[180px] max-w-[240px] h-9 px-3 rounded-t-lg cursor-pointer ${
                  tab.active
                    ? `bg-gray-800 border-t border-l border-r border-gray-700`
                    : "bg-gray-900 border-t border-l border-r border-gray-800 hover:bg-gray-800"
                }`}
                onClick={() => activateTab(tab.id)}
                style={tab.active ? { borderTopColor: themeColors.primary, borderTopWidth: "2px" } : {}}
              >
                <img src={tab.favicon || "/placeholder.svg"} alt="" className="w-4 h-4 mr-2" />
                <span className="text-sm truncate flex-1 text-gray-200">{tab.title}</span>
                <button className="ml-2 p-1 rounded-full hover:bg-gray-700" onClick={(e) => closeTab(tab.id, e)}>
                  <X className="h-3 w-3 text-gray-400 hover:text-white" />
                </button>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 h-9 w-9 rounded-full text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={addNewTab}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center px-3 py-2 space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={handleBack}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={handleForward}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={handleRefresh}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={handleHome}
          >
            <Home className="h-4 w-4" />
          </Button>

          {/* Address Bar */}
          <form onSubmit={handleNavigate} className="flex-1 flex items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {currentUrl ? (
                  <Lock className="h-3 w-3 text-green-500" />
                ) : (
                  <Search className="h-3 w-3 text-gray-400" />
                )}
              </div>
              <Input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Search or enter website name"
                className="pl-9 pr-4 py-1.5 h-9 bg-gray-800 border-gray-700 focus:border-primary rounded-full text-sm text-gray-200"
                style={{ borderColor: "var(--theme-primary)" }}
              />
            </div>
          </form>

          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-800">
            <Star className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-800">
            <User className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-800">
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Bookmarks Bar */}
        <div className="flex items-center px-3 py-1 space-x-4 border-t border-gray-800">
          {bookmarks.map((bookmark, index) => (
            <button
              key={index}
              className="flex items-center text-xs text-gray-300 hover:text-white"
              onClick={() => navigateToBookmark(bookmark.url)}
            >
              <div
                className="w-4 h-4 mr-1.5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${themeColors.secondary}40` }}
              >
                <span className="text-[10px] font-bold" style={{ color: themeColors.primary }}>
                  {bookmark.title[0]}
                </span>
              </div>
              {bookmark.title}
            </button>
          ))}
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="flex flex-col items-center">
              <RefreshCw className="h-8 w-8 animate-spin mb-2" style={{ color: themeColors.primary }} />
              <p className="text-white">Loading...</p>
            </div>
          </div>
        )}
        {!proxyLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-5">
            <div className="flex flex-col items-center text-center max-w-md">
              <div
                className="w-16 h-16 border-4 rounded-full animate-spin mb-4"
                style={{ borderColor: `${themeColors.secondary}30`, borderTopColor: themeColors.primary }}
              ></div>
              <p className="text-white mb-2" style={{ color: themeColors.primary }}>
                Initializing JadeVerse Browser...
              </p>
              <p className="text-white/70 text-sm">
                Please wait while we set up your secure browsing environment with Interstellar proxy.
              </p>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src="about:blank"
          className="w-full h-full border-none"
          onLoad={handleIframeLoad}
          title="JadeVerse Browser"
          sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation"
        />
      </div>

      {/* Browser Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-gray-900 border-t border-gray-800 text-xs text-gray-400">
        <div className="flex items-center">
          <Shield className="h-3 w-3 mr-1" style={{ color: themeColors.primary }} />
          <span>Protected by Interstellar</span>
        </div>
        <div className="flex items-center">
          <span>JadeVerse Browser</span>
          <span className="mx-2">|</span>
          <span style={{ color: themeColors.primary }}>{theme.charAt(0).toUpperCase() + theme.slice(1)} Theme</span>
        </div>
      </div>
    </div>
  )
}
