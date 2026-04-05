'use server'

import { apiFetch } from '@/lib/api'
import type { ActionResult } from '@/types/api'

export interface SubmitPackageReviewPayload {
  rating: number
  comment: string
}

export interface SubmitPackageReviewResponse {
  message: string
}

export async function submitPackageReviewAction(
  packageId: string,
  payload: SubmitPackageReviewPayload
): Promise<ActionResult<SubmitPackageReviewResponse>> {
  try {
    const data = await apiFetch<SubmitPackageReviewResponse>(
      `/packages/${packageId}/reviews`,
      {
        method: 'POST',
        body: payload,
      }
    )
    return { success: true, data }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to submit review',
    }
  }
}
