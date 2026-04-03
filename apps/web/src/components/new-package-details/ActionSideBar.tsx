// src/components/ActionsSidebar.tsx
"use client"

import { useState } from "react"
import { Bookmark, Share2, Loader2 } from "lucide-react"

interface ActionsSidebarProps {
  onSave?: () => void
  onShare?: () => void
  onPublishToggle?: (isPublic: boolean) => void
  isSaving?: boolean
}

export function ActionsSidebar({
  onSave,
  onShare,
  onPublishToggle,
  isSaving = false,
}: ActionsSidebarProps) {
  const [isPublic, setIsPublic] = useState(false)

  const handleToggle = () => {
    const next = !isPublic
    setIsPublic(next)
    onPublishToggle?.(next)
  }

  return (
    <div className="space-y-3">
      {/* ── Save CTA ── */}
      <button
        onClick={onSave}
        disabled={isSaving}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm py-3 rounded-lg shadow-[0_4px_14px_rgba(249,115,22,0.35)] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Bookmark size={14} />
            Save Trip
          </>
        )}
      </button>

      {/* ── Publish toggle ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-start gap-3">
          <button
            role="switch"
            aria-checked={isPublic}
            onClick={handleToggle}
            className={`mt-0.5 relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${
              isPublic ? "bg-orange-500" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                isPublic ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>

          <div>
            <p className="text-xs font-bold text-gray-900">
              Publish as Public Package
            </p>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Contribute to the community. Your trip will be visible to others.
            </p>
          </div>
        </div>
      </div>

      {/* ── Share ── */}
      <button
        onClick={onShare}
        className="w-full flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-semibold text-sm py-3 rounded-lg transition-colors duration-200"
      >
        <Share2 size={14} /> Share
      </button>
    </div>
  )
}
