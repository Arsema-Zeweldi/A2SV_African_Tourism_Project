import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Package } from '@/types/feed'
import { FaStar } from 'react-icons/fa'
import { getTrending } from '@/services/feedServices'

const TrendingNow = () => {
  const [trendingPackages, setTrendingPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getTrending()
        setTrendingPackages(data)
      } catch {
        // Silently fail — trending is non-critical sidebar content
      } finally {
        setIsLoading(false)
      }
    }

    fetchPackages()
  }, [])

  if (isLoading) {
    return (
      <div className="p-5 flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="size-12 rounded-lg bg-gray-200 shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-3.5 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/3 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (trendingPackages.length === 0) {
    return (
      <div className="p-5 text-center">
        <p className="text-sm text-gray-400">No trending packages right now.</p>
      </div>
    )
  }

  return (
    <div className="p-5">
      <div className="flex flex-col gap-4">
        {trendingPackages.map((pkg) => (
          <a
            key={pkg.package_id}
            className="flex items-center gap-3 group"
            href={`/package-details/${pkg.package_id}`}
          >
            <div className="relative size-12 rounded-lg overflow-hidden shrink-0 group-hover:brightness-110 transition-all shadow-sm">
              <Image
                src={pkg.image_url || '/images/placeholder-package.png'}
                alt={pkg.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                {pkg.title}
              </span>
              <span className="text-xs text-text-muted flex items-center gap-1">
                {pkg.rating_avg} <FaStar className="text-amber-400" size={10} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default TrendingNow
