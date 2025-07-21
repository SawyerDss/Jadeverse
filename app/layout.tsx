import type React from "react"
import type { Metadata } from "next"
import ClientRootLayout from "./client"

export const metadata: Metadata = {
  title: "s0lara - The Ultimate Gaming Experience",
  description: "Dive into the ultimate gaming experience with s0lara. Play the latest games with stunning visuals.",
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