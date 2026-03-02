import React from 'react'
import { trendingPackages } from '@/app/feed/data'
import Image from 'next/image'

const TrendingNow = () => {
  const formatCount = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
    }
    return num.toString()
  }

  return (
    <div className="p-5">
      <div className="flex flex-col gap-4">
        {trendingPackages.map((pkg) => (
          <a
            key={pkg.id}
            className="flex items-center gap-3 group"
            href={`/packages/${pkg.id}`}
          >
            <div className="relative size-12 rounded-lg overflow-hidden shrink-0 group-hover:brightness-110 transition-all shadow-sm">
              <Image
                src={pkg.image || '/placeholder.png'}
                alt={pkg.packageName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                {pkg.packageName}
              </span>
              <span className="text-xs text-text-muted">
                {formatCount(pkg.activeTravelers)} active travelers
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default TrendingNow
