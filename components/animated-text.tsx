"use client"

import { cn } from "@/lib/utils"

interface AnimatedTextProps {
  text: string
  className?: string
}

export default function AnimatedText({ text, className }: AnimatedTextProps) {
  // No animations, just render the text with styling
  return (
    <div className={cn("relative inline-block", className)}>
      <span className="font-bold">{text}</span>
    </div>
  )
}
