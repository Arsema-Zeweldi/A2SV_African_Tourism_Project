import axios from 'axios'
import { Comment as PostComment, Post, Package } from '@/types/feed'

interface LikeResponse {
  liked: boolean
  message: string
}

const API_URL = 'http://localhost:8080/api/v1/posts'

const api = axios.create({
  withCredentials: true,
})

export const getAllPosts = async () => {
  const response = await api.get(`${API_URL}?status=all`)
  return response.data.data
}

export const getComments = async (id: string): Promise<PostComment[]> => {
  const response = await api.get(`${API_URL}/${id}/comments`)
  return response.data.data
}

export const newPost = async (postInfo: Post) => {
  const response = await api.post(`${API_URL}`, postInfo)
  return response.data
}

export const toggleLike = async (postId: string): Promise<LikeResponse> => {
  const response = await api.post(`${API_URL}/${postId}/like`, {})
  return response.data
}

export const postComment = async (
  postId: string,
  commentText: string
): Promise<PostComment> => {
  const response = await api.post(`${API_URL}/${postId}/comments`, {
    text: commentText,
  })
  return response.data
}

export const getTrending = async (): Promise<Package[]> => {
  const response = await api.get('http://localhost:8080/api/v1/packages', {
    params: {
      sort_by: 'views_count',
      order: 'desc',
      page_size: 3,
      status: 'public',
    },
  })
  return response.data.data
}
