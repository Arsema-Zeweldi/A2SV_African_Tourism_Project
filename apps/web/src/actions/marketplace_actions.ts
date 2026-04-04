'use server'

import { apiFetch } from '@/lib/api'
import type {
  ActionResult,
} from '@/types/api'
import type {
  ApiPackage,
  FeedParams,
  PackagesFeedResponse,
} from '@/services/packagesService'

export async function getPackagesFeedAction(
  params: FeedParams = {}
): Promise<ActionResult<PackagesFeedResponse>> {
  try {
    const data = await apiFetch<PackagesFeedResponse>('/packages', {
      params: params as Record<string, string | number | boolean>,
    })
    return { success: true, data }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to fetch packages',
    }
  }
}

export async function getPackageAction(
  id: string
): Promise<ActionResult<ApiPackage>> {
  try {
    const data = await apiFetch<ApiPackage>(`/packages/${id}`)
    return { success: true, data }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to fetch package',
    }
  }
}
