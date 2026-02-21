'use client'

import { Heart, MapPin, Star, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

export interface TourismCardProps {
  id: string
  title: string
  location: string
  image: string
  price: number
  rating: number
  reviews: number
  tags: string[]
  isFavorite?: boolean
}

export function TourismCard({
  id,
  title,
  location,
  image,
  price,
  rating,
  reviews,
  tags,
  isFavorite: initialFavorite = false,
}: TourismCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)

  return (
    <div className="group relative h-80 w-full overflow-hidden rounded-3xl shadow-lg transition-transform duration-300 hover:scale-105">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        {/* Top Section - Tags and Favorite */}
        <div className="flex items-start justify-between">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Favorite Button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="rounded-full bg-white/20 p-2 backdrop-blur-md transition-all hover:bg-white/30"
          >
            <Heart
              size={20}
              className={`transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* Bottom Section - Info */}
        <div className="space-y-3">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-white">{rating}</span>
            </div>
            <span className="text-sm text-gray-200">({reviews} reviews)</span>
          </div>

          {/* Title and Location */}
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-100">
              <MapPin size={14} />
              <span>{location}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-400">${price}</span>
            <span className="text-sm text-gray-200">per person</span>
          </div>
        </div>
      </div>
    </div>
  )
}
