'use server'

import { apiFetch as api } from '@/lib/api'
import type { PackageChatHistoryResponse, PackageChatResponse } from '@/types/api'

export async function fetchPackageChatHistoryAction(
  packageId: string
): Promise<PackageChatHistoryResponse> {
  return api<PackageChatHistoryResponse>(`/packages/${packageId}/chat`, {
    params: {
      page: 1,
      page_size: 50,
    },
  })
}

export async function sendPackageChatMessageAction(
  packageId: string,
  message: string
): Promise<PackageChatResponse> {
  return api<PackageChatResponse>(`/packages/${packageId}/chat`, {
    method: 'POST',
    body: { message },
  })
}
