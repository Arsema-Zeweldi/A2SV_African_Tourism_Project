// hooks/useProfile.ts
// ─────────────────────────────────────────────────────────────
// Single source of truth for profile data & mutations.
// To connect a real API:
//   1. Replace MOCK_PROFILE with a useSWR / React Query call
//   2. Replace saveChanges body with your PATCH /api/profile call
//   3. Replace handleAvatarUpload with your POST /api/profile/avatar call
// ─────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";

export interface Profile {
  fullName: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
  defaultClimate: string;
  preferredLanguage: string;
  travelVibes: string[];
}

export interface SelectOption {
  value: string;
  label: string;
}

// ── Static config (move to a constants file if preferred) ────
export const CLIMATE_OPTIONS: SelectOption[] = [
  { value: "arid-desert",   label: "Arid & Desert" },
  { value: "tropical",      label: "Tropical" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "savanna",       label: "Savanna" },
  { value: "highland",      label: "Highland" },
];

export const LANGUAGE_OPTIONS: SelectOption[] = [
  { value: "english",    label: "English" },
  { value: "french",     label: "French" },
  { value: "swahili",    label: "Swahili" },
  { value: "arabic",     label: "Arabic" },
  { value: "portuguese", label: "Portuguese" },
];

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
];

// ── Mock seed data ────────────────────────────────────────────
const MOCK_PROFILE: Profile = {
  fullName: "Kwame Mensah",
  email: "kwame.m@travelafrica.com",
  bio: "Avid explorer of the Sahel and passionate about sustainable tourism in West Africa.",
  avatarUrl: null,
  defaultClimate: "arid-desert",
  preferredLanguage: "english",
  travelVibes: ["Safari", "Backpacking", "Photography"],
};

// ── Hook ──────────────────────────────────────────────────────
export function useProfile() {
  // Replace with: const { data: profile, mutate } = useSWR<Profile>('/api/profile', fetcher);
  const [profile, setProfile] = useState<Profile>(MOCK_PROFILE);
  const [isSaving, setIsSaving]     = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const updateField = <K extends keyof Profile>(field: K, value: Profile[K]) =>
    setProfile((prev) => ({ ...prev, [field]: value }));

  const toggleVibe = (vibe: string) =>
    setProfile((prev) => ({
      ...prev,
      travelVibes: prev.travelVibes.includes(vibe)
        ? prev.travelVibes.filter((v) => v !== vibe)
        : [...prev.travelVibes, vibe],
    }));

  const saveChanges = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // Replace with:
      // await fetch('/api/profile', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profile),
      // });
      await new Promise((r) => setTimeout(r, 900)); // simulate network
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    profile,
    updateField,
    toggleVibe,
    saveChanges,
    isSaving,
    saveSuccess,
  };
}