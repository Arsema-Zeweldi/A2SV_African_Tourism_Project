"use server"

import { z } from "zod"
import { apiFetch } from "@/lib/api"
import type { ActionResult, PackageResponse } from "@/types/api"

export const createPackageSchema = z.object({
  itinerary_id: z.string().uuid("Invalid itinerary ID"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .max(300, "Summary must be under 300 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price must be non-negative"),
  country: z.string().min(2, "Country is required"),
  location: z.string().min(2, "Location is required"),
  currency: z.string().min(1).default("USD"),
  duration_days: z.number().int().min(1),
  category: z.string().min(2, "Category is required"),
  group_size: z.string().min(1, "Group size is required"),
})

export type CreatePackagePayload = z.infer<typeof createPackageSchema>

/**
 * Creates a new package linked to an itinerary (defaults to private).
 * Route: POST /packages
 */
export async function createPackage(
  input: CreatePackagePayload,
): Promise<ActionResult<PackageResponse>> {
  const parsed = createPackageSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    const data = await apiFetch<PackageResponse>("/packages", {
      method: "POST",
      body: { ...parsed.data, image_url: "" },
    })
    return { success: true, data }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to create package",
    }
  }
}

/**
 * Changes a package status to public (publishes it to the community).
 * Requires the itinerary to have at least 3 activities.
 * Route: PATCH /packages/:id/status
 */
export async function publishPackage(
  packageId: string,
): Promise<ActionResult<null>> {
  try {
    await apiFetch(`/packages/${packageId}/status`, {
      method: "PATCH",
      body: { status: "public" },
    })
    return { success: true, data: null }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to publish package",
    }
  }
}
