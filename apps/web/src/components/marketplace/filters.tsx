'use client';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'safari', label: 'Safari' },
  { id: 'beach', label: 'Beach' },
  { id: 'culture', label: 'Culture' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'extreme', label: 'Extreme' },
];

interface FiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  horizontal?: boolean;
}

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: '$1k – $2k', min: 1000, max: 2000 },
  { label: '$2k – $3k', min: 2000, max: 3000 },
  { label: '$3k+', min: 3000, max: Infinity },
];

const RATINGS = [
  { label: 'All', value: 0 },
  { label: '4+ Stars', value: 4 },
  { label: '4.5+', value: 4.5 },
  { label: '4.8+', value: 4.8 },
];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        active
          ? 'bg-primary text-white'
          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}

export function Filters({
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceChange,
  minRating,
  onRatingChange,
  horizontal = false,
}: FiltersProps) {
  const wrapperClass = horizontal ? '' : 'space-y-6';
  const chipsClass = horizontal ? 'flex flex-wrap gap-2' : 'flex flex-wrap gap-2';

  const content = (
    <>
      {/* Categories */}
      <div className={horizontal ? '' : ''}>
        <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase tracking-wider">Category</h3>
        <div className={chipsClass}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat.id}
              active={selectedCategory === cat.id}
              onClick={() => onCategoryChange(cat.id)}
            >
              {cat.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase tracking-wider">Price Range</h3>
        <div className={chipsClass}>
          {PRICE_RANGES.map((range) => (
            <Chip
              key={range.label}
              active={minPrice === range.min && maxPrice === range.max}
              onClick={() => onPriceChange(range.min, range.max)}
            >
              {range.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase tracking-wider">Rating</h3>
        <div className={chipsClass}>
          {RATINGS.map((rating) => (
            <Chip
              key={rating.label}
              active={minRating === rating.value}
              onClick={() => onRatingChange(rating.value)}
            >
              {rating.label}
            </Chip>
          ))}
        </div>
      </div>
    </>
  );

  if (horizontal) {
    // Rendered inside a parent grid-cols-3
    return content;
  }

  return <div className={wrapperClass}>{content}</div>;
}
