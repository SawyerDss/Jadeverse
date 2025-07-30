"use client"

import { useState, useEffect, useRef } from "react"
import {
  Home,
  Gamepad2,
  Settings,
  Info,
  LogOut,
  LogIn,
  Copy,
  RefreshCw,
  EyeOff,
  User,
  BotIcon as Robot,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

type Position = {
  x: number
  y: number
}

export default function CustomContextMenu() {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user, signOut } = useAuth()

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()

      // Calculate position, ensuring menu stays within viewport
      const x = Math.min(e.clientX, window.innerWidth - 200)
      const y = Math.min(e.clientY, window.innerHeight - 300)

      setPosition({ x, y })
      setIsVisible(true)
    }

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsVisible(false)
      }
    }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("click", handleClick)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("click", handleClick)
    }
  }, [])

  const handleMenuItemClick = (action: () => void) => {
    action()
    setIsVisible(false)
  }

  const openInAboutBlank = () => {
    const url = window.location.href
    const newWindow = window.open("about:blank", "_blank")
    if (newWindow) {
      newWindow.document.write(`
        <iframe src="${url}" style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"></iframe>
        <style>body { margin: 0; }</style>
      `)
      newWindow.document.title = document.title
    }
  }

  const copyPageUrl = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  if (!isVisible) return null

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] w-56 bg-black/90 border border-primary/40 rounded-lg shadow-lg context-menu"
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
    >
      <div className="py-1">
        <div className="px-3 py-2 text-xs font-semibold text-white/80 border-b border-primary/30">s0lara</div>

        <button
          className="w-full text-left px-3 py-2 text-white hover:bg-primary/10 flex items-center"
          onClick={() => handleMenuItemClick(() => router.push("/"))}
        >
          <Home className="h-4 w-4 mr-2" />
          Home
        </button>

        <button
          className="w-full text-left px-3 py-2 text-white hover:bg-primary/10 flex items-center"
          onClick={() => handleMenuItemClick(() => router.push("/games"))}
        >
          <Gamepad2 className="h-4 w-4 mr-2" />
          Games
        </button>

        <button
          className="w-full text-left px-3 py-2 text-white hover:bg-primary/10 flex items-center"
          onClick={() => handleMenuItemClick(() => router.push("/about"))}
        >
          <Info className="h-4 w-4 mr-2" />
          About
        </button>

        <button
          className="w-full text-left px-3 py-2 text-white hover:bg-primary/10 flex items-center"
          onClick={() => handleMenuItemClick(() => router.push("/jade-ai"))}
        >
          <Robot className="h-4 w-4 mr-2" />
          s0lara AI
        </button>

        {user && (
          <button
            className="w-full text-left px-3 py-2 text-white hover:bg-primary/10 flex items-center"
            onClick={() => handleMenuItemClick(() => router.push("/profile"))}
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </button>
        )}

        <button
          className="w-full text-left px-3 py-2 text-white hover:bg-primary/10 flex items-center"
          onClick={() => handleMenuItemClick(() => router.push("/settings"))}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </button>

        <div className="border-t border-primary/30 my-1"></div>

        <button
          className="w-full text-left px-3 py-2 text-white hover:bg-primary/10 flex items-center"
          onClick={() => handleMenuItemClick(() => window.location.reload())}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Page
        </button>

        <button
          className="w-full text-left px-3 py-2 text-white hover:bg-primary/10 flex items-center"
          onClick={() => handleMenuItemClick(copyPageUrl)}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy URL
        </button>

        <button
          className="w-full text-left px-3 py-2 text-white hover:bg-primary/10 flex items-center"
          onClick={() => handleMenuItemClick(openInAboutBlank)}
        >
          <EyeOff className="h-4 w-4 mr-2" />
          Open in about:blank
        </button>

        <div className="border-t border-primary/30 my-1"></div>

        {user ? (
          <button
            className="w-full text-left px-3 py-2 text-white hover:bg-primary/10 flex items-center"
            onClick={() => handleMenuItemClick(signOut)}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        ) : (
          <button
            className="w-full text-left px-3 py-2 text-white hover:bg-primary/10 flex items-center"
            onClick={() => handleMenuItemClick(() => router.push("/login"))}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </button>
        )}
      </div>
    </div>
  )
}
