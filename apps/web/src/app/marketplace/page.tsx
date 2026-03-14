'use client';

import { useState, useMemo } from 'react';
import { MarketplaceHeader } from '../../components/marketplace/marketplace-header';
import { PackageCard } from '../../components/marketplace/package_cards';
import { packages } from '../../lib/marketplace-data';

export default function MarketplacePage() {
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 9;

  // Sort packages
  const sortedPackages = useMemo(() => {
    let sorted = [...packages];

    // Sort packages
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      default:
        // featured - keep original order
        break;
    }

    return sorted;
  }, [sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(sortedPackages.length / packagesPerPage);
  const startIndex = (currentPage - 1) * packagesPerPage;
  const paginatedPackages = sortedPackages.slice(startIndex, startIndex + packagesPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Marketplace Header */}
      <MarketplaceHeader
        packageCount={sortedPackages.length}
        sortValue={sortBy}
        onSortChange={setSortBy}
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* Packages Grid */}
        {paginatedPackages.length > 0 ? (
          <>
            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {paginatedPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                    >
                      ‹
                    </button>

                    {/* Page numbers */}
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
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
  );
}
