'use server'
import { cookies } from 'next/headers'

const RAW_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!RAW_API_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_BASE_URL is not defined. Check your .env.local file.'
  )
}
const API_URL = RAW_API_URL.endsWith('/api/v1')
  ? RAW_API_URL
  : `${RAW_API_URL.replace(/\/$/, '')}/api/v1`

interface FetchOptions {
  method?: string
  body?: unknown
  cache?: RequestCache
  params?: Record<string, string | number | boolean>
}

/**
 * Server-side fetch wrapper that reads the auth token from cookies
 * and communicates with the backend API.
 *
 * Only usable in Server Components and Server Actions.
 */
export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  const requestUrl = new URL(`${API_URL}${path}`)

  const isFormData = options.body instanceof FormData

  const headers: Record<string, string> = {}

  // 2. Only add JSON header if it's NOT FormData
  // When sending FormData, the browser/server MUST set its own boundary header
  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      requestUrl.searchParams.set(key, String(value))
    }
  }

  const res = await fetch(requestUrl.toString(), {
    method: options.method ?? 'GET',
    headers,
    body: isFormData
      ? (options.body as FormData)
      : options.body
        ? JSON.stringify(options.body)
        : undefined,
    cache: options.cache ?? 'no-store',
  })

  if (!res.ok) {
    let message = `API error ${res.status}`
    try {
      const err = await res.json()
      if (err && typeof err.error === 'string') {
        message = err.error
      }
    } catch {
      // response body was not JSON — use the default status message
    }
    throw new Error(message)
  }

  return res.json() as Promise<T>
}
