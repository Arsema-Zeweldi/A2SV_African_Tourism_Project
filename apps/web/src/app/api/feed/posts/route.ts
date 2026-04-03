import { NextRequest, NextResponse } from 'next/server'
import { apiFetch } from '@/lib/api'
import { Post } from '@/types/feed'

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get('status') ?? 'all'

  try {
    const data = await apiFetch<{ data: Post[] }>(`/posts?status=${status}`, {
      method: 'GET',
    })

    return NextResponse.json(data)
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') ?? ''
    const body = contentType.includes('multipart/form-data')
      ? await request.formData()
      : await request.json()

    const data = await apiFetch<Post>('/posts', {
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
    error instanceof Error ? error.message : 'Failed to process feed request'

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
