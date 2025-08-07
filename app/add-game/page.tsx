'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGames } from '@/lib/games-context'
import { useAuth } from '@/lib/auth-context'
import { useNotification } from '@/lib/notification-context'
import GlowingButton from '@/components/glowing-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, LinkIcon, ImageIcon } from 'lucide-react'

export default function AddGamePage() {
  const { user } = useAuth()
  const { addGame } = useGames()
  const router = useRouter()
  const { addNotification } = useNotification()

  const [formData, setFormData] = useState({
    title: '',
    gameUrl: '',
    imageUrl: '',
  })
  const [error, setError] = useState('')

  // Redirect if not logged in, using useEffect to prevent state update errors
  useEffect(() => {
    if (!user) {
      router.push('/auth') // Changed to /auth as per previous instructions
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate form
    if (!formData.title) {
      setError('Please enter a game title')
      return
    }

    if (!formData.gameUrl) {
      setError('Please enter a game URL')
      return
    }

    try {
      // Simple URL validation
      new URL(formData.gameUrl)

      // Validate image URL if provided
      if (formData.imageUrl) {
        try {
          new URL(formData.imageUrl)
        } catch (err) {
          setError('Please enter a valid image URL')
          return
        }
      }

      // Generate a title from the URL if not provided
      const urlObj = new URL(formData.gameUrl)
      const domain = urlObj.hostname.replace('www.', '')

      // Add game
      const gameId = 'game_' + Math.random().toString(36).substr(2, 9)

      addGame({
        title: formData.title || `${domain} Game`,
        description: `External game from ${domain}`,
        category: 'External',
        image: formData.imageUrl || `/placeholder.svg?height=300&width=500&text=${domain}`,
        icon: '🎮',
        createdBy: user?.username || 'Anonymous', // Use optional chaining and fallback
        url: formData.gameUrl,
      })

      // Show success notification
      addNotification({
        title: 'Game Added',
        message: `${formData.title} has been added to your library`,
        type: 'success',
      })

      // Redirect to the game page
      router.push(`/games`)
    } catch (err) {
      setError('Please enter a valid URL')
    }
  }

  // Render null or a loading spinner while redirecting or if user is not logged in yet
  if (!user) {
    return null // Or a loading spinner
  }

  return (
    <div className="py-16 max-w-2xl mx-auto">
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white">
            <span className="text-gradient">Add External Game</span>
          </CardTitle>
          <CardDescription>Add any game by URL to your s0lara library</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3 mb-4 flex items-center text-white">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Game Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="bg-black/50 border-primary/30 focus:border-primary"
                placeholder="Enter game title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gameUrl">Game URL *</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-primary" />
                </div>
                <Input
                  id="gameUrl"
                  name="gameUrl"
                  value={formData.gameUrl}
                  onChange={handleChange}
                  className="bg-black/50 border-primary/30 focus:border-primary pl-10"
                  placeholder="https://example.com/game"
                />
              </div>
              <p className="text-white/50 text-xs mt-1">
                Enter the full URL to the game you want to add. The game will open in an embedded frame.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Custom Image URL (Optional)</Label>
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
                Optionally provide a custom image URL for the game thumbnail. If not provided, a default image will be
                used.
              </p>
            </div>

            <div className="pt-4">
              <GlowingButton className="w-full">Add Game</GlowingButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
