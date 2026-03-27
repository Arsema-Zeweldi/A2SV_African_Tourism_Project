import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Package } from '@/types/feed'
import { FaStar } from 'react-icons/fa'
import { getTrending } from '@/services/feedServices'

const TrendingNow = () => {
  const [trendingPackages, setTrendingPackages] = useState<Package[]>([])

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getTrending()
        setTrendingPackages(data)
      } catch (error) {
        console.error('Failed to fetch packages:', error)
      }
    }

    fetchPackages()
  }, [])

  // const formatCount = (num: number): string => {
  //   if (num >= 1000) {
  //     return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  //   }
  //   return num.toString()
  // }

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
                src={pkg.image_url || '/placeholder.png'}
                alt={pkg.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                {pkg.title}
              </span>
              <span className="text-xs text-text-muted flex gap-3">
                {pkg.rating_avg} <FaStar className="text-amber-400" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default TrendingNow
