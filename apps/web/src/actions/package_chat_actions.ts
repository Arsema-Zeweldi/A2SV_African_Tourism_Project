'use server'

import { apiFetch } from '@/lib/api'
import type { ActionResult } from '@/types/api'
import type { PackageChatHistoryResponse, PackageChatResponse } from '@/types/api'

export async function fetchPackageChatHistoryAction(
  packageId: string
): Promise<ActionResult<PackageChatHistoryResponse>> {
  try {
    const data = await apiFetch<PackageChatHistoryResponse>(
      `/packages/${packageId}/chat`,
      {
        params: {
          page: 1,
          page_size: 50,
        },
      }
    )
    return { success: true, data }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to fetch chat history',
    }
  }
}

export async function sendPackageChatMessageAction(
  packageId: string,
  message: string
): Promise<ActionResult<PackageChatResponse>> {
  try {
    const data = await apiFetch<PackageChatResponse>(
      `/packages/${packageId}/chat`,
      {
        method: 'POST',
        body: { message },
      }
    )
    return { success: true, data }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to send message',
    }
  }
}
