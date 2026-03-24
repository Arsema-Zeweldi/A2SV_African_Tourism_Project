import { cookies } from "next/headers"

const API_URL = process.env.API_URL ?? "http://localhost:8080/api/v1"

interface FetchOptions {
  method?: string
  body?: unknown
  cache?: RequestCache
}

/**
 * Server-side fetch wrapper that reads the auth token from cookies
 * and communicates with the backend API.
 *
 * Only usable in Server Components and Server Actions.
 */
export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    ...(options.body !== undefined
      ? { body: JSON.stringify(options.body) }
      : {}),
    cache: options.cache ?? "no-store",
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const message =
      (err as { error?: string }).error ?? `API error ${res.status}`
    throw new Error(message)
  }

  return res.json() as Promise<T>
}
