"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Globe, Search, ArrowRight, RefreshCw, AlertTriangle } from "lucide-react"

export default function ProxyPage() {
  const [url, setUrl] = useState("https://english.enmar.cl/")
  const [loading, setLoading] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Add https if not present
    let navigateUrl = url
    if (!navigateUrl.startsWith("http://") && !navigateUrl.startsWith("https://")) {
      navigateUrl = "https://" + navigateUrl
      setUrl(navigateUrl)
    }

    // Reset iframe to trigger navigation
    if (iframeRef.current) {
      iframeRef.current.src = navigateUrl
    }
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
          <Globe className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            <span className="text-gradient">Web Proxy</span>
          </h1>
        </div>

        {/* Warning message that proxy doesn't work */}
        <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/40 rounded-lg flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-white mb-1">Proxy Functionality Limited</h3>
            <p className="text-white/70">
              Due to browser security restrictions, this proxy may not work for many websites. Most sites block being
              loaded in iframes for security reasons (X-Frame-Options). This is a demonstration feature only.
            </p>
          </div>
        </div>

        <Card className="glass border-primary/20 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-white">Browse Securely</CardTitle>
            <CardDescription>Access websites through our secure proxy</CardDescription>
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
              <Button type="submit" disabled={loading}>
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Navigate</span>
              </Button>
              <Button type="button" variant="outline" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="relative h-[calc(100vh-300px)] min-h-[500px] rounded-lg overflow-hidden border border-primary/20">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="flex flex-col items-center">
                <RefreshCw className="h-8 w-8 text-primary animate-spin mb-2" />
                <p className="text-white">Loading...</p>
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src="https://english.enmar.cl/"
            className="proxy-frame w-full h-full"
            onLoad={handleIframeLoad}
            title="Web Proxy"
          />
        </div>
      </div>
    </div>
  )
}
