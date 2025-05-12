"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/lib/theme-context"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Palette, Droplets, Box, Sliders, Save, Undo, Download, Upload } from "lucide-react"

type CustomColors = {
  primary: string
  secondary: string
  text: string
  background: string
  accent: string
  muted: string
  border: string
}

type CustomEffects = {
  bloomIntensity: number
  animationSpeed: number
  borderRadius: number
  glassOpacity: number
  enableGlow: boolean
  enableAnimations: boolean
  enableBlur: boolean
  enableGradients: boolean
}

interface ThemeCustomizerProps {
  currentTheme: string
  onThemeChange: (theme: string, customColors?: CustomColors, customEffects?: CustomEffects) => void
}

export function ThemeCustomizer({ currentTheme, onThemeChange }: ThemeCustomizerProps) {
  const { customColors: contextCustomColors } = useTheme()
  const [selectedTab, setSelectedTab] = useState("preset")
  const [selectedCustomTab, setSelectedCustomTab] = useState("colors")

  const defaultColors: CustomColors = {
    primary: contextCustomColors?.primary || "#10b981",
    secondary: contextCustomColors?.secondary || "#059669",
    text: contextCustomColors?.text || "#ffffff",
    background: contextCustomColors?.background || "#000000",
    accent: "#3b82f6",
    muted: "#1f2937",
    border: "#374151",
  }

  const defaultEffects: CustomEffects = {
    bloomIntensity: 0.5,
    animationSpeed: 1.0,
    borderRadius: 0.5,
    glassOpacity: 0.3,
    enableGlow: true,
    enableAnimations: true,
    enableBlur: true,
    enableGradients: true,
  }

  const [colors, setColors] = useState<CustomColors>(defaultColors)
  const [effects, setEffects] = useState<CustomEffects>(defaultEffects)
  const [savedThemes, setSavedThemes] = useState<{ name: string; colors: CustomColors; effects: CustomEffects }[]>([])

  // Load saved themes from localStorage
  useEffect(() => {
    const storedThemes = localStorage.getItem("saved-custom-themes")
    if (storedThemes) {
      try {
        setSavedThemes(JSON.parse(storedThemes))
      } catch (e) {
        console.error("Failed to parse saved themes:", e)
      }
    }
  }, [])

  // Update colors when contextCustomColors changes
  useEffect(() => {
    if (contextCustomColors) {
      setColors({
        ...colors,
        primary: contextCustomColors.primary,
        secondary: contextCustomColors.secondary,
        text: contextCustomColors.text,
        background: contextCustomColors.background,
      })
    }
  }, [contextCustomColors])

  const handleColorChange = (key: keyof CustomColors, value: string) => {
    const newColors = { ...colors, [key]: value }
    setColors(newColors)

    if (currentTheme === "custom") {
      onThemeChange("custom", newColors, effects)
    }
  }

  const handleEffectChange = (key: keyof CustomEffects, value: any) => {
    const newEffects = { ...effects, [key]: value }
    setEffects(newEffects)

    if (currentTheme === "custom") {
      onThemeChange("custom", colors, newEffects)
    }
  }

  const handleThemeChange = (theme: string) => {
    if (theme === "custom") {
      onThemeChange(theme, colors, effects)
    } else {
      onThemeChange(theme)
    }
  }

  const saveCurrentTheme = () => {
    const themeName = prompt("Enter a name for this theme:")
    if (themeName) {
      const newTheme = {
        name: themeName,
        colors: { ...colors },
        effects: { ...effects },
      }

      const newSavedThemes = [...savedThemes, newTheme]
      setSavedThemes(newSavedThemes)
      localStorage.setItem("saved-custom-themes", JSON.stringify(newSavedThemes))
    }
  }

  const loadSavedTheme = (index: number) => {
    const theme = savedThemes[index]
    setColors(theme.colors)
    setEffects(theme.effects)
    onThemeChange("custom", theme.colors, theme.effects)
  }

  const deleteSavedTheme = (index: number) => {
    if (confirm("Are you sure you want to delete this theme?")) {
      const newSavedThemes = [...savedThemes]
      newSavedThemes.splice(index, 1)
      setSavedThemes(newSavedThemes)
      localStorage.setItem("saved-custom-themes", JSON.stringify(newSavedThemes))
    }
  }

  const exportThemes = () => {
    const dataStr = JSON.stringify(savedThemes)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "jadeverse-themes.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const importThemes = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"

    input.onchange = (e: any) => {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          const importedThemes = JSON.parse(event.target?.result as string)
          if (Array.isArray(importedThemes)) {
            const newSavedThemes = [...savedThemes, ...importedThemes]
            setSavedThemes(newSavedThemes)
            localStorage.setItem("saved-custom-themes", JSON.stringify(newSavedThemes))
            alert(`Successfully imported ${importedThemes.length} themes!`)
          }
        } catch (e) {
          console.error("Failed to parse imported themes:", e)
          alert("Failed to import themes. Invalid file format.")
        }
      }

      reader.readAsText(file)
    }

    input.click()
  }

  const resetToDefaults = () => {
    if (confirm("Reset to default colors and effects?")) {
      setColors(defaultColors)
      setEffects(defaultEffects)
      if (currentTheme === "custom") {
        onThemeChange("custom", defaultColors, defaultEffects)
      }
    }
  }

  return (
    <Card className="glass border-primary/20">
      <CardContent className="pt-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="preset">Preset Themes</TabsTrigger>
            <TabsTrigger value="custom">Custom Theme</TabsTrigger>
            <TabsTrigger value="saved">Saved Themes</TabsTrigger>
          </TabsList>

          <TabsContent value="preset" className="space-y-4 pt-4">
            <RadioGroup
              value={currentTheme}
              onValueChange={handleThemeChange}
              className="grid grid-cols-3 sm:grid-cols-4 gap-2"
            >
              <div>
                <RadioGroupItem value="jade" id="jade" className="sr-only peer" />
                <Label
                  htmlFor="jade"
                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="w-8 h-8 rounded-full bg-[#10b981] mb-2"></span>
                  <span>Jade</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="blue" id="blue" className="sr-only peer" />
                <Label
                  htmlFor="blue"
                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="w-8 h-8 rounded-full bg-[#3b82f6] mb-2"></span>
                  <span>Blue</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="purple" id="purple" className="sr-only peer" />
                <Label
                  htmlFor="purple"
                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="w-8 h-8 rounded-full bg-[#8b5cf6] mb-2"></span>
                  <span>Purple</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="red" id="red" className="sr-only peer" />
                <Label
                  htmlFor="red"
                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="w-8 h-8 rounded-full bg-[#ef4444] mb-2"></span>
                  <span>Red</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="orange" id="orange" className="sr-only peer" />
                <Label
                  htmlFor="orange"
                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="w-8 h-8 rounded-full bg-[#f97316] mb-2"></span>
                  <span>Orange</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="rainbow" id="rainbow" className="sr-only peer" />
                <Label
                  htmlFor="rainbow"
                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 mb-2"></span>
                  <span>Rainbow</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="neon" id="neon" className="sr-only peer" />
                <Label
                  htmlFor="neon"
                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="w-8 h-8 rounded-full bg-[#00ff00] shadow-[0_0_10px_#00ff00] mb-2"></span>
                  <span>Neon</span>
                </Label>
              </div>
            </RadioGroup>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 pt-4">
            <Tabs value={selectedCustomTab} onValueChange={setSelectedCustomTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="colors" className="flex items-center gap-1">
                  <Palette className="h-4 w-4" />
                  <span>Colors</span>
                </TabsTrigger>
                <TabsTrigger value="effects" className="flex items-center gap-1">
                  <Droplets className="h-4 w-4" />
                  <span>Effects</span>
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center gap-1">
                  <Sliders className="h-4 w-4" />
                  <span>Advanced</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Primary Color</Label>
                    <div
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: colors.primary }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colors.primary}
                      onChange={(e) => handleColorChange("primary", e.target.value)}
                      className="w-10 h-10"
                    />
                    <input
                      type="text"
                      value={colors.primary}
                      onChange={(e) => handleColorChange("primary", e.target.value)}
                      className="flex-1 bg-black/50 border border-primary/30 rounded-md px-3 py-1 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Secondary Color</Label>
                    <div
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: colors.secondary }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colors.secondary}
                      onChange={(e) => handleColorChange("secondary", e.target.value)}
                      className="w-10 h-10"
                    />
                    <input
                      type="text"
                      value={colors.secondary}
                      onChange={(e) => handleColorChange("secondary", e.target.value)}
                      className="flex-1 bg-black/50 border border-primary/30 rounded-md px-3 py-1 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Accent Color</Label>
                    <div
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: colors.accent }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colors.accent}
                      onChange={(e) => handleColorChange("accent", e.target.value)}
                      className="w-10 h-10"
                    />
                    <input
                      type="text"
                      value={colors.accent}
                      onChange={(e) => handleColorChange("accent", e.target.value)}
                      className="flex-1 bg-black/50 border border-primary/30 rounded-md px-3 py-1 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Text Color</Label>
                    <div
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: colors.text }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colors.text}
                      onChange={(e) => handleColorChange("text", e.target.value)}
                      className="w-10 h-10"
                    />
                    <input
                      type="text"
                      value={colors.text}
                      onChange={(e) => handleColorChange("text", e.target.value)}
                      className="flex-1 bg-black/50 border border-primary/30 rounded-md px-3 py-1 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Background Color</Label>
                    <div
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: colors.background }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colors.background}
                      onChange={(e) => handleColorChange("background", e.target.value)}
                      className="w-10 h-10"
                    />
                    <input
                      type="text"
                      value={colors.background}
                      onChange={(e) => handleColorChange("background", e.target.value)}
                      className="flex-1 bg-black/50 border border-primary/30 rounded-md px-3 py-1 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Muted Color</Label>
                    <div
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: colors.muted }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colors.muted}
                      onChange={(e) => handleColorChange("muted", e.target.value)}
                      className="w-10 h-10"
                    />
                    <input
                      type="text"
                      value={colors.muted}
                      onChange={(e) => handleColorChange("muted", e.target.value)}
                      className="flex-1 bg-black/50 border border-primary/30 rounded-md px-3 py-1 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Border Color</Label>
                    <div
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: colors.border }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colors.border}
                      onChange={(e) => handleColorChange("border", e.target.value)}
                      className="w-10 h-10"
                    />
                    <input
                      type="text"
                      value={colors.border}
                      onChange={(e) => handleColorChange("border", e.target.value)}
                      className="flex-1 bg-black/50 border border-primary/30 rounded-md px-3 py-1 text-sm"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="effects" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Bloom Intensity</Label>
                    <span className="text-xs text-white/70">{Math.round(effects.bloomIntensity * 100)}%</span>
                  </div>
                  <Slider
                    value={[effects.bloomIntensity * 100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleEffectChange("bloomIntensity", value[0] / 100)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Animation Speed</Label>
                    <span className="text-xs text-white/70">{effects.animationSpeed.toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={[effects.animationSpeed * 50]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleEffectChange("animationSpeed", value[0] / 50)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Border Radius</Label>
                    <span className="text-xs text-white/70">{Math.round(effects.borderRadius * 20)}px</span>
                  </div>
                  <Slider
                    value={[effects.borderRadius * 100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleEffectChange("borderRadius", value[0] / 100)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Glass Opacity</Label>
                    <span className="text-xs text-white/70">{Math.round(effects.glassOpacity * 100)}%</span>
                  </div>
                  <Slider
                    value={[effects.glassOpacity * 100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleEffectChange("glassOpacity", value[0] / 100)}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enable-glow"
                      checked={effects.enableGlow}
                      onCheckedChange={(checked) => handleEffectChange("enableGlow", checked)}
                    />
                    <Label htmlFor="enable-glow">Enable Glow</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enable-animations"
                      checked={effects.enableAnimations}
                      onCheckedChange={(checked) => handleEffectChange("enableAnimations", checked)}
                    />
                    <Label htmlFor="enable-animations">Enable Animations</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enable-blur"
                      checked={effects.enableBlur}
                      onCheckedChange={(checked) => handleEffectChange("enableBlur", checked)}
                    />
                    <Label htmlFor="enable-blur">Enable Blur</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enable-gradients"
                      checked={effects.enableGradients}
                      onCheckedChange={(checked) => handleEffectChange("enableGradients", checked)}
                    />
                    <Label htmlFor="enable-gradients">Enable Gradients</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className="flex items-center justify-center gap-2 py-2 px-4 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-md transition-colors"
                    onClick={saveCurrentTheme}
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Theme</span>
                  </button>

                  <button
                    className="flex items-center justify-center gap-2 py-2 px-4 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-md transition-colors"
                    onClick={resetToDefaults}
                  >
                    <Undo className="h-4 w-4" />
                    <span>Reset to Default</span>
                  </button>

                  <button
                    className="flex items-center justify-center gap-2 py-2 px-4 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-md transition-colors"
                    onClick={exportThemes}
                  >
                    <Download className="h-4 w-4" />
                    <span>Export Themes</span>
                  </button>

                  <button
                    className="flex items-center justify-center gap-2 py-2 px-4 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-md transition-colors"
                    onClick={importThemes}
                  >
                    <Upload className="h-4 w-4" />
                    <span>Import Themes</span>
                  </button>
                </div>

                <div className="mt-4 p-3 bg-black/30 rounded-md border border-primary/20">
                  <h3 className="text-sm font-medium mb-2">Theme Preview</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="w-8 h-8 rounded-md" style={{ backgroundColor: colors.primary }}></div>
                    <div className="w-8 h-8 rounded-md" style={{ backgroundColor: colors.secondary }}></div>
                    <div className="w-8 h-8 rounded-md" style={{ backgroundColor: colors.accent }}></div>
                    <div className="w-8 h-8 rounded-md" style={{ backgroundColor: colors.muted }}></div>
                    <div
                      className="w-8 h-8 rounded-md border"
                      style={{ backgroundColor: colors.background, borderColor: colors.border }}
                    ></div>
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: colors.background }}
                    >
                      <span style={{ color: colors.text }}>T</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <button
              className="w-full py-2 px-4 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-md transition-colors mt-4"
              onClick={() => handleThemeChange("custom")}
            >
              Apply Custom Theme
            </button>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4 pt-4">
            {savedThemes.length > 0 ? (
              <div className="grid gap-3">
                {savedThemes.map((theme, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-black/30 rounded-md border border-primary/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.secondary }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.accent }}></div>
                      </div>
                      <span className="font-medium">{theme.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadSavedTheme(index)}
                        className="p-1 text-primary hover:text-white transition-colors"
                        title="Load Theme"
                      >
                        <Box className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteSavedTheme(index)}
                        className="p-1 text-red-500 hover:text-red-400 transition-colors"
                        title="Delete Theme"
                      >
                        <Undo className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/50">
                <p>No saved themes yet.</p>
                <p className="text-sm mt-2">Create and save custom themes to see them here.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
