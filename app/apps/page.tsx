"use client"

import { useState, useMemo } from "react"
import { useGames } from "@/lib/games-context"
import { Search, Grid, List, Star, Plus, Shuffle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import { GlowingButton } from "@/components/glowing-button"

export default function AppsPage() {
  const { games, toggleFavorite } = useGames()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("recently-played")

  // Filter apps only
  const apps = games.filter((game) => game.type === "app")

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(apps.map((app) => app.category)))]

  // Filter and search apps
  const filteredApps = useMemo(() => {
    const filtered = apps.filter((app) => {
      const matchesSearch =
        app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || app.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort apps
    switch (sortBy) {
      case "a-z":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "z-a":
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
      case "recently-played":
      default:
        // Keep original order for recently played
        break
    }

    return filtered
  }, [apps, searchTerm, selectedCategory, sortBy])

  const getRandomApp = () => {
    if (filteredApps.length === 0) return
    const randomApp = filteredApps[Math.floor(Math.random() * filteredApps.length)]
    window.open(`/apps/${randomApp.id}`, "_blank")
  }

  const AppCard = ({ app }: { app: any }) => (
    <Card className="group relative overflow-hidden border-primary/20 bg-black/40 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:scale-105">
      <CardContent className="p-0">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={app.image || "/placeholder.svg?height=200&width=300&text=App"}
            alt={app.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=200&width=300&text=App"
            }}
          />

          {/* App icon overlay */}
          {app.icon && (
            <div className="absolute top-2 left-2 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-lg backdrop-blur-sm">
              {app.icon}
            </div>
          )}

          {/* Favorite button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 w-8 h-8 p-0 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleFavorite(app.id)
            }}
          >
            <Star className={`h-4 w-4 ${app.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white"}`} />
          </Button>

          {/* Play overlay */}
          <Link href={`/apps/${app.id}`}>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <GlowingButton className="px-6 py-2">Launch App</GlowingButton>
              </div>
            </div>
          </Link>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-white text-bloom-primary group-hover:text-primary transition-colors line-clamp-1">
              {app.title}
            </h3>
            <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary border-primary/30 text-xs">
              {app.category}
            </Badge>
          </div>
          <p className="text-sm text-white/70 line-clamp-2 mb-3">{app.description}</p>

          {app.createdBy && (
            <p className="text-xs text-white/50">
              by {app.createdBy}
              {app.isDev && (
                <Badge variant="outline" className="ml-2 text-xs border-primary/50 text-primary">
                  DEV
                </Badge>
              )}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const AppListItem = ({ app }: { app: any }) => (
    <Card className="group border-primary/20 bg-black/40 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={app.image || "/placeholder.svg?height=64&width=64&text=App"}
              alt={app.title}
              fill
              className="object-cover"
              sizes="64px"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=64&width=64&text=App"
              }}
            />
            {app.icon && (
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-sm backdrop-blur-sm">
                {app.icon}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-white text-bloom-primary group-hover:text-primary transition-colors">
                {app.title}
              </h3>
              <div className="flex items-center gap-2 ml-4">
                <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-xs">
                  {app.category}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleFavorite(app.id)
                  }}
                >
                  <Star className={`h-4 w-4 ${app.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white/50"}`} />
                </Button>
              </div>
            </div>
            <p className="text-sm text-white/70 line-clamp-1 mb-2">{app.description}</p>

            <div className="flex items-center justify-between">
              {app.createdBy && (
                <p className="text-xs text-white/50">
                  by {app.createdBy}
                  {app.isDev && (
                    <Badge variant="outline" className="ml-2 text-xs border-primary/50 text-primary">
                      DEV
                    </Badge>
                  )}
                </p>
              )}
              <Link href={`/apps/${app.id}`}>
                <GlowingButton className="px-4 py-1 text-sm">Launch</GlowingButton>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white text-bloom-primary">Proxeses/Game Sites</h1>
          <p className="text-white/70 mt-1">Launch web applications and game sites</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={getRandomApp}
            disabled={filteredApps.length === 0}
            className="border-primary/30 hover:border-primary/50 bg-transparent"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Random App
          </Button>
          <Link href="/add-content">
            <GlowingButton icon={<Plus className="h-4 w-4" />}>Add App</GlowingButton>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
          <Input
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/40 border-primary/20 text-white placeholder:text-white/50"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48 bg-black/40 border-primary/20 text-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-black border-primary/20">
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="text-white hover:bg-primary/20">
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48 bg-black/40 border-primary/20 text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-black border-primary/20">
            <SelectItem value="recently-played" className="text-white hover:bg-primary/20">
              Recently Played
            </SelectItem>
            <SelectItem value="a-z" className="text-white hover:bg-primary/20">
              A-Z
            </SelectItem>
            <SelectItem value="z-a" className="text-white hover:bg-primary/20">
              Z-A
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="flex border border-primary/20 rounded-md bg-black/40">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="rounded-r-none"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Apps Grid/List */}
      {filteredApps.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold text-white mb-2">No apps found</h3>
          <p className="text-white/70 mb-4">
            {searchTerm || selectedCategory !== "all"
              ? "Try adjusting your search or filters"
              : "No apps have been added yet"}
          </p>
          <Link href="/add-content">
            <GlowingButton>Add First App</GlowingButton>
          </Link>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
          }
        >
          {filteredApps.map((app) =>
            viewMode === "grid" ? <AppCard key={app.id} app={app} /> : <AppListItem key={app.id} app={app} />,
          )}
        </div>
      )}
    </div>
  )
}
