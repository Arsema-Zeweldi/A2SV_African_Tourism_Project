export interface Post {
  post_id?: string
  user_id?: string
  user_name?: string
  user_avatar?: string
  content: string
  media_url: string
  media_type: string | null
  location: string
  package_name: string
  likes_count?: number
  comments_count?: number
  created_at?: string
  liked?: boolean
  tags?: []
}

export interface Comment {
  comment_id: string
  post_id: string
  user_id: string
  user_name: string
  user_avatar: string
  text: string
  created_at: string
}

export interface Package {
  package_id: string
  creator_id: string
  itinerary_id: string
  title: string
  summary: string
  price: number
  status: string
  rating_avg: number
  reviews_count: number
  views_count: number
  country: string
  location: string
  currency: string
  image_url: string
  duration_days: number
  category: string
  group_size: string
  created_at: string
}
