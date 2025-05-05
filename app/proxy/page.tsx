"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Globe, Search, ArrowRight, RefreshCw, AlertTriangle, ExternalLink } from "lucide-react"
import { useNotification } from "@/lib/notification-context"

export default function ProxyPage() {
  const { addNotification } = useNotification()
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [uvLoaded, setUvLoaded] = useState(false)

  // Load Ultraviolet scripts
  useEffect(() => {
    const loadUltraviolet = async () => {
      try {
        // Create script elements for Ultraviolet
        const uvScript = document.createElement("script")
        uvScript.src = "https://cdn.jsdelivr.net/gh/titaniumnetwork-dev/Ultraviolet/dist/uv.bundle.js"

        const configScript = document.createElement("script")
        configScript.src = "https://cdn.jsdelivr.net/gh/titaniumnetwork-dev/Ultraviolet/dist/uv.config.js"

        // Append scripts to document
        document.body.appendChild(uvScript)
        document.body.appendChild(configScript)

        // Wait for scripts to load
        uvScript.onload = () => {
          configScript.onload = () => {
            setUvLoaded(true)
            addNotification({
              title: "Ultraviolet Loaded",
              message: "TitaniumNetwork's Ultraviolet proxy is ready to use",
              type: "success",
            })
          }
        }
      } catch (error) {
        console.error("Failed to load Ultraviolet:", error)
        addNotification({
          title: "Proxy Error",
          message: "Failed to load Ultraviolet proxy. Please try again later.",
          type: "error",
        })
      }
    }

    loadUltraviolet()
  }, [addNotification])

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      addNotification({
        title: "Enter URL",
        message: "Please enter a URL to navigate",
        type: "warning",
      })
      return
    }

    setLoading(true)

    // Add https if not present
    let navigateUrl = url
    if (!navigateUrl.startsWith("http://") && !navigateUrl.startsWith("https://")) {
      navigateUrl = "https://" + navigateUrl
      setUrl(navigateUrl)
    }

    try {
      // Use Ultraviolet to proxy the URL
      if (window.__uv && uvLoaded) {
        const encodedUrl = window.__uv.codec.encode(navigateUrl)
        const fullUrl = window.__uv.prefix + encodedUrl

        if (iframeRef.current) {
          iframeRef.current.src = fullUrl
        }
      } else {
        // Fallback if Ultraviolet is not loaded
        if (iframeRef.current) {
          iframeRef.current.src = navigateUrl
        }

        addNotification({
          title: "Proxy Warning",
          message: "Ultraviolet not fully loaded. Using direct navigation which may not work for all sites.",
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
      setLoading(false)
    }
  }

  const handleOpenExternal = () => {
    if (!url) {
      addNotification({
        title: "Enter URL",
        message: "Please enter a URL first",
        type: "warning",
      })
      return
    }

    // Add https if not present
    let navigateUrl = url
    if (!navigateUrl.startsWith("http://") && !navigateUrl.startsWith("https://")) {
      navigateUrl = "https://" + navigateUrl
    }

    // Open in new tab/window
    window.open(navigateUrl, "_blank")
  }

  const handleRefresh = () => {
    setLoading(true)
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  const handleIframeLoad = () => {
    setLoading(false)
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Globe className="h-8 w-8 text-primary mr-3 text-bloom-primary" />
          <h1 className="text-3xl md:text-5xl font-bold text-white text-bloom">
            <span className="text-gradient">Ultraviolet Web Proxy</span>
          </h1>
        </div>

        {/* Info message about TitaniumNetwork */}
        <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg flex items-start">
          <div>
            <h3 className="font-medium text-white text-bloom-primary mb-1">Powered by TitaniumNetwork's Ultraviolet</h3>
            <p className="text-white/70">
              This proxy uses Ultraviolet, a powerful web proxy developed by TitaniumNetwork that allows you to browse
              the web more freely.
            </p>
          </div>
        </div>

        {/* Warning message that proxy doesn't work for all sites */}
        <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/40 rounded-lg flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-white mb-1">Proxy Limitations</h3>
            <p className="text-white/70">
              Some websites may still block proxy access or not function correctly when accessed through a proxy. This
              is a demonstration feature and may not work for all websites.
            </p>
          </div>
        </div>

        <Card className="glass border-primary/20 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-white text-bloom-primary">Browse Securely</CardTitle>
            <CardDescription>Access websites through the Ultraviolet proxy</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNavigate} className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <Input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL..."
                  className="pl-10 bg-black/50 border-primary/30 focus:border-primary"
                />
              </div>
              <Button type="submit" disabled={loading} className="text-bloom-primary">
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Navigate</span>
              </Button>
              <Button type="button" variant="outline" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
              <Button type="button" variant="outline" onClick={handleOpenExternal}>
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Open External</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="relative h-[calc(100vh-300px)] min-h-[500px] rounded-lg overflow-hidden border border-primary/20">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="flex flex-col items-center">
                <RefreshCw className="h-8 w-8 text-primary animate-spin mb-2" />
                <p className="text-white text-bloom-primary">Loading...</p>
              </div>
            </div>
          )}
          {!uvLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-5">
              <div className="flex flex-col items-center text-center max-w-md">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-white text-bloom-primary mb-2">Loading Ultraviolet Proxy...</p>
                <p className="text-white/70 text-sm">
                  Please wait while we initialize the TitaniumNetwork Ultraviolet proxy service.
                </p>
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src="about:blank"
            className="proxy-frame w-full h-full"
            onLoad={handleIframeLoad}
            title="Web Proxy"
            sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation"
          />
        </div>
      </div>
    </div>
  )
}
