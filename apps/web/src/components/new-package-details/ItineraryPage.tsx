"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Activity, ItineraryData } from "@/types/new-package"
import { useToast } from "@/hooks/useToast"
import { syncAddActivity, syncDeleteActivity } from "@/actions/itinerary_actions"
import { createPackage, publishPackage } from "@/actions/package_actions"
import { ItineraryHeader } from "./Itineraryheader"
import { DaySection } from "./DaySection"
import { MapSidebar } from "./MapSideBar"
import { BudgetSidebar } from "./BudegtSideBar"
import { ActionsSidebar } from "./ActionSideBar"
import { AddActivityModal, type AddActivityFormData } from "./AddActivityModal"
import { ActivityDetailModal } from "./ActivityDetailModal"
import { CreatePackageModal, type CreatePackageFormData } from "./CreatePackageModal"
import { ToastContainer } from "./Toast"

interface ItineraryPageProps {
  data: ItineraryData
  itineraryId: string
}

export function ItineraryPage({ data, itineraryId }: ItineraryPageProps) {
  const [days, setDays] = useState(data.days)
  const [tags, setTags] = useState<string[]>(data.tags)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [addActivityDayId, setAddActivityDayId] = useState<string | null>(null)
  const [expandedActivity, setExpandedActivity] = useState<Activity | null>(null)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const router = useRouter()
  const { toasts, show: toast, dismiss } = useToast()

  const totalActivities = days.reduce((sum, d) => sum + d.activities.length, 0)

  // ── Delete activity ────────────────────────────────────────────────
  const handleDeleteActivity = async (activityId: string) => {
    // Optimistic update immediately
    setDays((prev) =>
      prev.map((day) => ({
        ...day,
        activities: day.activities.filter((a) => a.id !== activityId),
      })),
    )

    // Only sync to backend for non-local activities (local ones were never persisted)
    if (!activityId.startsWith("local-")) {
      const result = await syncDeleteActivity(itineraryId, activityId)
      if (!result.success) {
        toast("Activity removed locally — server sync failed.", "info")
      }
    }
  }

  // ── Add activity ───────────────────────────────────────────────────
  const handleAddActivity = (formData: AddActivityFormData) => {
    if (!addActivityDayId) return

    const targetDay = days.find((d) => d.id === addActivityDayId)
    if (!targetDay) return

    const newActivity: Activity = {
      id: `local-${Date.now()}`,
      time: formData.time_label,
      duration: formData.duration_label,
      title: formData.title,
      description: formData.description,
      cost: formData.cost_label,
      location: formData.location,
      type: formData.type,
      aiPick: false,
    }

    setDays((prev) =>
      prev.map((day) =>
        day.id === addActivityDayId
          ? { ...day, activities: [...day.activities, newActivity] }
          : day,
      ),
    )
    setAddActivityDayId(null)
    toast("Activity added successfully", "success")

    // Background sync — fire-and-forget, non-blocking
    const orderIndex = targetDay.activities.length
    syncAddActivity(
      itineraryId,
      newActivity,
      targetDay.dayNumber,
      orderIndex,
    ).then((result) => {
      if (!result.success) {
        toast("Activity saved locally — server sync failed.", "info")
      }
    })
  }

  // ── Add tag ────────────────────────────────────────────────────────
  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed || tags.includes(trimmed)) return
    setTags((prev) => [...prev, trimmed])
  }

  // ── Save trip ──────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true)
    try {
      // The itinerary is already persisted on the backend from the plan-trip flow.
      // Local adds/deletes are synced in real-time. "Save" confirms and navigates.
      await new Promise((r) => setTimeout(r, 400))
      toast("Trip saved! Taking you to My Trips…", "success")
      setTimeout(() => router.push("/my-trips"), 1000)
    } finally {
      setIsSaving(false)
    }
  }

  // ── Share ──────────────────────────────────────────────────────────
  const handleShare = async () => {
    const url = window.location.href
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await navigator.share({ title: data.title, url })
      } else {
        await navigator.clipboard.writeText(url)
        toast("Link copied to clipboard!", "success")
      }
    } catch {
      // User cancelled share or clipboard denied — silently ignore
    }
  }

  // ── Publish toggle ─────────────────────────────────────────────────
  const handlePublishToggle = (isPublic: boolean) => {
    if (isPublic) setShowPublishModal(true)
  }

  // ── Publish submit ─────────────────────────────────────────────────
  const handlePublishSubmit = async (formData: CreatePackageFormData) => {
    setIsPublishing(true)
    try {
      const createResult = await createPackage({
        ...formData,
        itinerary_id: itineraryId,
      })
      if (!createResult.success) {
        toast(createResult.error, "error")
        return
      }

      const publishResult = await publishPackage(
        createResult.data.package_id,
      )
      if (!publishResult.success) {
        toast(publishResult.error, "error")
        return
      }

      toast("Package published to the community!", "success")
      setShowPublishModal(false)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-[#f5f5f3]"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      <div className="mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* ── Left column ── */}
          <div className="lg:flex-1 space-y-4">
            <ItineraryHeader
              data={{ ...data, tags }}
              onAddTag={handleAddTag}
            />

            {days.map((day, index) => (
              <DaySection
                key={day.id}
                day={day}
                isFirst={index === 0}
                onDeleteActivity={handleDeleteActivity}
                onAddActivity={(dayId) => setAddActivityDayId(dayId)}
                onExpandActivity={setExpandedActivity}
              />
            ))}
          </div>

          {/* ── Right column ── */}
          <div className="lg:w-95 lg:shrink-0 space-y-3">
            <MapSidebar config={data.map} />
            <BudgetSidebar budget={data.budget} />
            <ActionsSidebar
              onSave={handleSave}
              onShare={handleShare}
              onPublishToggle={handlePublishToggle}
              isSaving={isSaving}
            />
          </div>
        </div>
      </div>

      {data.footerText && (
        <footer className="text-center py-6 text-[11px] text-gray-400">
          {data.footerText}
        </footer>
      )}

      {/* ── Modals ── */}
      <AddActivityModal
        open={addActivityDayId !== null}
        onClose={() => setAddActivityDayId(null)}
        onSubmit={handleAddActivity}
      />

      <ActivityDetailModal
        activity={expandedActivity}
        onClose={() => setExpandedActivity(null)}
      />

      <CreatePackageModal
        open={showPublishModal}
        itineraryData={data}
        totalActivities={totalActivities}
        isSubmitting={isPublishing}
        onClose={() => setShowPublishModal(false)}
        onSubmit={handlePublishSubmit}
      />

      {/* ── Toasts ── */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}
