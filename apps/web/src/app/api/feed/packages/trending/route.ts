import { NextResponse } from 'next/server'
import { apiFetch } from '@/lib/api'
import { Package } from '@/types/feed'

export async function GET() {
  try {
    const data = await apiFetch<{ data: Package[] }>('/packages', {
      method: 'GET',
      params: {
        sort_by: 'views_count',
        order: 'desc',
        page_size: 3,
        status: 'public',
      },
    })

    return NextResponse.json(data)
  } catch (error) {
    return handleRouteError(error)
  }
}

function handleRouteError(error: unknown) {
  const message =
    error instanceof Error ? error.message : 'Failed to load trending packages'

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
