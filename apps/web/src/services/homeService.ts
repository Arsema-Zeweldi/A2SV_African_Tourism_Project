'use server'

import { apiFetch as api } from '@/lib/api'
import type { Post } from '@/types/feed'
import type { Package } from '@/types/feed'

type PostsResponse = {
  data: Post[]
  meta: {
    page: number
    page_size: number
    total: number
  }
}

type PackagesResponse = {
  data: Package[]
  meta: {
    page: number
    page_size: number
    total: number
  }
}

export const fetchRecentPosts = async (): Promise<Post[]> => {
  try {
    const response = await api<PostsResponse>('/posts', {
      params: {
        page: 1,
        page_size: 3,
        status: 'public',
        sort_by: 'created_at',
        order: 'desc',
      },
    })

    return response.data
  } catch {
    return []
  }
}
export const getTrending = async (): Promise<Package[]> => {
  try {
    const response = await api<PackagesResponse>('/packages', {
      params: {
        sort_by: 'views_count',
        order: 'desc',
        page_size: 3,
        status: 'public',
      },
    })

    return response.data
  } catch {
    return []
  }
}
