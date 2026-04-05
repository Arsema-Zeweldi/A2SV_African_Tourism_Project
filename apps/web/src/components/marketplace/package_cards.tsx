'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ApiPackage } from '../../services/packagesService'
import { useMarketplace } from '../../context/marketplace-context'
import { Heart, MapPin, Clock } from 'lucide-react'
import { getFallbackImage } from '@/lib/fallback-images'

interface PackageCardProps {
  pkg: ApiPackage
}

const CATEGORY_LABELS: Record<string, string> = {
  safari: 'SAFARI',
  beach: 'COASTAL',
  cultural: 'HERITAGE',
  adventure: 'ADVENTURE',
  extreme: 'LUXURY',
  photography: 'PHOTOGRAPHY',
  luxury: 'LUXURY',
}

export function PackageCard({ pkg }: PackageCardProps) {
  const { toggleWishlist, isInWishlist } = useMarketplace()
  const inWishlist = isInWishlist(pkg.package_id)

  const fallbackImg = getFallbackImage(pkg.package_id || pkg.title)
  const [imgSrc, setImgSrc] = useState(pkg.image_url || fallbackImg)
  const location = pkg.location || pkg.country || 'Africa'
  const duration = pkg.duration_days ? `${pkg.duration_days} Days` : null
  const badge = pkg.category ? (CATEGORY_LABELS[pkg.category] || pkg.category.toUpperCase()) : null

  return (
    <div className="group overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image */}
      <div className="relative overflow-hidden h-52 w-full">
        <Image
          src={imgSrc}
          alt={pkg.title}
          onError={() => setImgSrc(fallbackImg)}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Category badge */}
        {badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-white text-[10px] font-bold rounded-md uppercase tracking-wide">
            {badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(pkg) }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            inWishlist
              ? 'bg-primary text-white'
              : 'bg-white/80 backdrop-blur-sm text-gray-500 hover:bg-white hover:text-primary'
          }`}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex gap-px">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                viewBox="0 0 20 20"
                className={`h-3.5 w-3.5 ${i < Math.round(pkg.rating_avg ?? 0) ? 'text-primary' : 'text-gray-200'}`}
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium">
            ({(pkg.rating_avg ?? 0).toFixed(1)})
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-gray-900 leading-snug line-clamp-2 mb-1.5">
          {pkg.title}
        </h3>

        {/* Description */}
        {(pkg.summary || pkg.description) && (
          <p className="text-[13px] text-gray-400 leading-relaxed line-clamp-2 mb-3">
            {pkg.summary || pkg.description}
          </p>
        )}

        {/* Duration & Location */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          {duration && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {duration}
            </span>
          )}
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            <span className="truncate max-w-[140px]">{location}</span>
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-end justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
              Per Person
            </p>
            <p className="text-xl font-bold text-primary leading-tight">
              {pkg.currency || 'USD'} {pkg.price?.toLocaleString()}
            </p>
          </div>
          <Link
            href={`/package-details/${pkg.package_id}`}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
