import axios from 'axios'
import { Comment as PostComment, Post, Package } from '@/types/feed'

const API_URL = 'http://localhost:8080/api/v1/posts'

export const getAllPosts = async () => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('user_token') : null
  const response = await axios.get(`${API_URL}?status=all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data.data
}

export const getComments = async (id: string): Promise<PostComment[]> => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('user_token') : null
  const response = await axios.get(`${API_URL}/${id}/comments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data.data
}

export const newPost = async (postInfo: Post) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('user_token') : null
  const response = await axios.post(`${API_URL}`, postInfo, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export const toggleLike = async (postId: string): Promise<void> => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('user_token') : null

  const response = await axios.post(
    `${API_URL}/${postId}/like`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return response.data
}

export const postComment = async (
  postId: string,
  commentText: string
): Promise<PostComment> => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('user_token') : null

  const response = await axios.post(
    `${API_URL}/${postId}/comments`,
    {
      text: commentText,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}

export const getTrending = async (): Promise<Package[]> => {
  const response = await axios.get('http://localhost:8080/api/v1/packages', {
    params: {
      sort_by: 'views_count',
      order: 'desc',
      page_size: 3,
      status: 'public',
    },
  })

  return response.data.data
}
