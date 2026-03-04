// 'use client';

// import { Button } from '@/components/ui/button';
// import { CATEGORIES } from '@/lib/marketplace-data';

// interface FiltersProps {
//   selectedCategory: string;
//   onCategoryChange: (category: string) => void;
//   minPrice: number;
//   maxPrice: number;
//   onPriceChange: (min: number, max: number) => void;
//   minRating: number;
//   onRatingChange: (rating: number) => void;
// }

// const PRICE_RANGES = [
//   { label: 'All Prices', min: 0, max: Infinity },
//   { label: '$1,000 - $2,000', min: 1000, max: 2000 },
//   { label: '$2,000 - $3,000', min: 2000, max: 3000 },
//   { label: '$3,000+', min: 3000, max: Infinity },
// ];

// const RATINGS = [
//   { label: 'All Ratings', value: 0 },
//   { label: '4+ Stars', value: 4 },
//   { label: '4.5+ Stars', value: 4.5 },
//   { label: '4.8+ Stars', value: 4.8 },
// ];

// export function Filters({
//   selectedCategory,
//   onCategoryChange,
//   minPrice,
//   maxPrice,
//   onPriceChange,
//   minRating,
//   onRatingChange,
// }: FiltersProps) {
//   return (
//     <div className="space-y-6">
//       {/* Categories */}
//       <div>
//         <h3 className="font-semibold mb-3 text-sm">Category</h3>
//         <div className="space-y-2">
//           {CATEGORIES.map((cat) => (
//             <Button
//               key={cat.id}
//               onClick={() => onCategoryChange(cat.id)}
//               variant={selectedCategory === cat.id ? 'default' : 'outline'}
//               className="w-full justify-start"
//             >
//               {cat.label}
//             </Button>
//           ))}
//         </div>
//       </div>

//       {/* Price Range */}
//       <div>
//         <h3 className="font-semibold mb-3 text-sm">Price Range</h3>
//         <div className="space-y-2">
//           {PRICE_RANGES.map((range) => (
//             <Button
//               key={range.label}
//               onClick={() => onPriceChange(range.min, range.max)}
//               variant={
//                 minPrice === range.min && maxPrice === range.max ? 'default' : 'outline'
//               }
//               className="w-full justify-start text-sm"
//             >
//               {range.label}
//             </Button>
//           ))}
//         </div>
//       </div>

//       {/* Rating */}
//       <div>
//         <h3 className="font-semibold mb-3 text-sm">Rating</h3>
//         <div className="space-y-2">
//           {RATINGS.map((rating) => (
//             <Button
//               key={rating.label}
//               onClick={() => onRatingChange(rating.value)}
//               variant={minRating === rating.value ? 'default' : 'outline'}
//               className="w-full justify-start text-sm"
//             >
//               {rating.label}
//             </Button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
