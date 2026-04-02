'use server'

import { apiFetch } from '@/lib/api'
import type {
  ActionResult,
  UserPreferencesResponse,
  UserProfileResponse,
} from '@/types/api'

export async function fetchProfile(): Promise<
  ActionResult<UserProfileResponse>
> {
  try {
    const json = await apiFetch<{ data: UserProfileResponse }>('/user/profile')
    return { success: true, data: json.data }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to fetch profile',
    }
  }
}

export async function updateProfileFields(data: {
  first_name?: string
  last_name?: string
  country?: string
  bio?: string
}): Promise<ActionResult<UserProfileResponse>> {
  try {
    const formData = new FormData()

    if (data.first_name !== undefined) {
      formData.append('first_name', data.first_name)
    }
    if (data.last_name !== undefined) {
      formData.append('last_name', data.last_name)
    }
    if (data.country !== undefined) {
      formData.append('country', data.country)
    }
    if (data.bio !== undefined) {
      formData.append('bio', data.bio)
    }

    const json = await apiFetch<{ data: UserProfileResponse }>(
      '/user/profile',
      {
        method: 'PATCH',
        body: formData,
      }
    )

    return { success: true, data: json.data }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to update profile',
    }
  }
}

export async function uploadAvatar(
  formData: FormData
): Promise<ActionResult<string>> {
  try {
    const json = await apiFetch<{ data?: UserProfileResponse }>(
      '/user/profile',
      {
        method: 'PATCH',
        body: formData,
      }
    )

    return { success: true, data: json.data?.avatar_url ?? '' }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to upload avatar',
    }
  }
}

export async function fetchPreferences(): Promise<
  ActionResult<UserPreferencesResponse>
> {
  try {
    const json = await apiFetch<{ data?: UserPreferencesResponse }>(
      '/user/preferences'
    )
    return { success: true, data: json.data ?? {} }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to fetch preferences',
    }
  }
}

export async function updatePreferences(data: {
  preferred_climate?: string
  preferred_language?: string
  preferred_activities?: string[]
  preferred_season?: string
  budget_range?: string
  dietary_restrictions?: string[]
}): Promise<ActionResult<UserPreferencesResponse>> {
  try {
    const payload: Record<string, unknown> = {}

    if (data.preferred_climate) {
      payload.preferred_climate = data.preferred_climate
    }
    if (data.preferred_language) {
      payload.preferred_language = data.preferred_language
    }
    if (data.preferred_activities !== undefined) {
      payload.preferred_activities = data.preferred_activities
    }
    if (data.preferred_season) {
      payload.preferred_season = data.preferred_season
    }
    if (data.budget_range) {
      payload.budget_range = data.budget_range
    }
    if (data.dietary_restrictions !== undefined) {
      payload.dietary_restrictions = data.dietary_restrictions
    }

    const json = await apiFetch<{ data: UserPreferencesResponse }>(
      '/user/preferences',
      {
        method: 'PATCH',
        body: payload,
      }
    )

    return { success: true, data: json.data }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to update preferences',
    }
  }
}

export async function changePassword(data: {
  current_password: string
  new_password: string
  password_confirm: string
}): Promise<ActionResult<null>> {
  try {
    await apiFetch('/user/change-password', {
      method: 'POST',
      body: data,
    })

    return { success: true, data: null }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to change password',
    }
  }
}
