'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
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
        setPackages(res.data)
        setTotal(res.meta.total)
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
    <div className="min-h-screen bg-gray-50">
      <MarketplaceHeader
        packageCount={total}
        sortValue={sortBy}
        onSortChange={handleSortChange}
        onFilterClick={() => setFiltersOpen((prev) => !prev)}
      />

      <div className="max-w-6xl mx-auto px-4 pb-12">
        {filtersOpen ? (
          <button
            type="button"
            aria-label="Close filters"
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setFiltersOpen(false)}
          />
        ) : null}

        <div className="mt-6 flex gap-6">
          {/* Retractable Filter Sidebar */}
          <div
            className={`hidden overflow-hidden transition-[width] duration-200 lg:block ${
              filtersOpen ? 'lg:w-[290px] lg:shrink-0' : 'lg:w-0'
            }`}
          >
            <aside className="lg:sticky lg:top-6 lg:h-fit lg:w-[290px] lg:self-start lg:rounded-2xl lg:border lg:border-gray-200 lg:bg-white lg:shadow-sm">
              <div className="h-full overflow-y-auto p-6 lg:h-auto">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
                  <p className="text-xs text-gray-500">Refine your package list</p>
                </div>
                <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-0 lg:border-0 lg:p-0 lg:shadow-none">
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
              </div>
            </aside>
          </div>

          <aside
            className={`fixed inset-y-0 left-0 z-50 w-[290px] bg-white transition-transform duration-200 lg:hidden ${
              filtersOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
                <p className="text-xs text-gray-500">Refine your package list</p>
              </div>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
                aria-label="Close filters"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="h-full overflow-y-auto p-6">
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

          {/* Right Content */}
          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-lg text-red-500">{error}</p>
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
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No packages available at the moment.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please check back later.
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
