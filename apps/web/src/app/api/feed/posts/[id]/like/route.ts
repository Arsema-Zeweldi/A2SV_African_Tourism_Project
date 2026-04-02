import { NextResponse } from 'next/server'
import { apiFetch } from '@/lib/api'

type LikeResponse = {
  liked: boolean
  message: string
}

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function POST(_: Request, context: RouteContext) {
  const { id } = await context.params

  try {
    const data = await apiFetch<LikeResponse>(`/posts/${id}/like`, {
      method: 'POST',
    })

    return NextResponse.json(data)
  } catch (error) {
    return handleRouteError(error)
  }
}

function handleRouteError(error: unknown) {
  const message =
    error instanceof Error ? error.message : 'Failed to toggle post like'

  return NextResponse.json(
    { error: message },
    { status: getStatusCodeFromMessage(message) }
  )
}

function getStatusCodeFromMessage(message: string) {
  const match = message.match(/\b(\d{3})\b/)
  const status = match ? Number(match[1]) : 500

  return Number.isInteger(status) ? status : 500
}
