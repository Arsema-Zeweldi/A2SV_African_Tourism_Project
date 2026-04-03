'use server'

import { apiFetch } from '@/lib/api'
import type { ActionResult, PackageResponse } from '@/types/api'
import {
  createPackageSchema,
  type CreatePackagePayload,
} from '@/lib/package-schema'

/**
 * Creates a new package linked to an itinerary (defaults to private).
 * Route: POST /packages
 */
export async function createPackage(
  input: CreatePackagePayload
): Promise<ActionResult<PackageResponse>> {
  const parsed = createPackageSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    const data = await apiFetch<PackageResponse>('/packages', {
      method: 'POST',
      body: { ...parsed.data, image_url: '' },
    })
    return { success: true, data }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to create package',
    }
  }
}

/**
 * Changes a package status to public (publishes it to the community).
 * Requires the itinerary to have at least 3 activities.
 * Route: PATCH /packages/:id/status
 */
export async function publishPackage(
  packageId: string
): Promise<ActionResult<null>> {
  try {
    await apiFetch(`/packages/${packageId}/status`, {
      method: 'PATCH',
      body: { status: 'public' },
    })
    return { success: true, data: null }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to publish package',
    }
  }
}

export async function updatePackageStatus(
  packageId: string,
  status: 'public' | 'private' | 'archived'
): Promise<ActionResult<null>> {
  try {
    await apiFetch(`/packages/${packageId}/status`, {
      method: 'PATCH',
      body: { status },
    })
    return { success: true, data: null }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to update package status',
    }
  }
}
