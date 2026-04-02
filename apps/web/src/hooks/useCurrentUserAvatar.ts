'use client'

import { useEffect, useState } from 'react'
import { fetchProfile } from '@/actions/profile_actions'
import { useAuth } from '@/context/auth-context'

const FALLBACK_AVATAR = '/images/user-icon.png'

let cachedAvatar = FALLBACK_AVATAR
let avatarRequest: Promise<string> | null = null

async function loadCurrentUserAvatar() {
  if (!avatarRequest) {
    avatarRequest = fetchProfile()
      .then((result) => {
        cachedAvatar =
          result.success && result.data.avatar_url
            ? result.data.avatar_url
            : FALLBACK_AVATAR

        return cachedAvatar
      })
      .catch(() => {
        cachedAvatar = FALLBACK_AVATAR
        return FALLBACK_AVATAR
      })
  }

  return avatarRequest
}

export function useCurrentUserAvatar() {
  const { isAuthenticated } = useAuth()
  const [avatar, setAvatar] = useState(cachedAvatar)

  useEffect(() => {
    let cancelled = false

    if (!isAuthenticated) {
      setAvatar(FALLBACK_AVATAR)
      return
    }

    loadCurrentUserAvatar().then((value) => {
      if (!cancelled) {
        setAvatar(value)
      }
    })

    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  const handleAvatarError = () => {
    cachedAvatar = FALLBACK_AVATAR
    setAvatar(FALLBACK_AVATAR)
  }

  return {
    avatar,
    fallbackAvatar: FALLBACK_AVATAR,
    handleAvatarError,
  }
}
