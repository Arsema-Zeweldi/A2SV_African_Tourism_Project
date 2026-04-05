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

/**
 * Returns the image URL if it looks valid, otherwise a deterministic fallback.
 */
export function safeImageUrl(
  url: string | null | undefined,
  seed: string
): string {
  if (url && url.length > 0 && url !== 'string' && !url.includes('placeholder')) {
    return url
  }
  return getFallbackImage(seed)
}
