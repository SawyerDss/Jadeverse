"use client"

import { useState, useEffect } from "react"
import { Shirt as TShirt, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function MerchPage() {
  const [iframeUrl, setIframeUrl] = useState("")

  useEffect(() => {
    // Default URL - hardcoded
    const defaultUrl = "https://s0lara.printify.me/"
    setIframeUrl(defaultUrl)
  }, [])

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-primary/20 bg-black/20">
        <div className="flex items-center">
          <TShirt className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-2xl font-bold text-white">Merchandise Store</h1>
        </div>
        <div className="flex items-center gap-2">
          {iframeUrl && (
            <Button
              onClick={() => window.open(iframeUrl, "_blank")}
              variant="outline"
              size="sm"
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1">
        {iframeUrl ? (
          <iframe
            src={iframeUrl}
            className="w-full h-full border-0"
            title="Merchandise Store"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Card className="glass border-primary/20 max-w-md">
              <CardContent className="text-center p-8">
                <TShirt className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Loading Store...</h2>
                <p className="text-white/70 mb-4">Please wait while we load the merchandise store.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
