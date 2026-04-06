'use client';

import { Search, X } from 'lucide-react';
import { CATEGORY_TREE } from '@/lib/utils/constants';

const PRICE_RANGES = [
  { label: 'Under GH₵ 200', min: 0, max: 20000 },
  { label: 'GH₵ 200 – 500', min: 20000, max: 50000 },
  { label: 'GH₵ 500 – 1,000', min: 50000, max: 100000 },
  { label: 'GH₵ 1,000 – 2,500', min: 100000, max: 250000 },
  { label: 'GH₵ 2,500+', min: 250000, max: undefined },
];

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  selectedSubcategories: string[];
  onSubcategoriesChange: (subcategories: string[]) => void;
  priceRange: { min?: number; max?: number } | null;
  onPriceRangeChange: (range: { min?: number; max?: number } | null) => void;
  inStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
  hideInStock?: boolean;
  hideCategories?: boolean;
  shippingMethod?: string | null;
  onShippingMethodChange?: (method: string | null) => void;
}

export function ProductFilters({
  search,
  onSearchChange,
  selectedCategories,
  onCategoriesChange,
  selectedSubcategories,
  onSubcategoriesChange,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockChange,
  shippingMethod,
  onShippingMethodChange,
}: ProductFiltersProps) {
  // Build active filter tags
  const tags: { label: string; onRemove: () => void }[] = [];

  // Category tags
  for (const catValue of selectedCategories) {
    const cat = CATEGORY_TREE.find((c) => c.value === catValue);
    if (cat) {
      tags.push({
        label: cat.label,
        onRemove: () => {
          onCategoriesChange(selectedCategories.filter((c) => c !== catValue));
          // Clear subcategories belonging to this category
          const catSubs = cat.subcategories?.map((s) => s.value) ?? [];
          onSubcategoriesChange(selectedSubcategories.filter((s) => !catSubs.includes(s)));
        },
      });
    }
  }

  // Subcategory tags
  for (const subValue of selectedSubcategories) {
    const allSubs = CATEGORY_TREE.flatMap((c) => c.subcategories ?? []);
    const sub = allSubs.find((s) => s.value === subValue);
    if (sub) {
      tags.push({
        label: sub.label,
        onRemove: () => onSubcategoriesChange(selectedSubcategories.filter((s) => s !== subValue)),
      });
    }
  }

  // Price range tag
  if (priceRange) {
    const match = PRICE_RANGES.find((r) => r.min === priceRange.min && r.max === priceRange.max);
    tags.push({
      label: match?.label ?? 'Price filter',
      onRemove: () => onPriceRangeChange(null),
    });
  }

  // In Stock tag
  if (inStockOnly) {
    tags.push({
      label: 'In Stock',
      onRemove: () => onInStockChange(false),
    });
  }

  // Shipping method tag
  if (shippingMethod) {
    tags.push({
      label: shippingMethod === 'AIR' ? 'Air Shipping' : 'Sea Shipping',
      onRemove: () => onShippingMethodChange?.(null),
    });
  }

  const hasActiveFilters = tags.length > 0 || search;

  const clearAll = () => {
    onCategoriesChange([]);
    onSubcategoriesChange([]);
    onPriceRangeChange(null);
    onInStockChange(false);
    onShippingMethodChange?.(null);
    onSearchChange('');
  };

  return (
    <div className="space-y-3">
      {/* Search + Clear row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--muted)' }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
            style={{
              background: 'var(--deep)',
              color: 'var(--white)',
              borderColor: 'var(--border)',
            }}
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--muted)' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="shrink-0 rounded-lg border px-3 py-2.5 text-xs font-medium transition-all hover:border-red-400/40 hover:text-red-400"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          >
            <X size={14} className="mr-1 inline" />
            Clear
          </button>
        )}
      </div>

      {/* Active filter tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.label}
              onClick={tag.onRemove}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all hover:border-red-400/40 hover:text-red-400"
              style={{
                borderColor: 'var(--gold)',
                color: 'var(--gold)',
                background: 'rgba(245, 158, 11, 0.08)',
              }}
            >
              {tag.label}
              <X size={12} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
