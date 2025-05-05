"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Gamepad2,
  Rocket,
  Settings,
  PlusCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  Info,
  BotIcon as Robot,
  AppWindow,
  Lightbulb,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"
import AnimatedText from "@/components/animated-text"

export default function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed")
    if (savedState !== null) {
      setCollapsed(savedState === "true")
    }
  }, [])

  // Save sidebar state to localStorage
  const toggleSidebar = () => {
    const newState = !collapsed
    setCollapsed(newState)
    localStorage.setItem("sidebar-collapsed", String(newState))
  }

  const navItems = [
    { href: "/", icon: Rocket, label: "Home", category: "main" },
    { href: "/games", icon: Gamepad2, label: "Games", category: "main" },
    { href: "/apps", icon: AppWindow, label: "Apps", category: "main" },
    { href: "/about", icon: Info, label: "About", category: "main" },
    { href: "/jade-ai", icon: Robot, label: "JadeAI", category: "main" },
    { href: "/suggestions", icon: Lightbulb, label: "Suggestions", category: "main" },
    { href: "/add-content", icon: PlusCircle, label: "Add Content", category: "user", requiresAuth: true },
    { href: "/settings", icon: Settings, label: "Settings", category: "user" },
    { href: "/profile", icon: Users, label: "Profile", category: "user", requiresAuth: true },
  ]

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full sidebar z-50 flex flex-col items-center py-6 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <Link
        href="/"
        className="p-3 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white mb-8 hover:scale-110 transition-transform duration-300 relative group shadow-lg shadow-primary/20"
      >
        {collapsed ? (
          <Rocket className="h-6 w-6" />
        ) : (
          <div className="flex items-center">
            <Rocket className="h-6 w-6 mr-2" />
            <AnimatedText text="JadeVerse" className="font-bold" />
          </div>
        )}
        <span className="sr-only">JadeVerse</span>
      </Link>

      <div className="w-full px-3 mb-2">
        {!collapsed && <div className="text-xs font-semibold text-white/50 uppercase mb-2 ml-2">Main</div>}
      </div>

      <nav className="flex flex-col items-center gap-2 w-full">
        {navItems
          .filter((item) => item.category === "main")
          .map((item) => {
            // Don't show items that require auth if user is not logged in
            if (item.requiresAuth && !user) return null

            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "p-3 rounded-lg transition-all duration-300 hover:scale-105 relative group flex items-center",
                  collapsed ? "justify-center w-10 mx-auto" : "w-[90%] px-4 mx-3",
                  isActive
                    ? "text-white bg-primary/20 border border-primary/50 shadow-md shadow-primary/10"
                    : "text-white/80 hover:text-white hover:bg-primary/10",
                )}
              >
                <item.icon className={cn("flex-shrink-0", collapsed ? "h-5 w-5" : "h-5 w-5")} />
                {!collapsed && <span className="ml-3 text-sm">{item.label}</span>}

                {/* Tooltip only when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-black/90 border border-primary/40 rounded text-white text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            )
          })}
      </nav>

      {!collapsed && (
        <div className="w-full px-3 mt-4 mb-2">
          <div className="text-xs font-semibold text-white/50 uppercase mb-2 ml-2">User</div>
        </div>
      )}

      <div className="flex flex-col items-center gap-2 w-full">
        {navItems
          .filter((item) => item.category === "user")
          .map((item) => {
            // Don't show items that require auth if user is not logged in
            if (item.requiresAuth && !user) return null

            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "p-3 rounded-lg transition-all duration-300 hover:scale-105 relative group flex items-center",
                  collapsed ? "justify-center w-10 mx-auto" : "w-[90%] px-4 mx-3",
                  isActive
                    ? "text-white bg-primary/20 border border-primary/50 shadow-md shadow-primary/10"
                    : "text-white/80 hover:text-white hover:bg-primary/10",
                )}
              >
                <item.icon className={cn("flex-shrink-0", collapsed ? "h-5 w-5" : "h-5 w-5")} />
                {!collapsed && <span className="ml-3 text-sm">{item.label}</span>}

                {/* Tooltip only when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-black/90 border border-primary/40 rounded text-white text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            )
          })}
      </div>

      {user ? (
        <div className={cn("mt-auto mb-6 flex flex-col items-center", collapsed ? "w-10" : "w-[90%]")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className={cn(
              "text-white/80 hover:text-white hover:bg-primary/10 rounded-lg transition-all duration-300 hover:scale-110 relative group",
              collapsed ? "w-10 h-10" : "w-[90%] p-2 justify-start mx-3",
            )}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-3 text-sm">Sign Out</span>}

            {/* Tooltip only when collapsed */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-black/90 border border-primary/40 rounded text-white text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                Sign Out
              </div>
            )}
          </Button>
        </div>
      ) : (
        <div className="mt-auto mb-6 w-full flex justify-center">
          <Link
            href="/login"
            className={cn(
              "p-3 text-white/80 hover:text-white hover:bg-primary/10 rounded-lg transition-all duration-300 hover:scale-110 block relative group flex items-center",
              collapsed ? "justify-center w-10" : "w-[90%] px-4 mx-3",
            )}
          >
            <Users className="h-5 w-5" />
            {!collapsed && <span className="ml-3 text-sm">Sign In</span>}

            {/* Tooltip only when collapsed */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-black/90 border border-primary/40 rounded text-white text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                Sign In
              </div>
            )}
          </Link>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-colors duration-300 border border-primary/40 shadow-lg shadow-primary/20"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  )
}
