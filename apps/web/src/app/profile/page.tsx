"use client"

import { Loader2, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProfile } from "@/hooks/useProfile"
import PersonalInfoSection from "@/components/profile/PersonalInfoSection"
import TravelPreferencesSection from "@/components/profile/TravelPreferencesSection"

export default function ProfilePage() {
  const {
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
  } = useProfile()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Manage your personal information and travel preferences across the continent.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Sections */}
      <PersonalInfoSection
        profile={profile}
        isUploadingAvatar={isUploadingAvatar}
        updateField={updateField}
        onAvatarUpload={handleAvatarUpload}
      />
      <TravelPreferencesSection
        profile={profile}
        updateField={updateField}
        toggleVibe={toggleVibe}
      />

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          className="border-stone-200 text-stone-600"
          onClick={() => window.location.reload()}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          onClick={saveChanges}
          disabled={isSaving || isUploadingAvatar}
          className={
            saveSuccess
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }
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
            "Save Changes"
          )}
        </Button>
      </div>

      {/* Promo banner */}
      <div
        className="relative rounded-xl overflow-hidden min-h-28 flex items-end p-6"
        style={{ background: "linear-gradient(135deg, #1c1917 50%, #292524)" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=60')",
          }}
        />
        <div className="relative z-10">
          <p className="font-bold text-orange-400 text-base">Roam with purpose.</p>
          <p className="text-sm text-white/60 mt-0.5">
            Your next adventure is only a click away.
          </p>
        </div>
      </div>
    </div>
  )
}
