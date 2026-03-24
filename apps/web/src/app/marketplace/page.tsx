'use client';

import { useState, useEffect } from 'react';
import { MarketplaceHeader } from '../../components/marketplace/marketplace-header';
import { PackageCard } from '../../components/marketplace/package_cards';
import { Filters } from '../../components/marketplace/filters';
import { getPackagesFeed, ApiPackage } from '../../services/packagesService';

const SORT_MAP: Record<string, { sort_by: string; order: string }> = {
  featured:     { sort_by: 'rating_avg', order: 'desc' },
  'price-low':  { sort_by: 'price',      order: 'asc'  },
  'price-high': { sort_by: 'price',      order: 'desc' },
  rating:       { sort_by: 'rating_avg', order: 'desc' },
  newest:       { sort_by: 'views',      order: 'desc' },
};

const PAGE_SIZE = 9;

export default function MarketplacePage() {
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [packages, setPackages] = useState<ApiPackage[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter panel
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const { sort_by, order } = SORT_MAP[sortBy] ?? SORT_MAP['featured'];

    const params: Record<string, unknown> = {
      page: currentPage,
      page_size: PAGE_SIZE,
      sort_by,
      order,
    };

    if (selectedCategory !== 'all') params.q = selectedCategory;
    if (minPrice > 0) params.min_price = minPrice;
    if (maxPrice !== Infinity) params.max_price = maxPrice;
    if (minRating > 0) params.min_rating = minRating;

    getPackagesFeed(params)
      .then((res) => {
        setPackages(res.data);
        setTotal(res.meta.total);
      })
      .catch(() => setError('Failed to load packages. Please try again.'))
      .finally(() => setLoading(false));
  }, [sortBy, currentPage, selectedCategory, minPrice, maxPrice, minRating]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
  };

  const handleRatingChange = (rating: number) => {
    setMinRating(rating);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MarketplaceHeader
        packageCount={total}
        sortValue={sortBy}
        onSortChange={handleSortChange}
        onFilterClick={() => setFiltersOpen((prev) => !prev)}
      />

      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex gap-6 mt-6">
          {/* Left Filter Panel */}
          {filtersOpen && (
            <div className="w-64 shrink-0">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-6">
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
          )}

          {/* Right Content */}
          <div className="flex-1">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <PackageCard key={pkg.package_id} pkg={pkg} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                >
                  ‹
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
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
                  );
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
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
            <p className="text-lg text-muted-foreground">No packages available at the moment.</p>
            <p className="text-sm text-muted-foreground mt-2">Please check back later.</p>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
