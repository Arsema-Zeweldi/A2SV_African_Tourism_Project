"use server"

import { apiFetch } from "@/lib/api"
import type {
  ActionResult,
  CreateItineraryRequest,
  ItineraryActivityResponse,
  ItineraryListResponse,
  ItineraryResponse,
  PackageResponse,
} from "@/types/api"
import type { Activity } from "@/types/new-package"

/**
 * Fetches all itineraries belonging to the authenticated user.
 * Route: GET /itineraries
 */
export async function fetchUserItineraries(): Promise<
  ActionResult<ItineraryListResponse>
> {
  try {
    const data = await apiFetch<ItineraryListResponse>("/itineraries")
    return { success: true, data }
  } catch (e) {
    return {
      success: false,
      error:
        e instanceof Error ? e.message : "Failed to fetch itineraries",
    }
  }
}

/**
 * Permanently deletes an itinerary.
 * Route: DELETE /itineraries/:id
 */
export async function deleteItinerary(
  id: string,
): Promise<ActionResult<null>> {
  try {
    await apiFetch(`/itineraries/${id}`, { method: "DELETE" })
    return { success: true, data: null }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to delete itinerary",
    }
  }
}

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
          latitude: activity.latitude ?? 0,
          longitude: activity.longitude ?? 0,
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

/**
 * Clones a package's itinerary into the current user's trips.
 * Fetches the package, reads its itinerary, and creates a new one.
 */
export async function clonePackageItinerary(
  packageId: string,
): Promise<ActionResult<{ itinerary_id: string }>> {
  try {
    const pkg = await apiFetch<PackageResponse>(`/packages/${packageId}`)
    const srcItinerary = pkg.itinerary

    if (!srcItinerary) {
      return { success: false, error: "This package has no itinerary to follow." }
    }

    const activities = (srcItinerary.activities ?? []).map((a) => ({
      day_number: a.day_number,
      order_index: a.order_index,
      title: a.title,
      description: a.description,
      time_label: a.time_label,
      duration_label: a.duration_label,
      cost_label: a.cost_label,
      location: a.location,
      activity_type: a.activity_type,
      image_url: a.image_url ?? "",
      ai_pick: a.ai_pick ?? false,
      requirement: a.requirement ?? "",
      latitude: a.latitude ?? 0,
      longitude: a.longitude ?? 0,
    }))

    const body: CreateItineraryRequest = {
      title: `${pkg.title} (My Trip)`,
      description: pkg.description || pkg.summary || "",
      days_count: srcItinerary.days_count ?? activities.length,
      nights_count: srcItinerary.nights_count ?? Math.max(0, (srcItinerary.days_count ?? 1) - 1),
      activities,
    }

    const created = await apiFetch<ItineraryResponse>("/itineraries", {
      method: "POST",
      body,
    })

    return { success: true, data: { itinerary_id: created.itinerary_id } }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to copy itinerary",
    }
  }
}
