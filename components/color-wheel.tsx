"use client"

import { useEffect, useRef, useState } from "react"
import { HexColorPicker } from "react-colorful"

export interface ColorWheelProps {
  color: string
  onChange: (color: string) => void
  className?: string
}

export function ColorWheel({ color, onChange, className }: ColorWheelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const popover = useRef<HTMLDivElement>(null)

  // Close the popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popover.current && !popover.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className || ""}`}>
      <div
        className="w-10 h-10 rounded-full cursor-pointer border border-white/40"
        style={{ backgroundColor: color }}
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div
          ref={popover}
          className="absolute z-20 top-full left-0 mt-2 shadow-lg bg-black/90 border border-primary/40 rounded-lg p-3"
        >
          <HexColorPicker color={color} onChange={onChange} />
          <div className="mt-2 text-center text-xs text-white/70">
            <div className="font-mono">{color}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorWheel
