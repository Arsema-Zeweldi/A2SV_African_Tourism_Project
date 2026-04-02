import { NextRequest, NextResponse } from 'next/server'
import { apiFetch } from '@/lib/api'
import { Comment as PostComment } from '@/types/feed'

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_: NextRequest, context: RouteContext) {
  const { id } = await context.params

  try {
    const data = await apiFetch<{ data: PostComment[] }>(`/posts/${id}/comments`, {
      method: 'GET',
    })

    return NextResponse.json(data)
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  try {
    const body = await request.json()
    const data = await apiFetch<PostComment>(`/posts/${id}/comments`, {
      method: 'POST',
      body,
    })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return handleRouteError(error)
  }
}

function handleRouteError(error: unknown) {
  const message =
    error instanceof Error ? error.message : 'Failed to process comments request'

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
