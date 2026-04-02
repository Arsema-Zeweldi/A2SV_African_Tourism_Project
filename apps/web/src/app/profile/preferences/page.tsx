"use client"

import { useState, useEffect } from "react"
import { Loader2, Check, AlertCircle, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { fetchPreferences, updatePreferences } from "@/actions/profile_actions"
import type { UserPreferencesResponse } from "@/types/api"

// ── Options matching backend enums ────────────────────────────────

const SEASON_OPTIONS = [
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
  { value: "autumn", label: "Autumn" },
  { value: "winter", label: "Winter" },
  { value: "any",    label: "Any Season" },
]

const BUDGET_OPTIONS = [
  { value: "low",    label: "Low — budget travel" },
  { value: "medium", label: "Medium — comfortable" },
  { value: "high",   label: "High — premium"      },
  { value: "luxury", label: "Luxury — ultra-high end" },
]

const COMMON_RESTRICTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Halal",
  "Kosher",
  "Nut-free",
  "Dairy-free",
]

interface PrefsState {
  preferred_season: string
  budget_range: string
  dietary_restrictions: string[]
}

const EMPTY: PrefsState = {
  preferred_season: "any",
  budget_range: "medium",
  dietary_restrictions: [],
}

export default function PreferencesPage() {
  const [prefs, setPrefs]       = useState<PrefsState>(EMPTY)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving]   = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [customInput, setCustomInput] = useState("")

  // ── Load ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    fetchPreferences().then((res) => {
      if (cancelled) return
      if (res.success) {
        const d: UserPreferencesResponse = res.data
        setPrefs({
          preferred_season: d.preferred_season || "any",
          budget_range: d.budget_range || "medium",
          dietary_restrictions: d.dietary_restrictions ?? [],
        })
      }
      setIsLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  // ── Save ────────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSaveSuccess(false)

    const result = await updatePreferences({
      preferred_season: prefs.preferred_season,
      budget_range: prefs.budget_range,
      dietary_restrictions: prefs.dietary_restrictions,
    })

    setIsSaving(false)
    if (!result.success) {
      setError(result.error)
      return
    }
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  // ── Dietary helpers ─────────────────────────────────────────────
  const toggleRestriction = (item: string) =>
    setPrefs((prev) => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.includes(item)
        ? prev.dietary_restrictions.filter((r) => r !== item)
        : [...prev.dietary_restrictions, item],
    }))

  const addCustom = () => {
    const trimmed = customInput.trim()
    if (!trimmed || prefs.dietary_restrictions.includes(trimmed)) {
      setCustomInput("")
      return
    }
    setPrefs((prev) => ({
      ...prev,
      dietary_restrictions: [...prev.dietary_restrictions, trimmed],
    }))
    setCustomInput("")
  }

  const removeRestriction = (item: string) =>
    setPrefs((prev) => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.filter((r) => r !== item),
    }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Preferences
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Fine-tune how we personalise your travel recommendations.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Travel timing + budget */}
      <Card className="border-stone-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-stone-900">
            <span className="block w-0.5 h-5 rounded-full bg-orange-500" />
            Travel Style
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-stone-500">
                Preferred Season
              </Label>
              <Select
                value={prefs.preferred_season}
                onValueChange={(val) =>
                  setPrefs((p) => ({ ...p, preferred_season: val }))
                }
              >
                <SelectTrigger className="border-stone-200 bg-stone-50 focus:ring-orange-400 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEASON_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-stone-500">
                Budget Range
              </Label>
              <Select
                value={prefs.budget_range}
                onValueChange={(val) =>
                  setPrefs((p) => ({ ...p, budget_range: val }))
                }
              >
                <SelectTrigger className="border-stone-200 bg-stone-50 focus:ring-orange-400 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dietary restrictions */}
      <Card className="border-stone-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-stone-900">
            <span className="block w-0.5 h-5 rounded-full bg-orange-500" />
            Dietary Restrictions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Common quick-toggles */}
          <div className="flex flex-wrap gap-2">
            {COMMON_RESTRICTIONS.map((item) => {
              const active = prefs.dietary_restrictions.includes(item)
              return (
                <Badge
                  key={item}
                  variant="outline"
                  onClick={() => toggleRestriction(item)}
                  className={cn(
                    "cursor-pointer rounded-full px-3 py-1 text-xs font-medium border transition-all select-none",
                    active
                      ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                      : "bg-stone-50 text-stone-500 border-stone-200 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50",
                  )}
                >
                  {item}
                </Badge>
              )
            })}
          </div>

          {/* Selected custom tags */}
          {prefs.dietary_restrictions.filter(
            (r) => !COMMON_RESTRICTIONS.includes(r),
          ).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {prefs.dietary_restrictions
                .filter((r) => !COMMON_RESTRICTIONS.includes(r))
                .map((item) => (
                  <Badge
                    key={item}
                    variant="outline"
                    className="rounded-full px-3 py-1 text-xs font-medium bg-orange-500 text-white border-orange-500 gap-1.5"
                  >
                    {item}
                    <button
                      onClick={() => removeRestriction(item)}
                      className="hover:opacity-70"
                      aria-label={`Remove ${item}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
            </div>
          )}

          {/* Custom input */}
          <div className="flex max-w-md flex-col gap-2 sm:flex-row">
            <Input
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
              placeholder="Add custom restriction…"
              className="border-stone-200 bg-stone-50 focus-visible:ring-orange-400 text-sm h-9"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCustom}
              className="h-9 border-stone-200 text-stone-600 hover:border-orange-300 hover:text-orange-500"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          className="border-stone-200 text-stone-600 w-full sm:w-auto"
          onClick={() => window.location.reload()}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full sm:w-auto ${
            saveSuccess
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : saveSuccess ? (
            <>
              <Check className="h-4 w-4" />
              Saved!
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </div>
    </div>
  )
}
