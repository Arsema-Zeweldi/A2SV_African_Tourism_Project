"use client"

import { useState, useEffect, useCallback } from "react"
import {
  fetchProfile,
  fetchPreferences,
  updateProfileFields,
  updatePreferences,
  uploadAvatar,
} from "@/actions/profile_actions"

// ── Types ─────────────────────────────────────────────────────────

export interface Profile {
  firstName: string
  lastName: string
  email: string
  bio: string
  country: string
  avatarUrl: string | null
  defaultClimate: string
  preferredLanguage: string
  travelVibes: string[]
}

export interface SelectOption {
  value: string
  label: string
}

// ── Static config ─────────────────────────────────────────────────
// Values must match backend enum constraints exactly
export const CLIMATE_OPTIONS: SelectOption[] = [
  { value: "tropical",  label: "Tropical"  },
  { value: "desert",    label: "Desert"    },
  { value: "coastal",   label: "Coastal"   },
  { value: "highland",  label: "Highland"  },
  { value: "temperate", label: "Temperate" },
  { value: "any",       label: "Any"       },
]

export const LANGUAGE_OPTIONS: SelectOption[] = [
  { value: "english",    label: "English"    },
  { value: "french",     label: "French"     },
  { value: "swahili",    label: "Swahili"    },
  { value: "arabic",     label: "Arabic"     },
  { value: "portuguese", label: "Portuguese" },
  { value: "any",        label: "Any"        },
]

export const ALL_VIBES = [
  "Safari",
  "Luxury Boutique",
  "Backpacking",
  "Cultural Heritage",
  "Adventure Sports",
  "Photography",
  "Eco Tourism",
  "Food & Culinary",
  "Wellness & Spa",
]

const EMPTY_PROFILE: Profile = {
  firstName: "",
  lastName: "",
  email: "",
  bio: "",
  country: "",
  avatarUrl: null,
  defaultClimate: "any",
  preferredLanguage: "english",
  travelVibes: [],
}

// ── Hook ──────────────────────────────────────────────────────────

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE)
  const [isLoading, setIsLoading]     = useState(true)
  const [isSaving, setIsSaving]       = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError]             = useState<string | null>(null)

  // ── Initial fetch ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      const [profileRes, prefsRes] = await Promise.all([
        fetchProfile(),
        fetchPreferences(),
      ])

      if (cancelled) return

      if (!profileRes.success) {
        setError(profileRes.error)
        setIsLoading(false)
        return
      }

      const p = profileRes.data
      const prefs = prefsRes.success ? prefsRes.data : {}

      setProfile({
        firstName: p.first_name ?? "",
        lastName: p.last_name ?? "",
        email: p.email ?? "",
        bio: p.bio ?? "",
        country: p.country ?? "",
        avatarUrl: p.avatar_url ?? null,
        defaultClimate: prefs.preferred_climate || "any",
        preferredLanguage: prefs.preferred_language || "english",
        // Travel vibes are stored in preferred_activities on the backend
        travelVibes: prefs.preferred_activities ?? [],
      })

      setIsLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [])

  // ── Field updater ──────────────────────────────────────────────
  const updateField = useCallback(
    <K extends keyof Profile>(field: K, value: Profile[K]) =>
      setProfile((prev) => ({ ...prev, [field]: value })),
    [],
  )

  // ── Toggle travel vibe ─────────────────────────────────────────
  const toggleVibe = useCallback((vibe: string) =>
    setProfile((prev) => ({
      ...prev,
      travelVibes: prev.travelVibes.includes(vibe)
        ? prev.travelVibes.filter((v) => v !== vibe)
        : [...prev.travelVibes, vibe],
    })),
    [],
  )

  // ── Avatar upload (immediate on file pick) ─────────────────────
  const handleAvatarUpload = useCallback(async (file: File) => {
    setIsUploadingAvatar(true)
    const fd = new FormData()
    fd.append("avatar", file)
    const result = await uploadAvatar(fd)
    setIsUploadingAvatar(false)
    if (result.success && result.data) {
      setProfile((prev) => ({ ...prev, avatarUrl: result.data }))
    }
    return result
  }, [])

  // ── Save all changes ───────────────────────────────────────────
  const saveChanges = useCallback(async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    setError(null)

    const [profileResult, prefsResult] = await Promise.all([
      updateProfileFields({
        first_name: profile.firstName,
        last_name: profile.lastName,
        country: profile.country,
        bio: profile.bio,
      }),
      updatePreferences({
        preferred_climate: profile.defaultClimate,
        preferred_language: profile.preferredLanguage,
        preferred_activities: profile.travelVibes,
      }),
    ])

    setIsSaving(false)

    if (!profileResult.success) {
      setError(profileResult.error)
      return
    }
    if (!prefsResult.success) {
      setError(prefsResult.error)
      return
    }

    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }, [profile])

  return {
    profile,
    isLoading,
    isSaving,
    isUploadingAvatar,
    saveSuccess,
    error,
    updateField,
    toggleVibe,
    handleAvatarUpload,
    saveChanges,
  }
}
