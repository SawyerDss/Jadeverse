"use client"

import { useEffect } from "react"
import {
  Settings,
  EyeOff,
  Palette,
  AlertTriangle,
  Beaker,
  Film,
  Code,
  Download,
  Globe,
  Shield,
  BotIcon as Robot,
} from "lucide-react"
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
          <TabsList className="grid grid-cols-4 mb-6">
            {" "}
            {/* Changed to grid-cols-4 */}
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="experimental">Experimental</TabsTrigger>
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

          <TabsContent value="experimental" className="space-y-6">
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <Beaker className="h-5 w-5 text-amber-400 mr-2" />
                  Experimental Features
                </CardTitle>
                <CardDescription>Enable or disable experimental features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-md mb-4">
                  <p className="text-amber-400 text-sm">
                    Warning: These features are experimental and may not work as expected. Enable at your own risk.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Film className="h-5 w-5 text-primary" />
                    <Label htmlFor="show-movies">Entertainment Section</Label>
                  </div>
                  <Switch
                    id="show-movies"
                    checked={settings.showMovies}
                    onCheckedChange={(checked) => updateSettings({ showMovies: checked })}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <p className="text-white/50 text-xs">Enable the Entertainment section to browse movies and shows.</p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Robot className="h-5 w-5 text-primary" />
                    <Label htmlFor="show-jade-ai">JadeAI Assistant</Label>
                  </div>
                  <Switch
                    id="show-jade-ai"
                    checked={settings.showJadeAI}
                    onCheckedChange={(checked) => updateSettings({ showJadeAI: checked })}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <p className="text-white/50 text-xs">
                  Enable the JadeAI assistant to help you with questions and tasks.
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Code className="h-5 w-5 text-primary" />
                    <Label htmlFor="show-exploits">Exploits Section</Label>
                  </div>
                  <Switch
                    id="show-exploits"
                    checked={settings.showExploits}
                    onCheckedChange={(checked) => updateSettings({ showExploits: checked })}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <p className="text-white/50 text-xs">Enable the Exploits section to access game exploits and cheats.</p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Download className="h-5 w-5 text-primary" />
                    <Label htmlFor="show-downloads">Downloads Section</Label>
                  </div>
                  <Switch
                    id="show-downloads"
                    checked={settings.showDownloads}
                    onCheckedChange={(checked) => updateSettings({ showDownloads: checked })}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <p className="text-white/50 text-xs">Enable the Downloads section to access downloadable content.</p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <Label htmlFor="show-browser">Browser Tool</Label>
                  </div>
                  <Switch
                    id="show-browser"
                    checked={settings.showBrowser}
                    onCheckedChange={(checked) => updateSettings({ showBrowser: checked })}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <p className="text-white/50 text-xs">Enable the Browser tool to browse the web within s0lara.</p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <Label htmlFor="show-proxy">Proxy Tool</Label>
                  </div>
                  <Switch
                    id="show-proxy"
                    checked={settings.showProxy}
                    onCheckedChange={(checked) => updateSettings({ showProxy: checked })}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <p className="text-white/50 text-xs">Enable the Proxy tool to access blocked websites.</p>

                <div className="pt-4">
                  <GlowingButton
                    className="w-full"
                    onClick={() => {
                      resetSettings()
                      alert("All experimental features have been reset to their default values.")
                    }}
                  >
                    Reset to Defaults
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
