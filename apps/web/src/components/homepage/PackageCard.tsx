import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Package } from '@/types/feed'
import { Star, Clock, Users, MapPin, Trees } from 'lucide-react'
import { getFallbackImage } from '@/lib/fallback-images'

interface PackageCardProps {
  package_: Package
}

const CATEGORY_STYLE: Record<string, string> = {
  safari: 'bg-[#4a6741] text-white',
  coastal: 'bg-[#5D8AA8] text-white',
  adventure: 'bg-primary text-white',
  beach: 'bg-[#5D8AA8] text-white',
  cultural: 'bg-[#9CA389] text-white',
  extreme: 'bg-[#C17C5F] text-white',
}

export default function PackageCard({ package_: pkg }: PackageCardProps) {
  const [imgError, setImgError] = useState(false)
  const categoryStyle = CATEGORY_STYLE[pkg.category?.toLowerCase()] || 'bg-white/90 text-gray-800'
  const fallback = getFallbackImage(pkg.package_id || pkg.title)

  return (
    <Link
      href={`/package-details/${pkg.package_id}`}
      className="group relative flex h-[400px] w-full flex-shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imgError ? fallback : (pkg.image_url || fallback)}
          alt={pkg.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
          onError={() => setImgError(true)}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* Rating badge */}
      <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 shadow-sm">
        <Star className="h-3 w-3 fill-primary text-primary" />
        <span className="text-xs font-bold text-gray-900">
          {pkg.rating_avg?.toFixed(1) || '0.0'}
        </span>
        {pkg.reviews_count > 0 && (
          <span className="text-[10px] text-gray-400">({pkg.reviews_count})</span>
        )}
      </div>

      {/* Bottom content */}
      <div className="relative mt-auto flex flex-col gap-3 p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {pkg.category && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${categoryStyle}`}>
              <Trees className="h-3 w-3" />
              {pkg.category}
            </span>
          )}
          {pkg.duration_days > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-gray-800 backdrop-blur-sm">
              <Clock className="h-3 w-3" />
              {pkg.duration_days} Days
            </span>
          )}
          {pkg.group_size && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-gray-800 backdrop-blur-sm">
              <Users className="h-3 w-3" />
              {pkg.group_size}
            </span>
          )}
        </div>

        {/* Title + Price row */}
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-bold leading-tight text-white line-clamp-2 sm:text-xl">
              {pkg.title}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-white/70">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate text-xs font-medium">{pkg.location || pkg.country}</span>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <span className="block text-[9px] font-medium uppercase tracking-wide text-white/60">
              From
            </span>
            <span className="text-lg font-bold text-primary sm:text-xl">
              {pkg.currency || 'USD'} {pkg.price?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
