"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Download,
  FileText,
  FileCode,
  FileArchiveIcon as FileZip,
  Clock,
  FileArchive,
  ExternalLink,
} from "lucide-react"
import { useNotification } from "@/lib/notification-context"
import AnimatedText from "@/components/animated-text"

// Update the mockDownloads array to include customizable link property
const mockDownloads = [
  {
    id: "download-1",
    title: "Eaglercraft",
    description: "Minecraft",
    category: "Software",
    icon: <FileCode className="h-10 w-10 text-primary" />,
    size: "13.8 MB",
    version: "1.2.3",
    date: "5-7-2025",
    downloads: 1,
    filename: "Copy of Minecraft (1)",
    link: "https://drive.google.com/uc?export=download&id=1-ctSrgX29qqOui67551GoThFkwaYPa4S",
  },
  {
    id: "download-2",
    title: "Game Assets Pack",
    description: "Collection of game assets for developers.",
    category: "Resources",
    icon: <FileZip className="h-10 w-10 text-yellow-500" />,
    size: "156 MB",
    version: "2.0",
    date: "2024-01-22",
    downloads: 3421,
    filename: "game-assets-pack-v2.zip",
    link: "https://example.com/downloads/game-assets",
  },
  {
    id: "download-3",
    title: "JadeVerse Documentation",
    description: "Complete documentation for JadeVerse API and services.",
    category: "Documentation",
    icon: <FileText className="h-10 w-10 text-blue-500" />,
    size: "3.2 MB",
    version: "2024.1",
    date: "2024-01-05",
    downloads: 8765,
    filename: "jadeverse-docs-2024.pdf",
    link: "https://example.com/downloads/documentation",
  },
  {
    id: "download-4",
    title: "Game Development Kit",
    description: "Tools and resources for creating games for JadeVerse.",
    category: "Software",
    icon: <FileCode className="h-10 w-10 text-primary" />,
    size: "78.3 MB",
    version: "3.1.5",
    date: "2023-12-10",
    downloads: 5432,
    filename: "jadeverse-gdk-3.1.5.zip",
    link: "https://example.com/downloads/gdk",
  },
  {
    id: "download-5",
    title: "UI Resource Pack",
    description: "UI elements and templates for JadeVerse themes.",
    category: "Resources",
    icon: <FileZip className="h-10 w-10 text-yellow-500" />,
    size: "42.7 MB",
    version: "1.0",
    date: "2024-02-01",
    downloads: 2134,
    filename: "ui-resource-pack-v1.zip",
    link: "https://example.com/downloads/ui-resources",
  },
  {
    id: "download-6",
    title: "JadeVerse Mobile App",
    description: "Android APK for JadeVerse mobile access.",
    category: "Software",
    icon: <FileArchive className="h-10 w-10 text-green-500" />,
    size: "18.9 MB",
    version: "0.9.2",
    date: "2024-02-20",
    downloads: 3245,
    filename: "jadeverse-mobile-0.9.2.apk",
    link: "https://example.com/downloads/mobile-app",
  },
]

const categories = ["All", "Software", "Resources", "Documentation"]

export default function DownloadsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filteredDownloads, setFilteredDownloads] = useState(mockDownloads)
  const [activeTab, setActiveTab] = useState("all")
  const { addNotification } = useNotification()

  const handleSearch = () => {
    let results = mockDownloads

    // Filter by search term
    if (searchTerm) {
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      results = results.filter((item) => item.category === selectedCategory)
    }

    // Filter by tab
    if (activeTab === "recent") {
      results = [...results].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else if (activeTab === "popular") {
      results = [...results].sort((a, b) => b.downloads - a.downloads)
    }

    setFilteredDownloads(results)
  }

  const handleDownload = (item: any) => {
    addNotification({
      title: "Download Started",
      message: `${item.title} (${item.filename}) is downloading.`,
      type: "success",
    })

    // Open the link in a new tab
    window.open(item.link, "_blank")
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Download className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            <AnimatedText text="Downloads" className="text-gradient" />
          </h1>
        </div>

        <div className="mb-8 glass rounded-xl p-6 border border-primary/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <Input
                type="text"
                placeholder="Search downloads..."
                className="pl-10 bg-black/50 border-primary/30 focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  className="appearance-none bg-black/50 border border-primary/30 rounded-md px-4 py-2 pr-8 text-white focus:outline-none focus:border-primary"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setTimeout(handleSearch, 0)
                  }}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none h-4 w-4" />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>
        </div>

        <Tabs
          defaultValue="all"
          className="mb-8"
          onValueChange={(value) => {
            setActiveTab(value)
            setTimeout(handleSearch, 0)
          }}
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="all">
              <FileText className="h-4 w-4 mr-2" />
              All Files
            </TabsTrigger>
            <TabsTrigger value="recent">
              <Clock className="h-4 w-4 mr-2" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="popular">
              <Download className="h-4 w-4 mr-2" />
              Most Downloaded
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="space-y-4">
              {filteredDownloads.map((item) => (
                <Card
                  key={item.id}
                  className="glass border-primary/20 hover:border-primary/50 transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="mr-4 flex-shrink-0">{item.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-sm text-white/70">{item.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-white/50">
                          <div>Version: {item.version}</div>
                          <div>Size: {item.size}</div>
                          <div>Date: {new Date(item.date).toLocaleDateString()}</div>
                          <div>{item.downloads.toLocaleString()} downloads</div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button onClick={() => handleDownload(item)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                        <Button variant="secondary" asChild>
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Website
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="mt-0">
            <div className="space-y-4">
              {filteredDownloads.map((item) => (
                <Card
                  key={item.id}
                  className="glass border-primary/20 hover:border-primary/50 transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="mr-4 flex-shrink-0">{item.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-sm text-white/70">{item.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-white/50">
                          <div>Version: {item.version}</div>
                          <div>Size: {item.size}</div>
                          <div>Date: {new Date(item.date).toLocaleDateString()}</div>
                          <div>{item.downloads.toLocaleString()} downloads</div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button onClick={() => handleDownload(item)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                        <Button variant="secondary" asChild>
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Website
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="mt-0">
            <div className="space-y-4">
              {filteredDownloads.map((item) => (
                <Card
                  key={item.id}
                  className="glass border-primary/20 hover:border-primary/50 transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="mr-4 flex-shrink-0">{item.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-sm text-white/70">{item.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-white/50">
                          <div>Version: {item.version}</div>
                          <div>Size: {item.size}</div>
                          <div>Date: {new Date(item.date).toLocaleDateString()}</div>
                          <div className="font-bold text-primary">{item.downloads.toLocaleString()} downloads</div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button onClick={() => handleDownload(item)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                        <Button variant="secondary" asChild>
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Website
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
