'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ApiPackage } from '../../services/packagesService'
import { useMarketplace } from '../../context/marketplace-context'
import { Heart, MapPin, Calendar } from 'lucide-react'

interface PackageCardProps {
  pkg: ApiPackage
}

export function PackageCard({ pkg }: PackageCardProps) {
  const { toggleWishlist, isInWishlist } = useMarketplace()
  const inWishlist = isInWishlist(pkg.package_id)

  const getCategoryBadgeText = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      safari: 'SAFARI BEST',
      beach: 'COASTAL',
      cultural: 'HERITAGE',
      adventure: 'ECO-ADVENTURE',
      extreme: 'LUXURY',
      photography: 'PHOTOGRAPHY',
    }
    return categoryMap[category] || category.toUpperCase()
  }

  const [imgSrc, setImgSrc] = useState(pkg.image_url || '/images/lion.png')
  const location = pkg.location || pkg.country || 'Africa'
  const duration = pkg.duration_days ? `${pkg.duration_days} days` : 'N/A'

  return (
    <div className="overflow-hidden rounded-4xl bg-white border border-gray-200 hover:shadow-xl transition-shadow">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-muted h-64 w-full group">
        <Image
          src={imgSrc}
          alt={pkg.title}
          onError={() => setImgSrc('/images/lion.png')}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Category Badge */}
        {pkg.category && (
          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
              {getCategoryBadgeText(pkg.category)}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(pkg)}
          className={`absolute top-4 right-4 p-2.5 rounded-full transition-colors ${
            inWishlist
              ? 'bg-primary text-primary-foreground'
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4">
        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg ${i < Math.round(pkg.rating_avg) ? 'text-primary' : 'text-muted'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            ({pkg.rating_avg.toFixed(1)})
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg leading-tight line-clamp-2">
          {pkg.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {pkg.summary || pkg.description}
        </p>

        {/* Duration & Location */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>

        {/* Price & Button */}
        <div className="flex items-end justify-between gap-4 pt-2 border-t border-border">
          <div className="pt-2">
            <p className="text-xs text-muted-foreground font-medium">
              PER PERSON
            </p>
            <p className="text-2xl font-bold text-primary">
              {pkg.currency || '$'}
              {pkg.price.toLocaleString()}
            </p>
          </div>
          <Link
            href={`/package-details/${pkg.package_id}`}
            className="bg-[#221810] hover:bg-foreground/90 text-background px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
