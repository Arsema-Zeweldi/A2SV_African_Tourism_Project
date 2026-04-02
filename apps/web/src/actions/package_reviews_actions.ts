'use server'

import { apiFetch } from '@/lib/api'

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
): Promise<SubmitPackageReviewResponse> {
  return apiFetch<SubmitPackageReviewResponse>(`/packages/${packageId}/reviews`, {
    method: 'POST',
    body: payload,
  })
}
