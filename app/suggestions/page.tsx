"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// Update imports to include Discord icon
import { Lightbulb, Send, Check, MessageSquare } from "lucide-react"
import GlowingButton from "@/components/glowing-button"
import { useAuth } from "@/lib/auth-context"
import { useNotification } from "@/lib/notification-context"
import AnimatedText from "@/components/animated-text"

type SuggestionType = "feature" | "content" | "bug" | "other"

export default function SuggestionsPage() {
  const { user } = useAuth()
  const { addNotification } = useNotification()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    type: "feature" as SuggestionType,
    title: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would send this to your backend
    console.log("Suggestion submitted:", formData)

    // Show success notification
    addNotification({
      title: "Suggestion Submitted",
      message: "Thank you for your feedback! We'll review your suggestion.",
      type: "success",
    })

    // Show success message
    setSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        type: "feature",
        title: "",
        description: "",
      })
      setSubmitted(false)
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value as SuggestionType }))
  }

  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <Lightbulb className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            <AnimatedText text="Suggestions" className="text-gradient" />
          </h1>
        </div>

        <Card className="glass border-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-white text-bloom">Share Your Ideas</CardTitle>
            <CardDescription>We value your feedback! Let us know how we can improve JadeVerse.</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-bloom">Thank You!</h3>
                <p className="text-white/70">Your suggestion has been submitted successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-bloom">
                    Suggestion Type
                  </Label>
                  <RadioGroup value={formData.type} onValueChange={handleTypeChange} className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="feature" id="feature" />
                      <Label htmlFor="feature">Feature Request</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="content" id="content" />
                      <Label htmlFor="content">Content Suggestion</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bug" id="bug" />
                      <Label htmlFor="bug">Bug Report</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-bloom">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="bg-black/50 border-primary/30 focus:border-primary"
                    placeholder="Brief title for your suggestion"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-bloom">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="bg-black/50 border-primary/30 focus:border-primary min-h-[150px]"
                    placeholder="Please provide details about your suggestion..."
                    required
                  />
                </div>

                <GlowingButton className="w-full" type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Suggestion
                </GlowingButton>

                <div className="mt-4 text-center">
                  <span className="text-white/70">or</span>
                </div>

                <GlowingButton
                  className="w-full mt-4"
                  variant="outline"
                  onClick={() => window.open("https://discord.gg/RDfcq2YMhg", "_blank")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Join Our Discord
                </GlowingButton>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg text-white text-bloom">Popular Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="border-b border-primary/10 pb-3">
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/20 p-1 rounded-full">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Multiplayer Games</h4>
                      <p className="text-white/70 text-sm">Add more multiplayer games to play with friends</p>
                    </div>
                  </div>
                </li>
                <li className="border-b border-primary/10 pb-3">
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/20 p-1 rounded-full">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Dark Mode Toggle</h4>
                      <p className="text-white/70 text-sm">Option to switch between light and dark themes</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/20 p-1 rounded-full">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Mobile App</h4>
                      <p className="text-white/70 text-sm">Create a mobile app version of JadeVerse</p>
                    </div>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg text-white text-bloom">Recently Implemented</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="border-b border-primary/10 pb-3">
                  <div className="flex items-start gap-2">
                    <div className="bg-green-500/20 p-1 rounded-full">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Web Proxy</h4>
                      <p className="text-white/70 text-sm">Added a web proxy for secure browsing</p>
                    </div>
                  </div>
                </li>
                <li className="border-b border-primary/10 pb-3">
                  <div className="flex items-start gap-2">
                    <div className="bg-green-500/20 p-1 rounded-full">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Profile Customization</h4>
                      <p className="text-white/70 text-sm">Added ability to customize user profiles</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-start gap-2">
                    <div className="bg-green-500/20 p-1 rounded-full">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">JadeAI Assistant</h4>
                      <p className="text-white/70 text-sm">Added AI assistant for homework help</p>
                    </div>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
