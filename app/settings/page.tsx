"use client"

import { useState, useEffect } from "react"
import { Settings, Moon, Sun, Eye, EyeOff, Bell, MousePointer, Sparkles, Palette } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { useNotification } from "@/lib/notification-context"
import GlowingButton from "@/components/glowing-button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { ThemeCustomizer } from "./theme-customizer"
import { useTheme } from "@/lib/theme-context"

export default function SettingsPage() {
  const { user } = useAuth()
  const { addNotification, clearNotifications } = useNotification()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const [settings, setSettings] = useState({
    darkMode: true,
    animations: true,
    highContrast: false,
    reducedMotion: false,
    notifications: true,
    aboutBlankCloaking: false,
    mouseTrail: false,
    buttonEffects: true,
    snowEffect: false,
    matrixEffect: false,
    tabTitle: document.title,
    tabIcon: "/favicon.ico",
  })

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("user-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))

      // Apply animations setting
      if (JSON.parse(savedSettings).reducedMotion) {
        document.documentElement.classList.add("reduced-motion")
      } else {
        document.documentElement.classList.remove("reduced-motion")
      }

      // Apply high contrast setting
      if (JSON.parse(savedSettings).highContrast) {
        document.documentElement.classList.add("high-contrast")
      } else {
        document.documentElement.classList.remove("high-contrast")
      }
    }
  }, [])

  // Save settings to localStorage
  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem("user-settings", JSON.stringify(newSettings))

    // Apply animation settings immediately
    if (key === "reducedMotion") {
      if (value) {
        document.documentElement.classList.add("reduced-motion")
      } else {
        document.documentElement.classList.remove("reduced-motion")
      }
    }

    // Apply high contrast settings immediately
    if (key === "highContrast") {
      if (value) {
        document.documentElement.classList.add("high-contrast")
      } else {
        document.documentElement.classList.remove("high-contrast")
      }
    }

    // Apply mouse trail setting
    if (key === "mouseTrail") {
      localStorage.setItem("mouseTrail", String(value))
    }

    // Apply button effects setting
    if (key === "buttonEffects") {
      localStorage.setItem("buttonEffects", String(value))
    }

    // Show notification
    addNotification({
      title: "Settings Updated",
      message: `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")} has been updated`,
      type: "success",
      duration: 3000,
    })
  }

  const enableAboutBlankCloaking = () => {
    updateSetting("aboutBlankCloaking", true)

    // Open in about:blank
    const url = window.location.href
    const newWindow = window.open("about:blank", "_blank")
    if (newWindow) {
      newWindow.document.write(`
        <iframe src="${url}" style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"></iframe>
        <style>body { margin: 0; }</style>
      `)
      newWindow.document.title = settings.tabTitle || document.title

      // Set favicon if provided
      if (settings.tabIcon) {
        const link = newWindow.document.createElement("link")
        link.rel = "icon"
        link.href = settings.tabIcon
        newWindow.document.head.appendChild(link)
      }
    }
  }

  const testNotification = () => {
    addNotification({
      title: "Test Notification",
      message: "This is a test notification to check if notifications are working correctly.",
      type: "info",
      duration: 5000,
    })
  }

  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <Settings className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            <span className="text-gradient">Settings</span>
          </h1>
        </div>

        <Tabs defaultValue="appearance">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            {/* Theme Customizer */}
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <Palette className="h-6 w-6 text-primary mr-2" />
                <h2 className="text-2xl font-bold text-white">Theme Customization</h2>
              </div>

              <ThemeCustomizer currentTheme={theme} onThemeChange={setTheme} />
            </div>

            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-white">Display Settings</CardTitle>
                <CardDescription>Customize the look of JadeVerse</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Moon className="h-5 w-5 text-primary" />
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => updateSetting("darkMode", checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-primary" />
                    <Label htmlFor="animations">Animations</Label>
                  </div>
                  <Switch
                    id="animations"
                    checked={settings.animations}
                    onCheckedChange={(checked) => updateSetting("animations", checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-5 w-5 text-primary" />
                    <Label htmlFor="high-contrast">High Contrast</Label>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={settings.highContrast}
                    onCheckedChange={(checked) => updateSetting("highContrast", checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <EyeOff className="h-5 w-5 text-primary" />
                    <Label htmlFor="reduced-motion">Reduced Motion</Label>
                  </div>
                  <Switch
                    id="reduced-motion"
                    checked={settings.reducedMotion}
                    onCheckedChange={(checked) => updateSetting("reducedMotion", checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-white">Notifications</CardTitle>
                <CardDescription>Manage notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <Label htmlFor="notifications">Enable Notifications</Label>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => updateSetting("notifications", checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button className="text-primary hover:text-primary/80 text-sm" onClick={testNotification}>
                    Test Notification
                  </button>
                  <span className="text-white/50">•</span>
                  <button
                    className="text-primary hover:text-primary/80 text-sm"
                    onClick={() => {
                      clearNotifications()
                      addNotification({
                        title: "Notifications Cleared",
                        message: "All notifications have been cleared",
                        type: "info",
                        duration: 3000,
                      })
                    }}
                  >
                    Clear All Notifications
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="effects" className="space-y-6">
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-white">Visual Effects</CardTitle>
                <CardDescription>Customize visual effects and animations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MousePointer className="h-5 w-5 text-primary" />
                    <Label htmlFor="mouse-trail">Mouse Trail</Label>
                  </div>
                  <Switch
                    id="mouse-trail"
                    checked={settings.mouseTrail}
                    onCheckedChange={(checked) => updateSetting("mouseTrail", checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <Label htmlFor="button-effects">Button Click Effects</Label>
                  </div>
                  <Switch
                    id="button-effects"
                    checked={settings.buttonEffects}
                    onCheckedChange={(checked) => updateSetting("buttonEffects", checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-primary"
                    >
                      <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
                      <path d="m8 16 2 2 4-4" />
                    </svg>
                    <Label htmlFor="snow-effect">Snow Effect</Label>
                  </div>
                  <Switch
                    id="snow-effect"
                    checked={settings.snowEffect}
                    onCheckedChange={(checked) => updateSetting("snowEffect", checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-primary"
                    >
                      <path d="M12 2v20M2 12h20M7 12l5-5M7 12l5 5M17 12l-5-5M17 12l-5 5" />
                    </svg>
                    <Label htmlFor="matrix-effect">Matrix Effect</Label>
                  </div>
                  <Switch
                    id="matrix-effect"
                    checked={settings.matrixEffect}
                    onCheckedChange={(checked) => updateSetting("matrixEffect", checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="pt-4">
                  <GlowingButton
                    className="w-full"
                    onClick={() => {
                      // Create confetti effect
                      for (let i = 0; i < 100; i++) {
                        const confetti = document.createElement("div")
                        confetti.className = "confetti"
                        confetti.style.left = `${Math.random() * 100}vw`
                        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`
                        confetti.style.width = `${Math.random() * 10 + 5}px`
                        confetti.style.height = `${Math.random() * 10 + 5}px`
                        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`
                        document.body.appendChild(confetti)

                        setTimeout(() => {
                          if (confetti.parentNode) {
                            confetti.parentNode.removeChild(confetti)
                          }
                        }, 5000)
                      }

                      addNotification({
                        title: "Confetti!",
                        message: "Enjoy the celebration!",
                        type: "success",
                      })
                    }}
                  >
                    Test Confetti Effect
                  </GlowingButton>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-white">Tab Cloaking</CardTitle>
                <CardDescription>Customize how JadeVerse appears in your browser</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tab-title">Custom Tab Title</Label>
                  <Input
                    id="tab-title"
                    value={settings.tabTitle}
                    onChange={(e) => updateSetting("tabTitle", e.target.value)}
                    placeholder="Enter custom tab title"
                    className="bg-black/50 border-primary/30 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tab-icon">Custom Tab Icon URL</Label>
                  <Input
                    id="tab-icon"
                    value={settings.tabIcon}
                    onChange={(e) => updateSetting("tabIcon", e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                    className="bg-black/50 border-primary/30 focus:border-primary"
                  />
                  <p className="text-white/50 text-xs">Enter a URL to an image to use as the tab icon (favicon)</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <EyeOff className="h-5 w-5 text-primary" />
                    <Label htmlFor="about-blank">about:blank Cloaking</Label>
                  </div>
                  <Switch
                    id="about-blank"
                    checked={settings.aboutBlankCloaking}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        enableAboutBlankCloaking()
                      } else {
                        updateSetting("aboutBlankCloaking", false)
                      }
                    }}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <p className="text-white/50 text-xs">
                  Opens JadeVerse in an about:blank page to hide the website URL. This can be useful for privacy or
                  accessing the site in restricted environments.
                </p>

                <div className="pt-4">
                  <GlowingButton className="w-full" onClick={enableAboutBlankCloaking}>
                    Open in about:blank
                  </GlowingButton>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            {user ? (
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Account</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-sm text-white/70">Signed in as:</p>
                    <p className="text-white font-medium">{user.username}</p>
                    <p className="text-white/70 text-sm">{user.email}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Account</CardTitle>
                  <CardDescription>You are not signed in</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 mb-4">Sign in to access all features of JadeVerse</p>
                  <GlowingButton className="w-full" onClick={() => router.push("/login")}>
                    Sign In
                  </GlowingButton>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
