"use server"

import { cookies } from "next/headers"
import type {
  ActionResult,
  UserProfileResponse,
  UserPreferencesResponse,
} from "@/types/api"

const API_URL = process.env.API_URL ?? "http://localhost:8080/api/v1"

async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get("auth_token")?.value
}

// ── Fetch profile ──────────────────────────────────────────────────
export async function fetchProfile(): Promise<
  ActionResult<UserProfileResponse>
> {
  try {
    const token = await getToken()
    const res = await fetch(`${API_URL}/user/profile`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return {
        success: false,
        error: (err as { error?: string }).error ?? `Error ${res.status}`,
      }
    }
    const json = await res.json()
    return { success: true, data: json.data }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to fetch profile",
    }
  }
}

// ── Update profile fields (text) ───────────────────────────────────
export async function updateProfileFields(data: {
  first_name?: string
  last_name?: string
  country?: string
  bio?: string
}): Promise<ActionResult<UserProfileResponse>> {
  try {
    const token = await getToken()
    const formData = new FormData()
    if (data.first_name !== undefined) formData.append("first_name", data.first_name)
    if (data.last_name !== undefined) formData.append("last_name", data.last_name)
    if (data.country !== undefined) formData.append("country", data.country)
    if (data.bio !== undefined) formData.append("bio", data.bio)

    const res = await fetch(`${API_URL}/user/profile`, {
      method: "PATCH",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // No Content-Type — let fetch set the multipart boundary
      },
      body: formData,
      cache: "no-store",
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return {
        success: false,
        error: (err as { error?: string }).error ?? `Error ${res.status}`,
      }
    }
    const json = await res.json()
    return { success: true, data: json.data }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to update profile",
    }
  }
}

// ── Upload avatar — accepts a FormData containing an "avatar" file ─
export async function uploadAvatar(
  formData: FormData,
): Promise<ActionResult<string>> {
  try {
    const token = await getToken()
    const res = await fetch(`${API_URL}/user/profile`, {
      method: "PATCH",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
      cache: "no-store",
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return {
        success: false,
        error: (err as { error?: string }).error ?? `Error ${res.status}`,
      }
    }
    const json = await res.json()
    return { success: true, data: json.data?.avatar_url ?? "" }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to upload avatar",
    }
  }
}

// ── Fetch preferences ──────────────────────────────────────────────
export async function fetchPreferences(): Promise<
  ActionResult<UserPreferencesResponse>
> {
  try {
    const token = await getToken()
    const res = await fetch(`${API_URL}/user/preferences`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return {
        success: false,
        error: (err as { error?: string }).error ?? `Error ${res.status}`,
      }
    }
    const json = await res.json()
    return { success: true, data: json.data ?? {} }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to fetch preferences",
    }
  }
}

// ── Update preferences ─────────────────────────────────────────────
export async function updatePreferences(data: {
  preferred_climate?: string
  preferred_language?: string
  preferred_activities?: string[]
  preferred_season?: string
  budget_range?: string
  dietary_restrictions?: string[]
}): Promise<ActionResult<UserPreferencesResponse>> {
  try {
    const token = await getToken()

    // Only include defined fields in the payload
    const payload: Record<string, unknown> = {}
    if (data.preferred_climate) payload.preferred_climate = data.preferred_climate
    if (data.preferred_language) payload.preferred_language = data.preferred_language
    if (data.preferred_activities !== undefined) {
      payload.preferred_activities = data.preferred_activities
    }
    if (data.preferred_season) payload.preferred_season = data.preferred_season
    if (data.budget_range) payload.budget_range = data.budget_range
    if (data.dietary_restrictions !== undefined) {
      payload.dietary_restrictions = data.dietary_restrictions
    }

    const res = await fetch(`${API_URL}/user/preferences`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return {
        success: false,
        error: (err as { error?: string }).error ?? `Error ${res.status}`,
      }
    }
    const json = await res.json()
    return { success: true, data: json.data }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to update preferences",
    }
  }
}

// ── Change password ────────────────────────────────────────────────
export async function changePassword(data: {
  current_password: string
  new_password: string
  password_confirm: string
}): Promise<ActionResult<null>> {
  try {
    const token = await getToken()
    const res = await fetch(`${API_URL}/user/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
      cache: "no-store",
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return {
        success: false,
        error: (err as { error?: string }).error ?? `Error ${res.status}`,
      }
    }
    return { success: true, data: null }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to change password",
    }
  }
}
