import { apiFetch } from '@/lib/api'
import type { PackageResponse, PackagesFeedResponse } from '@/types/api'
import type { Post } from '@/types/feed'
import { fetchRecentPosts } from '@/services/homeService'
import { PackageCardData, CommunityPostData } from '@/types/homepage'

export const topRatedPackages: PackageCardData[] = [
  {
    id: 'serengeti-safari',
    title: 'Serengeti Safari',
    location: 'Tanzania',
    image: '/homepage/top_rated3.png',
    rating: 4.8,
    reviewCount: 245,
    price: 2400,
    currency: '$',
    duration: '7 Days',
    category: 'Safari',
    groupSize: 'Family',
  },
  {
    id: 'cape-town-coastal',
    title: 'Cape Town Coastal',
    location: 'South Africa',
    image: '/homepage/top_rated2.png',
    rating: 4.7,
    reviewCount: 189,
    price: 1899,
    currency: '$',
    duration: '5 Days',
    category: 'Coastal',
    groupSize: 'Couples',
  },
  {
    id: 'victoria-falls-expedition',
    title: 'Victoria Falls Expedition',
    location: 'Zimbabwe',
    image: '/homepage/top_rated1.png',
    rating: 4.9,
    reviewCount: 312,
    price: 1350,
    currency: '$',
    duration: '4 Days',
    category: 'Adventure',
    groupSize: 'Group',
  },
  {
    id: 'okavango-delta-explorer',
    title: 'Okavango Delta Explorer',
    location: 'Botswana',
    image: '/homepage/top_rated3.png',
    rating: 4.9,
    reviewCount: 156,
    price: 3200,
    currency: '$',
    duration: '6 Days',
    category: 'Safari',
    groupSize: 'Couples',
  },
  {
    id: 'marrakech-medina-tour',
    title: 'Marrakech Medina Tour',
    location: 'Morocco',
    image: '/homepage/top_rated2.png',
    rating: 4.6,
    reviewCount: 420,
    price: 850,
    currency: '$',
    duration: '3 Days',
    category: 'Culture',
    groupSize: 'Group',
  },
  {
    id: 'mount-kilimanjaro-trek',
    title: 'Mount Kilimanjaro Trek',
    location: 'Tanzania',
    image: '/homepage/top_rated1.png',
    rating: 4.8,
    reviewCount: 278,
    price: 2100,
    currency: '$',
    duration: '8 Days',
    category: 'Adventure',
    groupSize: 'Group',
  },
]

// {
//   id: 'post-1',
//   author: {
//     name: 'Sarah Jenkins',
//     avatar: '/homepage/community3.png',
//   },
//   timeAgo: '2 hours ago',
//   image: '/homepage/community3.png',
//   description:
//     'Unreal experience spotting this beauty on our morning drive in Chobe National Park. Truly breathtaking!',
//   likes: 1200,
//   comments: 42,
//   shares: 45,
// },
// {
//   id: 'post-2',
//   author: {
//     name: 'Marcus Chen',
//     avatar: '/homepage/community2.png',
//   },
//   timeAgo: 'Yesterday',
//   image: '/homepage/community2.png',
//   description:
//     'Learning about Masai traditions was the highlight of our trip. Such a rich and welcoming culture.',
//   likes: 856,
//   comments: 12,
//   shares: 67,
// },
// {
//   id: 'post-3',
//   author: {
//     name: 'Elena Rodriguez',
//     avatar: '/homepage/community1.png',
//   },
//   timeAgo: '3 days ago',
//   image: '/homepage/community1.png',
//   description:
//     "Who knew glamping could be this luxurious? Waking up to the sounds of the savanna is something I'll never forget. ✨",
//   likes: 2100,
//   comments: 56,
//   shares: 34,
// },

export const navLinks = [
  { label: 'Home', href: '/', active: true },
  { label: 'Marketplace', href: '/marketplace', active: false },
  { label: 'My Packages', href: '/my-packages', active: false },
  { label: 'My Trips', href: '/my-trips', active: false },
  { label: 'Feed', href: '/feed', active: false },
]

const FALLBACK_PACKAGE_IMAGE = '/images/African-Safari-Sunset.png'
const FALLBACK_POST_IMAGE = '/images/community-feed.png'
const FALLBACK_AVATAR = '/images/user-icon.png'

const formatRelativeTime = (value?: string) => {
  if (!value) return 'Recently'

  const timestamp = new Date(value)
  const diffMs = Date.now() - timestamp.getTime()
  const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)))

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`

  return timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

const toTitleCase = (value?: string) =>
  value
    ? value
        .split(/[\s_-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    : 'Adventure'

const mapTopRatedPackage = (pkg: PackageResponse): PackageCardData => ({
  id: pkg.package_id,
  title: pkg.title,
  location: [pkg.location, pkg.country].filter(Boolean).join(', '),
  image: pkg.image_url || FALLBACK_PACKAGE_IMAGE,
  rating: Number(pkg.rating_avg?.toFixed(1) ?? 0),
  reviewCount: pkg.reviews_count ?? 0,
  price: pkg.price,
  currency: pkg.currency === 'USD' ? '$' : `${pkg.currency ?? '$'} `,
  duration: pkg.duration_days > 0 ? `${pkg.duration_days} Days` : 'Flexible',
  category: toTitleCase(pkg.category),
  groupSize: pkg.group_size || 'Group',
})

const mapCommunityPost = (post: Post): CommunityPostData => ({
  id: post.post_id ?? post.created_at ?? post.content.slice(0, 20),
  author: {
    name: post.user_name || 'Traveler',
    avatar: post.user_avatar || FALLBACK_AVATAR,
  },
  timeAgo: formatRelativeTime(post.created_at),
  image: post.media_url || FALLBACK_POST_IMAGE,
  description: post.content,
  likes: post.likes_count ?? 0,
  comments: post.comments_count ?? 0,
  shares: 0,
})

export const communityPosts: CommunityPostData[] = (await fetchRecentPosts()).map(
  mapCommunityPost
)

export async function getHomePageData() {
  try {
    const [packagesResponse, postsResponse] = await Promise.all([
      apiFetch<PackagesFeedResponse>(
        '/packages?sort_by=rating_avg&order=desc&page_size=6&status=public'
      ),
      fetchRecentPosts(),
    ])

    return {
      topRatedPackages: packagesResponse.data.map(mapTopRatedPackage),
      communityPosts: postsResponse.slice(0, 3).map(mapCommunityPost),
    }
  } catch {
    return {
      topRatedPackages,
      communityPosts,
    }
  }
}
