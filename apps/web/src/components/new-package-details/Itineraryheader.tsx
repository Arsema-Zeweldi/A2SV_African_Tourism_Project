// src/components/ItineraryHeader.tsx
"use client"

import { useRef, useState } from "react"
import { CalendarDays, Plus } from "lucide-react"
import { ItineraryData } from "../../types/new-package"

interface ItineraryHeaderProps {
  data: Pick<
    ItineraryData,
    "title" | "tags" | "daysCount" | "nightsCount" | "budget"
  >
  onAddTag?: (tag: string) => void
}

export function ItineraryHeader({ data, onAddTag }: ItineraryHeaderProps) {
  const { title, tags, daysCount, nightsCount, budget } = data
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const openTagInput = () => {
    setIsAddingTag(true)
    // Wait for the input to mount, then focus
    setTimeout(() => inputRef.current?.focus(), 30)
  }

  const commitTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed) onAddTag?.(trimmed)
    setTagInput("")
    setIsAddingTag(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      commitTag()
    }
    if (e.key === "Escape") {
      setTagInput("")
      setIsAddingTag(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] p-5">
      {/* Eyebrow label */}
      <p className="text-[10px] font-semibold tracking-widest text-orange-400 uppercase mb-1">
        Generated Itinerary
      </p>

      {/* Title + price range */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
          {title}
        </h1>
        <div className="text-right shrink-0">
          <p className="text-lg font-black text-orange-500">
            ${budget.totalMin} – ${budget.totalMax}
          </p>
          <p className="text-[10px] text-gray-400">Est. Total Cost</p>
        </div>
      </div>

      {/* Meta pills + tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1 text-[11px] text-gray-600 font-medium">
          <CalendarDays size={11} />
          {daysCount} Days / {nightsCount} Nights
        </span>

        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-orange-50 text-orange-500 text-[10px] font-semibold px-2 py-1 rounded-full border border-orange-100"
          >
            {tag}
          </span>
        ))}

        {isAddingTag ? (
          <input
            ref={inputRef}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commitTag}
            placeholder="Tag name..."
            className="text-[11px] border border-orange-200 rounded-full px-2.5 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-orange-300 bg-orange-50 text-orange-600 placeholder:text-orange-300"
          />
        ) : (
          <button
            onClick={openTagInput}
            aria-label="Add tag"
            className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-400 transition-colors"
          >
            <Plus size={10} />
          </button>
        )}
      </div>
    </div>
  )
}
