"use client"

import { useEffect } from "react"
import { Settings, EyeOff, Palette, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import GlowingButton from "@/components/glowing-button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { ThemeCustomizer } from "./theme-customizer"
import { useTheme } from "@/lib/theme-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSettings } from "@/lib/settings-context"

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { settings, updateSettings, resetSettings, isFeatureEnabled } = useSettings()

  // Set up panic key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === settings.panicKey) {
        // Close the tab
        window.close()

        // Fallback if window.close() doesn't work (some browsers block it)
        window.location.href = "about:blank"
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [settings.panicKey])

  // Set up auto tab cloaking
  useEffect(() => {
    // Check if we're already in an iframe (to prevent infinite recursion)
    const isInIframe = window !== window.top

    // Only proceed if auto tab cloaking is enabled and we're not already in an iframe
    if (settings.autoTabCloaking && !isInIframe && !window.location.href.includes("about:blank")) {
      enableAboutBlankCloaking()
    }
  }, [settings.autoTabCloaking]) // Only run when the setting changes

  const enableAboutBlankCloaking = () => {
    updateSettings({ aboutBlankCloaking: true })

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

  const testPanicButton = () => {
    alert(`Press the ${settings.panicKey} key to test the panic button feature.`)
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
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
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
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-white">Tab Cloaking</CardTitle>
                <CardDescription>Customize how s0lara appears in your browser</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tab-title">Custom Tab Title</Label>
                  <Input
                    id="tab-title"
                    value={settings.tabTitle}
                    onChange={(e) => updateSettings({ tabTitle: e.target.value })}
                    placeholder="Enter custom tab title"
                    className="bg-black/50 border-primary/30 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tab-icon">Custom Tab Icon URL</Label>
                  <Input
                    id="tab-icon"
                    value={settings.tabIcon}
                    onChange={(e) => updateSettings({ tabIcon: e.target.value })}
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
                        updateSettings({ aboutBlankCloaking: false })
                      }
                    }}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <p className="text-white/50 text-xs">
                  Opens s0lara in an about:blank page to hide the website URL. This can be useful for privacy or
                  accessing the site in restricted environments.
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <EyeOff className="h-5 w-5 text-primary" />
                    <Label htmlFor="auto-tab-cloaking">Auto Tab Cloaking</Label>
                  </div>
                  <Switch
                    id="auto-tab-cloaking"
                    checked={settings.autoTabCloaking}
                    onCheckedChange={(checked) => updateSettings({ autoTabCloaking: checked })}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <p className="text-white/50 text-xs">
                  Automatically opens s0lara in an about:blank page every time you visit. This hides the website URL
                  completely.
                </p>

                <div className="pt-4">
                  <GlowingButton className="w-full" onClick={enableAboutBlankCloaking}>
                    Open in about:blank
                  </GlowingButton>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" />
                  Panic Button
                </CardTitle>
                <CardDescription>Set up a key to quickly close the tab in emergency situations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="panic-key">Panic Key</Label>
                  <Select value={settings.panicKey} onValueChange={(value) => updateSettings({ panicKey: value })}>
                    <SelectTrigger className="bg-black/50 border-primary/30 focus:border-primary">
                      <SelectValue placeholder="Select a key" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Escape">Escape (Esc)</SelectItem>
                      <SelectItem value="F1">F1</SelectItem>
                      <SelectItem value="F2">F2</SelectItem>
                      <SelectItem value="F3">F3</SelectItem>
                      <SelectItem value="F4">F4</SelectItem>
                      <SelectItem value="`">`</SelectItem>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="End">End</SelectItem>
                      <SelectItem value="Insert">Insert</SelectItem>
                      <SelectItem value="Delete">Delete</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-white/50 text-xs">
                    When you press this key, the tab will immediately close. Use this in emergency situations when you
                    need to quickly hide the site.
                  </p>
                </div>

                <div className="pt-4">
                  <GlowingButton className="w-full" onClick={testPanicButton}>
                    Test Panic Button
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
                  <p className="text-white/70 mb-4">Sign in to access all features of s0lara</p>
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
