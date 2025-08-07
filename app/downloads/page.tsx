"use client"

import { useState } from "react"
import { Download, Search, Filter, Star, Calendar, FileText, Archive, Code, Image, Music, Video } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const downloadItems = [
  {
    id: 1,
    name: "Eaglercraft (Minecraft) 1.5.2",
    description: "eaglercraft",
    category: "Development",
    size: "?",
    downloads: 1,
    rating: 4.8,
    date: "?",
    type: "zip",
    icon: Image,
    featured: true,
    downloadLink: "https://drive.google.com/uc?export=download&id=1WTZfw2f9sVI43Hs1bIn9BH3Z3O_ERekf",
  },
  {
    id: 2,
    name: "Eaglercraft (Minecraft) 1.8.8",
    description: "?",
    category: "Development",
    size: "?",
    downloads: 1,
    rating: 4.9,
    date: "?",
    type: "zip",
    icon: Code,
    featured: true,
    downloadLink: "https://drive.google.com/uc?export=download&id=1Yd3emAKUUsmi1TL0yDbn6H5eGT0gsJgB",
  },
  {
    id: 3,
    name: "!test! page not ready",
    description: "67",
    category: "Audio",
    size: "78.9 MB",
    downloads: 67,
    rating: 4.7,
    date: "67",
    type: "zip",
    icon: Music,
    downloadLink: "https://example.com/download3.zip",
  },
  {
    id: 4,
    name: "!test! page not ready",
    description: "7",
    category: "Development",
    size: "12.3 MB",
    downloads: 7,
    rating: 4.6,
    date: "67",
    type: "zip",
    icon: Code,
    downloadLink: "https://example.com/download4.zip",
  },
  {
    id: 5,
    name: "!test! page not ready",
    description: "76",
    category: "Graphics",
    size: "34.7 MB",
    downloads: 76,
    rating: 4.5,
    date: "2024-01-03",
    type: "zip",
    icon: Video,
    downloadLink: "https://example.com/download5.zip",
  },
  {
    id: 6,
    name: "!test! page not ready",
    description: "67",
    category: "Documentation",
    size: "8.1 MB",
    downloads: 76,
    rating: 4.8,
    date: "76",
    type: "pdf",
    icon: FileText,
    downloadLink: "https://example.com/download6.pdf",
  },
]

const categories = ["All", "Graphics", "Development", "Audio", "Documentation"]
const sortOptions = [
  { value: "downloads", label: "Most Downloaded" },
  { value: "rating", label: "Highest Rated" },
  { value: "date", label: "Newest" },
  { value: "name", label: "Name" },
]

export default function DownloadsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("downloads")

  const filteredItems = downloadItems
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "downloads":
          return b.downloads - a.downloads
        case "rating":
          return b.rating - a.rating
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-bloom-primary mb-4">
            <span className="text-gradient">Downloads</span>
          </h1>
          <p className="text-white/70 text-lg">
            Free resources, tools, and assets for the s0lara community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                placeholder="Search downloads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/50 border-primary/30 focus:border-primary text-white placeholder-white/50"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-black/50 border-primary/30 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-primary/30">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-primary/20">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-black/50 border-primary/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-primary/30">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white hover:bg-primary/20">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Downloads */}
        {selectedCategory === "All" && searchTerm === "" && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Star className="h-6 w-6 text-primary mr-2" />
              Featured Downloads
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {downloadItems
                .filter((item) => item.featured)
                .map((item) => {
                  const IconComponent = item.icon
                  return (
                    <Card key={item.id} className="glass border-primary/20 hover:border-primary/50 transition-all duration-300 transform hover:scale-[1.02]">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-white text-lg">{item.name}</CardTitle>
                              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                                {item.category}
                              </Badge>
                            </div>
                          </div>
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white/70 mb-4">{item.description}</p>
                        <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                          <span>{item.size}</span>
                          <span>{item.downloads.toLocaleString()} downloads</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            {item.rating}
                          </div>
                        </div>
                        <Button asChild className="w-full bg-primary hover:bg-primary/80 text-white">
                          <a href={item.downloadLink} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </div>
        )}

        {/* All Downloads */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Archive className="h-6 w-6 text-primary mr-2" />
            All Downloads ({filteredItems.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Card key={item.id} className="glass border-primary/20 hover:border-primary/50 transition-all duration-300 transform hover:scale-[1.02]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-base">{item.name}</CardTitle>
                          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-xs">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      {item.featured && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                          <Star className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 text-sm mb-4">{item.description}</p>
                    <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                      <span>{item.size}</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        {item.rating}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                      <span>{item.downloads.toLocaleString()} downloads</span>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </div>
                    <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/80 text-white">
                      <a href={item.downloadLink} target="_blank" rel="noopener noreferrer">
                        <Download className="h-3 w-3 mr-2" />
                        Download
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Archive className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No downloads found</h3>
            <p className="text-white/60">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
