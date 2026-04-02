import axios from 'axios'
import { Comment as PostComment, Post, Package } from '@/types/feed'

interface LikeResponse {
  liked: boolean
  message: string
}

const POSTS_ENDPOINT = '/api/feed/posts'
const PACKAGES_ENDPOINT = '/api/feed/packages/trending'

const api = axios.create({
  withCredentials: true,
})

type WrappedResponse<T> = {
  data?: T
}

const unwrapData = <T>(payload: T | WrappedResponse<T>): T => {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    (payload as WrappedResponse<T>).data !== undefined
  ) {
    return (payload as WrappedResponse<T>).data as T
  }

  return payload as T
}

export const getAllPosts = async (): Promise<Post[]> => {
  const response = await api.get<WrappedResponse<Post[]>>(
    `${POSTS_ENDPOINT}?status=all`
  )
  return unwrapData(response.data)
}

export const getComments = async (id: string): Promise<PostComment[]> => {
  const response = await api.get<WrappedResponse<PostComment[]>>(
    `${POSTS_ENDPOINT}/${id}/comments`
  )
  return unwrapData(response.data)
}

export const newPost = async (postInfo: Post | FormData): Promise<Post> => {
  const response = await api.post<Post>(POSTS_ENDPOINT, postInfo)
  return response.data
}

export const toggleLike = async (postId: string): Promise<LikeResponse> => {
  const response = await api.post<LikeResponse>(
    `${POSTS_ENDPOINT}/${postId}/like`,
    {}
  )
  return response.data
}

export const postComment = async (
  postId: string,
  commentText: string
): Promise<PostComment> => {
  const response = await api.post<PostComment>(
    `${POSTS_ENDPOINT}/${postId}/comments`,
    {
      text: commentText,
    }
  )
  return response.data
}

export const getTrending = async (): Promise<Package[]> => {
  const response = await api.get<WrappedResponse<Package[]>>(PACKAGES_ENDPOINT)
  return unwrapData(response.data)
}
