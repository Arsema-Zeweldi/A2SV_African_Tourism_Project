import axios from 'axios'
import { Comment as PostComment, Post, Package } from '@/types/feed'

const API_URL = 'http://localhost:8080/api/v1/posts'

// Create an axios instance to avoid repeating configuration
const api = axios.create({
  withCredentials: true, // Crucial: This tells the browser to send cookies
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

export const toggleLike = async (postId: string): Promise<void> => {
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
