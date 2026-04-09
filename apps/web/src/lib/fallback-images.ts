/**
 * Pool of local African-themed images used as fallbacks
 * when backend image URLs fail or are missing.
 */
const FALLBACK_POOL = [
  '/images/elephant.png',
  '/images/ocean.png',
  '/images/island.png',
  '/images/village.png',
  '/images/desert.png',
  '/images/waterfall.png',
  '/images/lion.png',
  '/images/masai.webp',
  '/images/nakuru.jpg',
  '/images/okavango-delta.jpg',
  '/images/atlas_mount.jpg',
  '/images/capeTown.jpg',
  '/images/cairoPyramid.jpg',
  '/images/namibDesert.jpg',
  '/images/laibela.jpeg',
  '/images/victoiafalls.jpg',
  '/images/Gorilla_National_Park_019.jpg',
]

export const TRIP_IMAGES = [
  'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80',
  'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&q=80',
  'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=400&q=80',
  'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&q=80',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
]

const RAW_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const BACKEND_ORIGIN = RAW_API_URL
  ? RAW_API_URL.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')
  : ''

/**
 * Returns a deterministic fallback image based on a seed string (e.g. package ID, title).
 * Same seed always returns the same image — no layout shift on re-renders.
 */
export function getFallbackImage(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  const index = Math.abs(hash) % FALLBACK_POOL.length
  return FALLBACK_POOL[index]
}

export function getTripImage(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  const index = Math.abs(hash) % TRIP_IMAGES.length
  return TRIP_IMAGES[index]
}

/**
 * Returns the image URL if it looks valid, otherwise a deterministic fallback.
 */
export function safeImageUrl(
  url: string | null | undefined,
  seed: string
): string {
  const normalized = url?.trim()
  if (
    normalized &&
    normalized !== 'string' &&
    !normalized.includes('placeholder')
  ) {
    if (/^https?:\/\//i.test(normalized)) {
      return normalized
    }
    if (normalized.startsWith('//')) {
      return `https:${normalized}`
    }
    if (normalized.startsWith('/images/')) {
      return normalized
    }
    if (BACKEND_ORIGIN) {
      return `${BACKEND_ORIGIN}/${normalized.replace(/^\/+/, '')}`
    }
    if (normalized.startsWith('/')) {
      return normalized
    }
    return `/${normalized}`
  }
  return getFallbackImage(seed)
}
