"use client"

import { Coffee, Heart, Github, ExternalLink, Rocket } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CreditsPage() {
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <Coffee className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            <span className="text-gradient">Credits</span>
          </h1>
        </div>

        <Card className="glass border-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white">JadeVerse</CardTitle>
            <CardDescription>The Ultimate Gaming Experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-8">
              <div className="p-6 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white relative group shadow-lg shadow-primary/20 w-32 h-32 flex items-center justify-center">
                <Rocket className="h-16 w-16" />
                <div className="absolute inset-0 rounded-lg bg-primary/20 blur-sm group-hover:bg-primary/30 group-hover:blur-md transition-all duration-300"></div>
              </div>
            </div>

            <p className="text-white/80 text-center">
              JadeVerse is a modern gaming platform designed to provide users with a seamless and immersive gaming
              experience.
            </p>

            <div className="flex items-center justify-center mt-4">
              <span className="text-white/60 text-sm">Made with</span>
              <Heart className="h-4 w-4 text-red-500 mx-1" />
              <span className="text-white/60 text-sm">using</span>
              <Link href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="ml-1">
                <Button variant="link" className="h-6 px-1 text-primary hover:text-primary/80">
                  Vercel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-white">Technologies Used</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <span>Next.js - React Framework</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <span>Tailwind CSS - Styling</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <span>Lucide Icons - Beautiful SVG icons</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <span>Vercel - Hosting and Deployment</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <span>TypeScript - Type Safety</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl text-white">Special Thanks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/80">
              Special thanks to all the contributors and users who have helped make JadeVerse better.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-primary/30 text-white hover:bg-primary/10">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </Link>
              <Link href="https://vercel.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-primary/30 text-white hover:bg-primary/10">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Vercel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
