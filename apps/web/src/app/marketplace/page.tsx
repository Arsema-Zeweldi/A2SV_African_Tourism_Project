'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { X, WifiOff, RefreshCcw } from 'lucide-react'
import { getPackagesFeedAction } from '@/actions/marketplace_actions'
import { MarketplaceHeader } from '../../components/marketplace/marketplace-header'
import { PackageCard } from '../../components/marketplace/package_cards'
import { Filters } from '../../components/marketplace/filters'
import type { ApiPackage } from '../../services/packagesService'

const SORT_MAP: Record<string, { sort_by: string; order: string }> = {
  featured: { sort_by: 'rating_avg', order: 'desc' },
  'price-low': { sort_by: 'price', order: 'asc' },
  'price-high': { sort_by: 'price', order: 'desc' },
  rating: { sort_by: 'rating_avg', order: 'desc' },
  newest: { sort_by: 'views', order: 'desc' },
}

const PAGE_SIZE = 9

function MarketplaceContent() {
  const searchParams = useSearchParams()

  const [sortBy, setSortBy] = useState('featured')
  const [currentPage, setCurrentPage] = useState(1)
  const [packages, setPackages] = useState<ApiPackage[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter panel — pre-filled from URL query params (e.g. coming from Plan Your Trip)
  const [filtersOpen, setFiltersOpen] = useState(() => {
    return (
      !!searchParams.get('q') ||
      !!searchParams.get('min_price') ||
      !!searchParams.get('max_price') ||
      !!searchParams.get('min_rating')
    )
  })
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('q') || 'all'
  )
  const [minPrice, setMinPrice] = useState(
    Number(searchParams.get('min_price')) || 0
  )
  const [maxPrice, setMaxPrice] = useState(
    Number(searchParams.get('max_price')) || Infinity
  )
  const [minRating, setMinRating] = useState(
    Number(searchParams.get('min_rating')) || 0
  )

  useEffect(() => {
    setLoading(true)
    setError(null)

    const { sort_by, order } = SORT_MAP[sortBy] ?? SORT_MAP['featured']

    const params: Record<string, unknown> = {
      page: currentPage,
      page_size: PAGE_SIZE,
      sort_by,
      order,
    }

    if (selectedCategory !== 'all') params.q = selectedCategory
    if (minPrice > 0) params.min_price = minPrice
    if (maxPrice !== Infinity) params.max_price = maxPrice
    if (minRating > 0) params.min_rating = minRating

    getPackagesFeedAction(params)
      .then((res) => {
        if (!res.success) {
          setError(res.error)
          return
        }
        setPackages(res.data.data)
        setTotal(res.data.meta.total)
      })
      .catch(() => setError('Failed to load packages. Please try again.'))
      .finally(() => setLoading(false))
  }, [sortBy, currentPage, selectedCategory, minPrice, maxPrice, minRating])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min)
    setMaxPrice(max)
    setCurrentPage(1)
  }

  const handleRatingChange = (rating: number) => {
    setMinRating(rating)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketplaceHeader
        packageCount={total}
        sortValue={sortBy}
        onSortChange={handleSortChange}
        onFilterClick={() => setFiltersOpen((prev) => !prev)}
      />

      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* ── Filter panel (dropdown, no layout shift) ── */}
        {filtersOpen && (
          <>
            {/* Backdrop on mobile */}
            <button
              type="button"
              aria-label="Close filters"
              className="fixed inset-0 z-40 bg-black/20 lg:hidden"
              onClick={() => setFiltersOpen(false)}
            />

            {/* Mobile drawer */}
            <aside className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-xl lg:hidden overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <h2 className="text-sm font-bold text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                  aria-label="Close filters"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5">
                <Filters
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onPriceChange={handlePriceChange}
                  minRating={minRating}
                  onRatingChange={handleRatingChange}
                />
              </div>
            </aside>

            {/* Desktop dropdown panel */}
            <div className="hidden lg:block mt-4 rounded-xl border border-gray-100 bg-white shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900">Filter Packages</h2>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="text-xs font-medium text-gray-400 hover:text-gray-600 flex items-center gap-1"
                >
                  <X size={12} /> Close
                </button>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <Filters
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onPriceChange={handlePriceChange}
                  minRating={minRating}
                  onRatingChange={handleRatingChange}
                  horizontal
                />
              </div>
            </div>
          </>
        )}

        {/* ── Package grid ── */}
        <div className="mt-6">
          <div className="min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl border border-gray-100 bg-white overflow-hidden">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 w-3/4 rounded bg-gray-200" />
                      <div className="h-3 w-1/2 rounded bg-gray-100" />
                      <div className="h-3 w-1/3 rounded bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                  <WifiOff className="h-6 w-6 text-red-400" />
                </div>
                <p className="text-lg font-semibold text-gray-800">Something went wrong</p>
                <p className="mt-1 max-w-xs text-sm text-gray-500">{error}</p>
                <button
                  onClick={() => { setError(null); setCurrentPage(1) }}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                >
                  <RefreshCcw size={15} />
                  Try again
                </button>
              </div>
            ) : packages.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                  {packages.map((pkg) => (
                    <PackageCard key={pkg.package_id} pkg={pkg} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                    >
                      ‹
                    </button>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg border ${
                            currentPage === pageNum
                              ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
                              : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}

                    {totalPages > 5 && (
                      <>
                        <span className="px-2 text-gray-500">...</span>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className={`px-4 py-2 rounded-lg border ${
                            currentPage === totalPages
                              ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
                              : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400"><path d="m21 21-6.05-6.05m0 0a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9Z" /></svg>
                </div>
                <p className="text-lg font-semibold text-gray-700">
                  No packages found
                </p>
                <p className="mt-1 max-w-xs text-sm text-gray-400">
                  Try adjusting your filters or check back later for new adventures.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  )
}
