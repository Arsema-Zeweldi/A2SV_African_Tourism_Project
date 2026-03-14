'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface SortOptionsProps {
  value: string;
  onChange: (value: string) => void;
}

export const SORT_OPTIONS = [
  { id: 'featured', label: 'Most Popular' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'newest', label: 'Newest' },
];

export function SortOptions({ value, onChange }: SortOptionsProps) {
  const getCurrentLabel = () => {
    const option = SORT_OPTIONS.find(opt => opt.id === value);
    return option ? option.label : 'Most Popular';
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Sort by:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-45">
          <SelectValue>
            {getCurrentLabel()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
