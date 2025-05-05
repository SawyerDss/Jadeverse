"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/lib/theme-context"

type CustomColors = {
  primary: string
  secondary: string
  text: string
  background: string
}

interface ThemeCustomizerProps {
  currentTheme: string
  onThemeChange: (theme: string, customColors?: CustomColors) => void
}

export function ThemeCustomizer({ currentTheme, onThemeChange }: ThemeCustomizerProps) {
  const { customColors } = useTheme()
  const [selectedTab, setSelectedTab] = useState("preset")
  const [colors, setColors] = useState<CustomColors>({
    primary: customColors?.primary || "#10b981",
    secondary: customColors?.secondary || "#059669",
    text: customColors?.text || "#ffffff",
    background: customColors?.background || "#000000",
  })

  // Update colors when customColors changes
  useEffect(() => {
    if (customColors) {
      setColors(customColors)
    }
  }, [customColors])

  const handleColorChange = (key: keyof CustomColors, value: string) => {
    const newColors = { ...colors, [key]: value }
    setColors(newColors)

    if (currentTheme === "custom") {
      onThemeChange("custom", newColors)
    }
  }

  const handleThemeChange = (theme: string) => {
    if (theme === "custom") {
      onThemeChange(theme, colors)
    } else {
      onThemeChange(theme)
    }
  }

  return (
    <Card className="glass border-primary/20">
      <CardContent className="pt-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="preset">Preset Themes</TabsTrigger>
            <TabsTrigger value="custom">Custom Theme</TabsTrigger>
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
            <div className="space-y-4">
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

              <button
                className="w-full py-2 px-4 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-md transition-colors"
                onClick={() => handleThemeChange("custom")}
              >
                Apply Custom Theme
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
