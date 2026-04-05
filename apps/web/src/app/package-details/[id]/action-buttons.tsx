'use client'

import { Share2, Heart, Navigation, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { clonePackageItinerary } from '@/actions/itinerary_actions'

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
      <Heart size={14} className={saved ? 'fill-current' : ''} />{' '}
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}

export function FollowPathButton({ packageId }: { packageId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleFollow = async () => {
    setLoading(true)
    try {
      const result = await clonePackageItinerary(packageId)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Itinerary added to your trips!')
      router.push(`/new-package/${result.data.itinerary_id}`)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-orange-600 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-colors"
    >
      {loading ? (
        <Loader2 size={13} className="animate-spin" />
      ) : (
        <Navigation size={13} />
      )}
      {loading ? 'Copying...' : 'Follow this Path'}
    </button>
  )
}
