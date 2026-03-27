"use server"

import { apiFetch } from "@/lib/api"
import type { ActionResult, ItineraryActivityResponse } from "@/types/api"
import type { Activity } from "@/types/new-package"

/** Maps frontend display types → backend accepted types */
const FRONTEND_TO_BACKEND_TYPE: Record<string, string> = {
  food: "food",
  tour: "adventure",
  monument: "culture",
  accommodation: "culture",
  transport: "adventure",
}

/**
 * Syncs a newly added local activity to the backend.
 * Route: POST /itineraries/:id/activities
 */
export async function syncAddActivity(
  itineraryId: string,
  activity: Activity,
  dayNumber: number,
  orderIndex: number,
): Promise<ActionResult<{ activity_id: string }>> {
  try {
    const data = await apiFetch<ItineraryActivityResponse>(
      `/itineraries/${itineraryId}/activities`,
      {
        method: "POST",
        body: {
          day_number: dayNumber,
          order_index: orderIndex,
          title: activity.title,
          description: activity.description,
          time_label: activity.time,
          duration_label: activity.duration,
          cost_label: activity.cost,
          location: activity.location,
          activity_type:
            FRONTEND_TO_BACKEND_TYPE[activity.type] ?? "culture",
          image_url: activity.imageUrl ?? "",
          ai_pick: activity.aiPick ?? false,
          requirement: "",
          latitude: 0,
          longitude: 0,
        },
      },
    )
    return { success: true, data: { activity_id: data.activity_id } }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to sync activity",
    }
  }
}

/**
 * Syncs a deleted activity to the backend.
 * Route: DELETE /itineraries/:id/activities/:activityId
 */
export async function syncDeleteActivity(
  itineraryId: string,
  activityId: string,
): Promise<ActionResult<null>> {
  try {
    await apiFetch(`/itineraries/${itineraryId}/activities/${activityId}`, {
      method: "DELETE",
    })
    return { success: true, data: null }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to sync delete",
    }
  }
}
