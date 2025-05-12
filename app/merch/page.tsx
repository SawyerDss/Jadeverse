"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  ShoppingCart,
  Tag,
  ShirtIcon as TShirt,
  Star,
  Clock,
  BadgeIcon as Hoodie,
  Sticker,
  MousePointer,
  HardHatIcon as Hat,
  ImageIcon as Image,
  Coffee,
  Smartphone,
  ExternalLink,
} from "lucide-react"
import { useNotification } from "@/lib/notification-context"
import AnimatedText from "@/components/animated-text"

// Update the mockMerch array to include customizable icon and link properties
const mockMerch = [
  {
    id: "merch-1",
    title: "JadeVerse Logo T-Shirt",
    description: "Premium black t-shirt with the iconic JadeVerse logo.",
    category: "Clothing",
    image: "/placeholder.svg?height=200&width=400&text=JadeVerse+Tshirt",
    price: 24.99,
    featured: true,
    inStock: true,
    colors: ["Black", "White", "Gray"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    customIcon: "TShirt", // Default icon
    link: "https://example.com/jadeverse-tshirt", // External link
  },
  {
    id: "merch-2",
    title: "Neon Gamer Hoodie",
    description: "Comfortable hoodie with neon gaming design.",
    category: "Clothing",
    image: "/placeholder.svg?height=200&width=400&text=Neon+Hoodie",
    price: 49.99,
    featured: true,
    inStock: true,
    colors: ["Black", "Navy"],
    sizes: ["M", "L", "XL", "XXL"],
    customIcon: "Hoodie", // Default icon
    link: "https://example.com/neon-hoodie", // External link
  },
  {
    id: "merch-3",
    title: "JadeVerse Sticker Pack",
    description: "Set of 10 high-quality vinyl stickers featuring JadeVerse designs.",
    category: "Accessories",
    image: "/placeholder.svg?height=200&width=400&text=Sticker+Pack",
    price: 12.99,
    featured: false,
    inStock: true,
    colors: ["Multi"],
    sizes: ["One Size"],
    customIcon: "Sticker", // Default icon
    link: "https://example.com/sticker-pack", // External link
  },
  {
    id: "merch-4",
    title: "Gaming Mouse Pad",
    description: "Extra large mouse pad with JadeVerse artwork.",
    category: "Accessories",
    image: "/placeholder.svg?height=200&width=400&text=Mouse+Pad",
    price: 19.99,
    featured: false,
    inStock: true,
    colors: ["Black"],
    sizes: ["XL"],
    customIcon: "MousePointer", // Default icon
    link: "https://example.com/mouse-pad", // External link
  },
  {
    id: "merch-5",
    title: "JadeVerse Cap",
    description: "Adjustable cap with embroidered JadeVerse logo.",
    category: "Clothing",
    image: "/placeholder.svg?height=200&width=400&text=Cap",
    price: 22.99,
    featured: false,
    inStock: true,
    colors: ["Black", "White"],
    sizes: ["One Size"],
    customIcon: "Hat", // Default icon
    link: "https://example.com/cap", // External link
  },
  {
    id: "merch-6",
    title: "Limited Edition Poster",
    description: "High-quality print of JadeVerse artwork.",
    category: "Home",
    image: "/placeholder.svg?height=200&width=400&text=Poster",
    price: 29.99,
    featured: true,
    inStock: false,
    colors: ["Full Color"],
    sizes: ["18x24"],
    customIcon: "Image", // Default icon
    link: "https://example.com/poster", // External link
  },
  {
    id: "merch-7",
    title: "JadeVerse Mug",
    description: "Ceramic mug with JadeVerse logo.",
    category: "Home",
    image: "/placeholder.svg?height=200&width=400&text=Mug",
    price: 14.99,
    featured: false,
    inStock: true,
    colors: ["Black", "White"],
    sizes: ["11oz"],
    customIcon: "Coffee", // Default icon
    link: "https://example.com/mug", // External link
  },
  {
    id: "merch-8",
    title: "Phone Case",
    description: "Protective phone case with JadeVerse design.",
    category: "Accessories",
    image: "/placeholder.svg?height=200&width=400&text=Phone+Case",
    price: 24.99,
    featured: false,
    inStock: true,
    colors: ["Black", "Clear"],
    sizes: ["iPhone", "Samsung"],
    customIcon: "Smartphone", // Default icon
    link: "https://example.com/phone-case", // External link
  },
]

const categories = ["All", "Clothing", "Accessories", "Home"]

export default function MerchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filteredMerch, setFilteredMerch] = useState(mockMerch)
  const [activeTab, setActiveTab] = useState("all")
  const { addNotification } = useNotification()

  const handleSearch = () => {
    let results = mockMerch

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
    if (activeTab === "featured") {
      results = results.filter((item) => item.featured)
    } else if (activeTab === "instock") {
      results = results.filter((item) => item.inStock)
    }

    setFilteredMerch(results)
  }

  // Update the addToCart function to open the link in a new tab
  const addToCart = (item: any) => {
    addNotification({
      title: "Opening Product Page",
      message: `Opening ${item.title} in a new tab.`,
      type: "success",
    })

    // Open the link in a new tab
    window.open(item.link, "_blank")
  }

  // Add a function to get the icon component based on the icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "TShirt":
        return <TShirt className="h-4 w-4 mr-1" />
      case "Hoodie":
        return <Hoodie className="h-4 w-4 mr-1" />
      case "Sticker":
        return <Sticker className="h-4 w-4 mr-1" />
      case "MousePointer":
        return <MousePointer className="h-4 w-4 mr-1" />
      case "Hat":
        return <Hat className="h-4 w-4 mr-1" />
      case "Image":
        return <Image className="h-4 w-4 mr-1" />
      case "Coffee":
        return <Coffee className="h-4 w-4 mr-1" />
      case "Smartphone":
        return <Smartphone className="h-4 w-4 mr-1" />
      default:
        return <ShoppingCart className="h-4 w-4 mr-1" />
    }
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <TShirt className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            <AnimatedText text="Merchandise" className="text-gradient" />
          </h1>
        </div>

        <div className="mb-8 glass rounded-xl p-6 border border-primary/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <Input
                type="text"
                placeholder="Search merchandise..."
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
              <Tag className="h-4 w-4 mr-2" />
              All Items
            </TabsTrigger>
            <TabsTrigger value="featured">
              <Star className="h-4 w-4 mr-2" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="instock">
              <Clock className="h-4 w-4 mr-2" />
              In Stock
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMerch.map((item) => (
                <Card
                  key={item.id}
                  className="glass border-primary/20 hover:border-primary/50 transition-all duration-300 group"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div className="aspect-video bg-black/50 relative">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-white/70 line-clamp-1">{item.description}</p>
                      </div>
                      {item.featured && (
                        <div className="absolute top-2 right-2 bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                          Featured
                        </div>
                      )}
                      {!item.inStock && (
                        <div className="absolute top-2 left-2 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full">
                          Out of Stock
                        </div>
                      )}
                    </div>
                    <div className="p-4 pt-2 flex justify-between items-center">
                      <div className="text-lg font-bold text-white">${item.price}</div>
                      <Button
                        size="sm"
                        onClick={() => addToCart(item)}
                        disabled={!item.inStock}
                        className={!item.inStock ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        {getIconComponent(item.customIcon)}
                        {item.inStock ? "View" : "Sold Out"}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMerch.map((item) => (
                <Card
                  key={item.id}
                  className="glass border-primary/20 hover:border-primary/50 transition-all duration-300 group"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div className="aspect-video bg-black/50 relative">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-white/70 line-clamp-1">{item.description}</p>
                      </div>
                      <div className="absolute top-2 right-2 bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                        Featured
                      </div>
                      {!item.inStock && (
                        <div className="absolute top-2 left-2 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full">
                          Out of Stock
                        </div>
                      )}
                    </div>
                    <div className="p-4 pt-2 flex justify-between items-center">
                      <div className="text-lg font-bold text-white">${item.price}</div>
                      <Button
                        size="sm"
                        onClick={() => addToCart(item)}
                        disabled={!item.inStock}
                        className={!item.inStock ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        {getIconComponent(item.customIcon)}
                        {item.inStock ? "View" : "Sold Out"}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="instock" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMerch.map((item) => (
                <Card
                  key={item.id}
                  className="glass border-primary/20 hover:border-primary/50 transition-all duration-300 group"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div className="aspect-video bg-black/50 relative">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-white/70 line-clamp-1">{item.description}</p>
                      </div>
                      {item.featured && (
                        <div className="absolute top-2 right-2 bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-4 pt-2 flex justify-between items-center">
                      <div className="text-lg font-bold text-white">${item.price}</div>
                      <Button
                        size="sm"
                        onClick={() => addToCart(item)}
                        disabled={!item.inStock}
                        className={!item.inStock ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        {getIconComponent(item.customIcon)}
                        {item.inStock ? "View" : "Sold Out"}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
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
