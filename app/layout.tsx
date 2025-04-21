import type React from "react"
import type { Metadata } from "next"
import ClientRootLayout from "./client"

export const metadata: Metadata = {
  title: "JadeVerse - The Ultimate Gaming Experience",
  description: "Dive into the ultimate gaming experience with JadeVerse. Play the latest games with stunning visuals.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientRootLayout>{children}</ClientRootLayout>
}


import './globals.css'