'use client'

import { Share2, Heart } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function ShareButton({ name }: { name: string }) {
  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url })
      } else {
        await navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard!')
      }
    } catch {
      // user cancelled share dialog
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700"
    >
      <Share2 size={14} /> Share
    </button>
  )
}

export function SaveButton() {
  const [saved, setSaved] = useState(false)

  return (
    <button
      onClick={() => {
        setSaved(!saved)
        toast.success(saved ? 'Removed from saved' : 'Saved!')
      }}
      className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-colors text-xs font-semibold ${
        saved
          ? 'border-primary bg-orange-50 text-primary'
          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
      }`}
    >
      <Heart size={14} className={saved ? 'fill-current' : ''} /> {saved ? 'Saved' : 'Save'}
    </button>
  )
}
