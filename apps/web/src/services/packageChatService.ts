'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import type { PackageChatHistoryResponse, PackageChatResponse } from '@/types/api'
import type { CommunityChats } from '@/types/package-details'
import { fetchProfile } from '@/actions/profile_actions'
import {
  fetchPackageChatHistoryAction,
  sendPackageChatMessageAction,
} from '@/actions/package_chat_actions'

const FALLBACK_AVATAR = '/images/user-icon.png'

function formatTime(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date))
}

function toDisplayName(userId: string) {
  return `Traveler ${userId.slice(0, 8)}`
}

export function mapPackageChatMessage(
  message: PackageChatResponse,
  currentUserId?: string,
  currentUser?: {
    name?: string
    avatar?: string
  }
): CommunityChats {
  const isCurrentUser = currentUserId && message.user_id === currentUserId

  return {
    id: message.chat_id,
    userId: message.user_id,
    name:
      (isCurrentUser && currentUser?.name) ||
      message.user_name ||
      toDisplayName(message.user_id),
    avatar:
      (isCurrentUser && currentUser?.avatar) ||
      message.user_avatar ||
      FALLBACK_AVATAR,
    text: message.message,
    timeStamp: formatTime(message.created_at),
  }
}

export async function fetchPackageChatHistory(
  packageId: string
): Promise<PackageChatHistoryResponse> {
  return fetchPackageChatHistoryAction(packageId)
}

export async function sendPackageChatMessage(
  packageId: string,
  message: string
): Promise<PackageChatResponse> {
  return sendPackageChatMessageAction(packageId, message)
}

interface UsePackageChatOptions {
  packageId: string
  initialMessages: CommunityChats[]
}

export function usePackageChat({
  packageId,
  initialMessages,
}: UsePackageChatOptions) {
  const [messages, setMessages] = useState<CommunityChats[]>(initialMessages)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(() =>
    initialMessages.find((chat) => chat.userId)?.userId
  )
  const [currentUser, setCurrentUser] = useState<{
    name?: string
    avatar?: string
  }>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const result = await fetchProfile()

        if (!result.success) {
          return
        }

        const name =
          [result.data.first_name, result.data.last_name]
            .filter(Boolean)
            .join(' ') || 'You'

        setCurrentUserId(result.data.user_id)
        setCurrentUser({
          name,
          avatar: result.data.avatar_url || FALLBACK_AVATAR,
        })
      } catch (error) {
        console.error(error)
      }
    }

    loadCurrentUser()
  }, [])

  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true)
      try {
        const response = await fetchPackageChatHistory(packageId)
        setMessages(
          response.data
            .slice()
            .reverse()
            .map((chat) => mapPackageChatMessage(chat, currentUserId, currentUser))
        )
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [packageId, currentUserId, currentUser])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    container.scrollTop = container.scrollHeight
  }, [messages])

  const onlineCount = useMemo(
    () =>
      Math.max(1, new Set(messages.map((chat) => chat.userId ?? chat.name)).size),
    [messages]
  )

  const submitMessage = async () => {
    const trimmed = message.trim()
    if (!trimmed || isSending) return

    setIsSending(true)
    try {
      const created = await sendPackageChatMessage(packageId, trimmed)
      setCurrentUserId(created.user_id)
      setMessages((prev) => [
        ...prev,
        mapPackageChatMessage(created, created.user_id, currentUser),
      ])
      setMessage('')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to send message.'
      )
    } finally {
      setIsSending(false)
    }
  }

  return {
    currentUserId,
    isLoading,
    isSending,
    message,
    messages,
    onlineCount,
    scrollContainerRef,
    setMessage,
    submitMessage,
  }
}
