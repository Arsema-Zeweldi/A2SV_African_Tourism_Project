'use client'

import { useEffect, useState, useRef } from 'react'
import { fetchProfile } from '@/actions/profile_actions'
import { useAuth } from '@/context/auth-context'

const FALLBACK_AVATAR = '/images/user-icon.png'

export function useCurrentUserAvatar() {
  const { isAuthenticated } = useAuth()
  const [avatar, setAvatar] = useState(FALLBACK_AVATAR)
  const requestRef = useRef<Promise<string> | null>(null)

  useEffect(() => {
    let cancelled = false

    if (!isAuthenticated) {
      setAvatar(FALLBACK_AVATAR)
      requestRef.current = null
      return
    }

    // Deduplicate concurrent requests within this hook instance
    if (!requestRef.current) {
      requestRef.current = fetchProfile()
        .then((result) =>
          result.success && result.data.avatar_url
            ? result.data.avatar_url
            : FALLBACK_AVATAR
        )
        .catch(() => FALLBACK_AVATAR)
    }

    requestRef.current.then((value) => {
      if (!cancelled) setAvatar(value)
    })

    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  const handleAvatarError = () => {
    setAvatar(FALLBACK_AVATAR)
  }

  return {
    avatar,
    fallbackAvatar: FALLBACK_AVATAR,
    handleAvatarError,
  }
}
