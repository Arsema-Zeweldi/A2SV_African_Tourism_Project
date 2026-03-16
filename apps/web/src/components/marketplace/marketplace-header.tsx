'use client';

import { SlidersHorizontal } from 'lucide-react';
import { SortOptions } from './sort_options';

interface MarketplaceHeaderProps {
  packageCount?: number;
  sortValue?: string;
  onSortChange?: (value: string) => void;
  onFilterClick?: () => void;
}

export function MarketplaceHeader({
  packageCount = 124,
  sortValue = 'featured',
  onSortChange,
  onFilterClick
}: MarketplaceHeaderProps) {

  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Filter Button */}
            <button
              onClick={onFilterClick}
              className="flex items-center justify-center w-11 h-11 bg-orange-500 hover:bg-orange-600 rounded-full transition-colors"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="h-5 w-5 text-white" />
            </button>

            {/* Title Area */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Discovery <span className="text-orange-500">Africa</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {packageCount} premium packages found for your criteria
              </p>
            </div>
          </div>

          {/* Right Section: Sort Control */}
          <SortOptions value={sortValue} onChange={onSortChange || (() => {})} />
        </div>
      </div>
    </div>
  );
}