"use client"

import Link from "next/link"
import { Sparkles, Gamepad2, AppWindow, BookOpen, MessageSquare, DiscIcon as Discord } from "lucide-react"
import { GlowingButton } from "@/components/glowing-button"
import AnimatedText from "@/components/animated-text"
import { useAuth } from "@/lib/auth-context"

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            <AnimatedText>Welcome to JadeVerse</AnimatedText>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mb-8">
            Your gateway to a world of games, apps, and learning resources. Explore, play, and connect in our neon-lit
            digital universe.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/games">
              <GlowingButton icon={<Gamepad2 className="h-5 w-5" />}>Explore Games</GlowingButton>
            </Link>
            <Link href="/apps">
              <GlowingButton icon={<AppWindow className="h-5 w-5" />}>Discover Apps</GlowingButton>
            </Link>
            <Link href="https://discord.gg/jadeverse" target="_blank" rel="noopener noreferrer">
              <GlowingButton icon={<Discord className="h-5 w-5" />}>Join Discord</GlowingButton>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="glass rounded-xl p-6 border border-primary/20 hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Gamepad2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Endless Games</h3>
            <p className="text-white/70">
              Access a growing library of games, from classics to modern favorites, all in one place.
            </p>
          </div>

          <div className="glass rounded-xl p-6 border border-primary/20 hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <AppWindow className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Useful Apps</h3>
            <p className="text-white/70">
              Discover productivity tools, utilities, and creative apps to enhance your digital experience.
            </p>
          </div>

          <div className="glass rounded-xl p-6 border border-primary/20 hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Learning Resources</h3>
            <p className="text-white/70">
              Access educational content and get homework help with our AI-powered assistant.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass rounded-xl p-8 border border-primary/20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join the Adventure?</h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-6">
            Create an account to save your favorite games, track your progress, and connect with other players.
          </p>
          {!user ? (
            <Link href="/login">
              <GlowingButton icon={<Sparkles className="h-5 w-5" />}>Get Started</GlowingButton>
            </Link>
          ) : (
            <Link href="/games">
              <GlowingButton icon={<MessageSquare className="h-5 w-5" />}>Continue Your Journey</GlowingButton>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
