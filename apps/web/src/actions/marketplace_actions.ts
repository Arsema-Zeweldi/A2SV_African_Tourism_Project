'use server'

import { apiFetch } from '@/lib/api'
import type {
  ApiPackage,
  FeedParams,
  PackagesFeedResponse,
} from '@/services/packagesService'

export async function getPackagesFeedAction(
  params: FeedParams = {}
): Promise<PackagesFeedResponse> {
  return apiFetch<PackagesFeedResponse>('/packages', {
    params: params as Record<string, string | number | boolean>,
  })
}

export async function getPackageAction(id: string): Promise<ApiPackage> {
  return apiFetch<ApiPackage>(`/packages/${id}`)
}
