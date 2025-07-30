"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Gamepad2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  Info,
  BotIcon as Robot,
  AppWindow,
  Lightbulb,
  ChevronDown,
  Code,
  Download,
  ShirtIcon as TShirt,
  ShoppingCart,
  Globe,
  Home,
  User,
  Shield,
  Film,
  Coffee,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect, useCallback } from "react"
import AnimatedText from "@/components/animated-text"
import { useSettings } from "@/lib/settings-context"

export default function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { settings, isFeatureEnabled } = useSettings()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    main: true,
    content: true,
    social: true,
    tools: true,
    shop: true,
    other: true,
  })
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    try {
      const savedState = localStorage.getItem("sidebar-collapsed")
      if (savedState !== null) {
        setCollapsed(savedState === "true")
      }

      const savedExpandedGroups = localStorage.getItem("sidebar-expanded-groups")
      if (savedExpandedGroups !== null) {
        try {
          const parsed = JSON.parse(savedExpandedGroups)
          if (parsed && typeof parsed === "object") {
            setExpandedGroups(parsed)
          }
        } catch (e) {
          console.error("Failed to parse expanded groups:", e)
          localStorage.removeItem("sidebar-expanded-groups")
        }
      }
      setIsInitialized(true)
    } catch (error) {
      console.error("Error initializing sidebar:", error)
      setIsInitialized(true)
    }
  }, [])

  const toggleSidebar = useCallback(() => {
    try {
      const newState = !collapsed
      setCollapsed(newState)
      localStorage.setItem("sidebar-collapsed", String(newState))
    } catch (error) {
      console.error("Error toggling sidebar:", error)
    }
  }, [collapsed])

  const toggleGroup = useCallback(
    (group: string) => {
      try {
        const newExpandedGroups = {
          ...expandedGroups,
          [group]: !expandedGroups[group],
        }
        setExpandedGroups(newExpandedGroups)
        localStorage.setItem("sidebar-expanded-groups", JSON.stringify(newExpandedGroups))

        const groupElement = document.getElementById(`sidebar-group-${group}`)
        if (groupElement) {
          groupElement.classList.add("pulse-animation")
          setTimeout(() => {
            groupElement.classList.remove("pulse-animation")
          }, 500)
        }
      } catch (error) {
        console.error("Error toggling group:", error)
      }
    },
    [expandedGroups],
  )

  const navGroups = {
    main: [{ href: "/", icon: Home, label: "Home" }],
    content: [
      { href: "/games", icon: Gamepad2, label: "Games" },
      { href: "/apps", icon: AppWindow, label: "Apps" },
      { href: "/entertainment", icon: Film, label: "Entertainment", requiresFeature: "showMovies" },
      ...(isFeatureEnabled("showExploits") ? [{ href: "/exploits", icon: Code, label: "Exploits" }] : []),
      ...(isFeatureEnabled("showDownloads") ? [{ href: "/downloads", icon: Download, label: "Downloads" }] : []),
    ],
    social: [
      ...(isFeatureEnabled("showJadeAI") ? [{ href: "/jade-ai", icon: Robot, label: "s0lara AI" }] : []),
      { href: "/friends", icon: Users, label: "Friends", requiresAuth: true },
    ],
    shop: [{ href: "/merch", icon: TShirt, label: "Merchandise" }],
    tools: [
      ...(isFeatureEnabled("showBrowser") ? [{ href: "/browser", icon: Globe, label: "Browser" }] : []),
      ...(isFeatureEnabled("showProxy") ? [{ href: "/proxy", icon: Shield, label: "Proxy" }] : []),
    ],
    other: [
      ...(isFeatureEnabled("showAbout") ? [{ href: "/about", icon: Info, label: "About" }] : []),
      ...(isFeatureEnabled("showSuggestions") ? [{ href: "/suggestions", icon: Lightbulb, label: "Suggestions" }] : []),
      { href: "/credits", icon: Coffee, label: "Credits" },
    ],
  }

  const groupLabels = {
    main: "Navigation",
    content: "Content Library",
    social: "Community",
    shop: "Marketplace",
    tools: "Web Tools",
    other: "Other",
  }

  const groupIcons = {
    main: Home,
    content: Gamepad2,
    social: Users,
    shop: ShoppingCart,
    tools: Globe,
    other: Info,
  }

  const getActiveGroup = useCallback(() => {
    for (const [group, items] of Object.entries(navGroups)) {
      if (items.some((item: any) => item.href === pathname)) {
        return group
      }
    }
    return null
  }, [pathname])

  const activeGroup = getActiveGroup()

  const visibleGroups = Object.entries(navGroups).filter(
    ([_, items]) =>
      items.filter(
        (item: any) =>
          (!item.requiresAuth || user) && (!item.requiresFeature || isFeatureEnabled(item.requiresFeature as any)),
      ).length > 0,
  )

  if (!isInitialized) {
    return (
      <div className="fixed left-0 top-0 h-full sidebar z-50 flex flex-col items-center py-6 w-16 border-r border-primary/30 bg-black/40 backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.15)]">
        <div className="p-3 rounded-lg mb-8 animate-pulse">
          <AnimatedText text="s0" className="text-sm font-bold" gradient />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full sidebar z-50 flex flex-col items-center py-6 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        "border-r border-primary/30 bg-black/40 backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.15)]",
      )}
    >
      <Link
        href="/"
        className="p-3 rounded-lg text-white mb-8 hover:scale-110 transition-transform duration-300 relative group"
      >
        {collapsed ? (
          <AnimatedText text="s0" className="text-sm font-bold" gradient />
        ) : (
          <AnimatedText text="s0lara" className="text-lg font-bold" gradient />
        )}
        <span className="sr-only">s0lara</span>
      </Link>

      <nav className="flex flex-col items-center gap-2 w-full overflow-y-auto flex-1 px-3 sidebar-nav">
        {visibleGroups.map(([groupKey, items]) => {
          const GroupIcon = groupIcons[groupKey as keyof typeof groupIcons]
          const isActiveGroup = activeGroup === groupKey

          const visibleItems = items.filter(
            (item: any) =>
              (!item.requiresAuth || user) && (!item.requiresFeature || isFeatureEnabled(item.requiresFeature as any)),
          )

          if (visibleItems.length === 0) return null

          return (
            <div key={groupKey} className="w-full mb-3">
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(groupKey)}
                  className={cn(
                    "flex items-center justify-between w-full text-xs font-semibold uppercase mb-2 px-3 py-2 rounded-md transition-all duration-300 group",
                    isActiveGroup
                      ? "text-white bg-primary/10 border border-primary/30"
                      : "text-white/70 hover:text-white hover:bg-primary/10",
                  )}
                  id={`sidebar-group-${groupKey}`}
                >
                  <div className="flex items-center">
                    <GroupIcon
                      className={cn(
                        "h-4 w-4 mr-2",
                        isActiveGroup ? "text-primary" : "text-primary/80 group-hover:text-primary",
                      )}
                    />
                    <span>{groupLabels[groupKey as keyof typeof groupLabels]}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-300 text-primary/80 group-hover:text-primary",
                      expandedGroups[groupKey] ? "transform rotate-180" : "",
                    )}
                  />
                </button>
              )}

              {(collapsed || expandedGroups[groupKey]) && (
                <div
                  className={cn(
                    "space-y-1 overflow-hidden transition-all duration-300",
                    !collapsed && expandedGroups[groupKey]
                      ? "max-h-96 opacity-100"
                      : collapsed
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0",
                  )}
                >
                  {visibleItems
                    .filter((item: any) => !item.requiresAuth || user)
                    .map((item: any, index: number) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "p-3 rounded-lg transition-all duration-300 hover:scale-105 relative group flex items-center",
                            collapsed ? "justify-center w-10 mx-auto" : "w-full px-4 ml-2",
                            isActive
                              ? "text-white bg-primary/20 border border-primary/50 shadow-md shadow-primary/10"
                              : "text-white/80 hover:text-white hover:bg-primary/10",
                          )}
                          style={{
                            animationDelay: `${index * 50}ms`,
                          }}
                        >
                          <item.icon className={cn("flex-shrink-0", collapsed ? "h-5 w-5" : "h-5 w-5")} />
                          {!collapsed && <span className="ml-3 text-sm">{item.label}</span>}

                          {collapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-black/90 border border-primary/40 rounded text-white text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                              {item.label}
                            </div>
                          )}

                          {isActive && (
                            <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                          )}
                        </Link>
                      )
                    })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="mt-auto mb-6 w-full px-3 space-y-2 border-t border-primary/20 pt-4">
        <Link
          href="/settings"
          className={cn(
            "p-3 rounded-lg transition-all duration-300 hover:scale-105 relative group flex items-center",
            collapsed ? "justify-center w-10 mx-auto" : "w-full px-4",
            pathname === "/settings"
              ? "text-white bg-primary/20 border border-primary/50 shadow-md shadow-primary/10"
              : "text-white/80 hover:text-white hover:bg-primary/10",
          )}
        >
          <Settings className={cn("flex-shrink-0", collapsed ? "h-5 w-5" : "h-5 w-5")} />
          {!collapsed && <span className="ml-3 text-sm">Settings</span>}

          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-black/90 border border-primary/40 rounded text-white text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              Settings
            </div>
          )}

          {pathname === "/settings" && (
            <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
          )}
        </Link>

        {user && (
          <Link
            href="/profile"
            className={cn(
              "p-3 rounded-lg transition-all duration-300 hover:scale-105 relative group flex items-center",
              collapsed ? "justify-center w-10 mx-auto" : "w-full px-4",
              pathname === "/profile"
                ? "text-white bg-primary/20 border border-primary/50 shadow-md shadow-primary/10"
                : "text-white/80 hover:text-white hover:bg-primary/10",
            )}
          >
            <User className={cn("flex-shrink-0", collapsed ? "h-5 w-5" : "h-5 w-5")} />
            {!collapsed && <span className="ml-3 text-sm">Profile</span>}

            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-black/90 border border-primary/40 rounded text-white text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                Profile
              </div>
            )}
          </Link>
        )}

        {user ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className={cn(
              "text-white/80 hover:text-white hover:bg-primary/10 rounded-lg transition-all duration-300 hover:scale-110 relative group",
              collapsed ? "w-10 h-10 mx-auto" : "w-full p-2 justify-start",
            )}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-3 text-sm">Sign Out</span>}

            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-black/90 border border-primary/40 rounded text-white text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                Sign Out
              </div>
            )}
          </Button>
        ) : (
          <Link
            href="/login"
            className={cn(
              "p-3 text-white/80 hover:text-white hover:bg-primary/10 rounded-lg transition-all duration-300 hover:scale-110 block relative group flex items-center",
              collapsed ? "justify-center w-10 mx-auto" : "w-full px-4",
            )}
          >
            <Users className="h-5 w-5" />
            {!collapsed && <span className="ml-3 text-sm">Sign In</span>}

            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-black/90 border border-primary/40 rounded text-white text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                Sign In
              </div>
            )}
          </Link>
        )}
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-colors duration-300 border border-primary/40 shadow-lg shadow-primary/20 hover:scale-110"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  )
}
