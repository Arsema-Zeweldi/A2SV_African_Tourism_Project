"use client"

import { useRef, useState } from "react"
import { CalendarDays, Plus, Info } from "lucide-react"
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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      {/* Eyebrow label */}
      <p className="text-[10px] font-bold tracking-[0.15em] text-primary uppercase mb-2">
        Generated Itinerary
      </p>

      {/* Title + price range */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
          {title}
        </h1>
        <div className="text-right shrink-0">
          <p className="text-lg font-black text-primary whitespace-nowrap">
            ${budget.totalMin} - ${budget.totalMax}
          </p>
          <p className="text-[10px] text-gray-400">Est. Total Cost</p>
        </div>
      </div>

      {/* Meta pills + tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1 text-[11px] text-gray-600 font-medium">
          <CalendarDays size={12} />
          {daysCount} Days / {nightsCount} Nights
        </span>

        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-orange-50 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full border border-orange-100 uppercase tracking-wide"
          >
            #{tag.replace(/^#/, '')}
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
            className="w-6 h-6 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:bg-orange-50 hover:border-orange-300 hover:text-primary transition-colors"
          >
            <Plus size={10} />
          </button>
        )}

        <button
          aria-label="Info"
          className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors ml-auto"
        >
          <Info size={11} />
        </button>
      </div>
    </div>
  )
}
