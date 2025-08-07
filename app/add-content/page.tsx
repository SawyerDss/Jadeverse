"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useGames } from "@/lib/games-context"
import { useAuth } from "@/lib/auth-context"
import { useNotification } from "@/lib/notification-context"
import { GlowingButton } from "@/components/glowing-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, LinkIcon, ImageIcon, Gamepad2, AppWindow, Info, Code } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// Developer email for permanent content
const DEV_EMAIL = "sawyer.debolt@stu.hsv-k12.org"

export default function AddContentPage() {
  const { user } = useAuth()
  const { addGame } = useGames()
  const router = useRouter()
  const { addNotification } = useNotification()

  const [formData, setFormData] = useState({
    title: "",
    contentUrl: "",
    imageUrl: "",
    category: "Entertainment",
    type: "game", // Default to game
  })

  const [codeData, setCodeData] = useState({
    code: "",
  })

  const [error, setError] = useState("")

  // Redirect if not logged in
  if (!user) {
    router.push("/login")
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCodeData({ code: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!formData.title) {
      setError("Please enter a title")
      return
    }

    if (!formData.contentUrl) {
      setError("Please enter a URL")
      return
    }

    try {
      // Simple URL validation
      new URL(formData.contentUrl)

      // Validate image URL if provided
      if (formData.imageUrl) {
        try {
          new URL(formData.imageUrl)
        } catch (err) {
          setError("Please enter a valid image URL")
          return
        }
      }

      // Generate a title from the URL if not provided
      const urlObj = new URL(formData.contentUrl)
      const domain = urlObj.hostname.replace("www.", "")

      // Check if user is dev
      const isDev = user.email === DEV_EMAIL

      // Add content
      const contentId = formData.type + "_" + Math.random().toString(36).substr(2, 9)

      addGame({
        title: formData.title || `${domain} ${formData.type === "game" ? "Game" : "App"}`,
        description: `External ${formData.type} from ${domain}`,
        category: formData.category,
        image: formData.imageUrl || `/placeholder.svg?height=300&width=500&text=${domain}`,
        icon: formData.type === "game" ? "🎮" : "📱",
        createdBy: user.email,
        url: formData.contentUrl,
        type: formData.type,
        isPermanent: isDev,
        isDev: isDev,
      })

      // Show success notification
      addNotification({
        title: `${formData.type === "game" ? "Game" : "App"} Added`,
        message: `${formData.title} has been added to your library${isDev ? " (DEV)" : ""}`,
        type: "success",
      })

      // Redirect to the appropriate page
      router.push(formData.type === "game" ? "/games" : "/apps")
    } catch (err) {
      setError("Please enter a valid URL")
    }
  }

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!codeData.code.trim()) {
      setError("Please paste your code")
      return
    }

    try {
      // Parse the code to extract game details
      const titleMatch = codeData.code.match(/title:\s*["'](.+?)["']/i)
      const urlMatch =
        codeData.code.match(/url:\s*["'](.+?)["']/i) || codeData.code.match(/contentUrl:\s*["'](.+?)["']/i)
      const imageMatch =
        codeData.code.match(/image:\s*["'](.+?)["']/i) || codeData.code.match(/imageUrl:\s*["'](.+?)["']/i)
      const categoryMatch = codeData.code.match(/category:\s*["'](.+?)["']/i)
      const typeMatch = codeData.code.match(/type:\s*["'](.+?)["']/i)

      if (!titleMatch || !urlMatch) {
        setError("Could not extract title and URL from code. Please make sure your code includes these properties.")
        return
      }

      const title = titleMatch[1]
      const url = urlMatch[1]
      const image = imageMatch ? imageMatch[1] : `/placeholder.svg?height=300&width=500&text=${title}`
      const category = categoryMatch ? categoryMatch[1] : "Entertainment"
      const type = typeMatch ? typeMatch[1] : "game"

      // Check if user is dev
      const isDev = user.email === DEV_EMAIL

      // Add content
      const contentId = type + "_" + Math.random().toString(36).substr(2, 9)

      addGame({
        title,
        description: `External ${type} added via code`,
        category,
        image,
        icon: type === "game" ? "🎮" : "📱",
        createdBy: user.email,
        url,
        type,
        isPermanent: isDev,
        isDev: isDev,
      })

      // Show success notification
      addNotification({
        title: `${type === "game" ? "Game" : "App"} Added`,
        message: `${title} has been added to your library${isDev ? " (DEV)" : ""}`,
        type: "success",
      })

      // Redirect to the appropriate page
      router.push(type === "game" ? "/games" : "/apps")
    } catch (err) {
      console.error(err)
      setError("Failed to parse code. Please check your input.")
    }
  }

  return (
    <div className="py-16">
      <div className="max-w-2xl mx-auto">
        <Tabs defaultValue="simple">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="simple">Simple Form</TabsTrigger>
            <TabsTrigger value="code">Paste Code</TabsTrigger>
          </TabsList>

          <TabsContent value="simple">
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white">
                  <span className="text-gradient">Add Content</span>
                  {user.email === DEV_EMAIL && (
                    <span className="ml-2 text-sm bg-emerald-600/20 text-emerald-400 px-2 py-1 rounded-full">DEV</span>
                  )}
                </CardTitle>
                <CardDescription>
                  Add games or apps to your s0lara library
                  {user.email === DEV_EMAIL && " - Your additions will be permanent for all users"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Instructions for adding custom games */}
                <div className="mb-6 p-4 bg-black/30 rounded-lg border border-primary/30">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-white mb-1">How to Add Custom Content</h3>
                      <p className="text-white/70 text-sm mb-2">
                        You can add any game or app by providing a URL to an external website. The content will be
                        embedded in an iframe.
                      </p>
                      <p className="text-white/70 text-sm">
                        <strong>Examples:</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Games: coolmathgames.com, poki.com, etc.</li>
                          <li>Apps: notion.so, figma.com, etc.</li>
                        </ul>
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3 mb-4 flex items-center text-white">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-bloom">
                      Content Type
                    </Label>
                    <RadioGroup value={formData.type} onValueChange={handleTypeChange} className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="game" id="game" />
                        <Label htmlFor="game" className="flex items-center">
                          <Gamepad2 className="mr-2 h-4 w-4 text-primary" />
                          Game
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="app" id="app" />
                        <Label htmlFor="app" className="flex items-center">
                          <AppWindow className="mr-2 h-4 w-4 text-primary" />
                          App
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-bloom">
                      Title *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="bg-black/50 border-primary/30 focus:border-primary"
                      placeholder={`Enter ${formData.type} title`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contentUrl" className="text-bloom">
                      URL *
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <LinkIcon className="h-5 w-5 text-primary" />
                      </div>
                      <Input
                        id="contentUrl"
                        name="contentUrl"
                        value={formData.contentUrl}
                        onChange={handleChange}
                        className="bg-black/50 border-primary/30 focus:border-primary pl-10"
                        placeholder="https://example.com"
                      />
                    </div>
                    <p className="text-white/50 text-xs mt-1">
                      Enter the full URL to the {formData.type} you want to add. It will open in an embedded frame.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-bloom">
                      Category
                    </Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="bg-black/50 border-primary/30 focus:border-primary"
                      placeholder="Entertainment, Education, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-bloom">
                      Custom Image URL (Optional)
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <ImageIcon className="h-5 w-5 text-primary" />
                      </div>
                      <Input
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="bg-black/50 border-primary/30 focus:border-primary pl-10"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <p className="text-white/50 text-xs mt-1">
                      Optionally provide a custom image URL for the thumbnail. If not provided, a default image will be
                      used.
                    </p>
                  </div>

                  <div className="pt-4">
                    <GlowingButton className="w-full" type="submit">
                      Add {formData.type === "game" ? "Game" : "App"}
                    </GlowingButton>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code">
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white">
                  <span className="text-gradient">Add via Code</span>
                  {user.email === DEV_EMAIL && (
                    <span className="ml-2 text-sm bg-emerald-600/20 text-emerald-400 px-2 py-1 rounded-full">DEV</span>
                  )}
                </CardTitle>
                <CardDescription>
                  Paste code to quickly add content
                  {user.email === DEV_EMAIL && " - Your additions will be permanent for all users"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mb-6 p-4 bg-black/30 rounded-lg border border-primary/30">
                  <div className="flex items-start gap-2">
                    <Code className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-white mb-1">Quick Add with Code</h3>
                      <p className="text-white/70 text-sm mb-2">Paste code that includes the following properties:</p>
                      <pre className="bg-black/50 p-2 rounded text-xs text-white/70 mb-2">
                        {`{
  title: "Game Title",
  url: "https://example.com/game",
  image: "https://example.com/image.jpg", // Optional
  category: "Entertainment", // Optional
  type: "game" // or "app", Optional
}`}
                      </pre>
                      <p className="text-white/70 text-xs">The system will extract these values from your code.</p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3 mb-4 flex items-center text-white">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleCodeSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-bloom">
                      Paste Your Code
                    </Label>
                    <Textarea
                      id="code"
                      value={codeData.code}
                      onChange={handleCodeChange}
                      className="bg-black/50 border-primary/30 focus:border-primary min-h-[200px] font-mono"
                      placeholder="Paste code here..."
                    />
                  </div>

                  <div className="pt-4">
                    <GlowingButton className="w-full" type="submit">
                      Extract and Add Content
                    </GlowingButton>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
