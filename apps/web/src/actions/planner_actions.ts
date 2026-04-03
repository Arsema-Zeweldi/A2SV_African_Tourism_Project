"use server"

import { apiFetch } from "@/lib/api"
import { toGeneratePlanRequest, toCreateItineraryRequest } from "@/lib/mappers"
import {
  generatePlanSchema,
  type ActionResult,
  type GeneratePlanResponse,
  type ItineraryResponse,
  type CreateItineraryRequest,
} from "@/types/api"
import type { TripFormData } from "@/types/plan-trip"

export async function generateItinerary(
  formData: TripFormData,
): Promise<ActionResult<GeneratePlanResponse>> {
  const mapped = toGeneratePlanRequest(formData)
  const parsed = generatePlanSchema.safeParse(mapped)

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    const data = await apiFetch<GeneratePlanResponse>("/planner/generate", {
      method: "POST",
      body: parsed.data,
    })
    return { success: true, data }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Itinerary generation failed"
    return { success: false, error: message }
  }
}

export async function saveItinerary(
  aiResponse: GeneratePlanResponse,
): Promise<ActionResult<{ itinerary_id: string }>> {
  const body: CreateItineraryRequest = toCreateItineraryRequest(aiResponse)

  try {
    const data = await apiFetch<ItineraryResponse>("/itineraries", {
      method: "POST",
      body,
    })
    return { success: true, data: { itinerary_id: data.itinerary_id } }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to save itinerary"
    return { success: false, error: message }
  }
}

export async function chatAboutActivity(
  activityTitle: string,
  activityDescription: string,
  activityLocation: string,
  question: string,
): Promise<ActionResult<{ answer: string }>> {
  try {
    const data = await apiFetch<{ answer: string }>("/planner/activity-chat", {
      method: "POST",
      body: {
        activity_title: activityTitle,
        activity_description: activityDescription,
        activity_location: activityLocation,
        question,
      },
    })
    return { success: true, data }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Chat failed"
    return { success: false, error: message }
  }
}
