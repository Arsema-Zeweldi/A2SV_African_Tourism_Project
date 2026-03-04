// 'use client';

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// interface SortOptionsProps {
//   value: string;
//   onChange: (value: string) => void;
// }

// export const SORT_OPTIONS = [
//   { id: 'featured', label: 'Featured' },
//   { id: 'price-low', label: 'Price: Low to High' },
//   { id: 'price-high', label: 'Price: High to Low' },
//   { id: 'rating', label: 'Highest Rated' },
//   { id: 'newest', label: 'Newest' },
// ];

// export function SortOptions({ value, onChange }: SortOptionsProps) {
//   return (
//     <Select value={value} onValueChange={onChange}>
//       <SelectTrigger className="w-[200px]">
//         <SelectValue placeholder="Sort by" />
//       </SelectTrigger>
//       <SelectContent>
//         {SORT_OPTIONS.map((option) => (
//           <SelectItem key={option.id} value={option.id}>
//             {option.label}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   );
// }
