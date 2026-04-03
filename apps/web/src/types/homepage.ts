export interface PackageCardData {
  package_id: string
  title: string
  location: string
  image_url: string
  rating_avg: number
  reviews_count: number
  price: number
  currency: string
  duration_days: number
  category: string
  group_size: string
}

export interface CommunityPostData {
  id: string
  author: {
    name: string
    avatar: string
  }
  timeAgo: string
  image: string
  description: string
  likes: number
  comments: number
  shares: number
}
