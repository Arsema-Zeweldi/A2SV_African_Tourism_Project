'use client'

import { useRef } from 'react'
import PackageCard from '@/components/homepage/PackageCard'
import type { Package } from '@/types/feed'

interface TopRatedPackagesProps {
  packages: Package[]
}

export default function TopRatedPackages({ packages }: TopRatedPackagesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
      {/* Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Top-Rated Packages
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Curated by experts, loved by our community.
          </p>
        </div>

        {/* Navigation Arrows */}
        {packages.length > 0 && (
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => scroll('left')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-primary hover:text-primary"
              aria-label="Previous packages"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-primary hover:text-primary"
              aria-label="Next packages"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {packages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-700">No packages yet</p>
          <p className="mt-1 max-w-xs text-sm text-gray-400">
            New curated travel packages are on their way. Check back soon!
          </p>
        </div>
      ) : (
        /* Cards Carousel */
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {packages.map((pkg) => (
            <div
              key={pkg.package_id}
              className="min-w-75 sm:min-w-87.5 lg:min-w-[calc(33.333%-16px)] snap-start shrink-0"
            >
              <PackageCard package_={pkg} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
