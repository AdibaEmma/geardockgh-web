'use client';

import {
  Search, X, SlidersHorizontal,
  Smartphone, Laptop, Headphones, Battery,
  Armchair, Camera, Gamepad2, HardDrive,
  Cable, Tv,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CATEGORY_TREE } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

const ICON_MAP: Record<string, LucideIcon> = {
  Smartphone, Laptop, Headphones, Battery,
  Armchair, Camera, Gamepad2, HardDrive,
  Cable, Tv,
};

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
  selectedSubcategory: string | null;
  onSubcategoryChange: (subcategory: string | null) => void;
  priceRange: { min?: number; max?: number } | null;
  onPriceRangeChange: (range: { min?: number; max?: number } | null) => void;
  inStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
  /** Set to true to hide the in-stock filter (e.g., on pre-order page) */
  hideInStock?: boolean;
}

export function ProductFilters({
  search,
  onSearchChange,
  selectedCategories,
  onCategoriesChange,
  selectedSubcategory,
  onSubcategoryChange,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockChange,
  hideInStock,
}: ProductFiltersProps) {
  const activeCategory = selectedCategories.length === 1
    ? CATEGORY_TREE.find(c => c.value === selectedCategories[0])
    : null;
  const subcategories = activeCategory?.subcategories;

  const hasActiveFilters = selectedCategories.length > 0 || selectedSubcategory || priceRange || inStockOnly || search;

  const toggleCategory = (value: string) => {
    const isSelected = selectedCategories.includes(value);
    if (isSelected) {
      onCategoriesChange(selectedCategories.filter(c => c !== value));
    } else {
      onCategoriesChange([...selectedCategories, value]);
    }
    onSubcategoryChange(null);
  };

  const clearAll = () => {
    onCategoriesChange([]);
    onSubcategoryChange(null);
    onPriceRangeChange(null);
    onInStockChange(false);
    onSearchChange('');
  };

  const isPriceSelected = (range: typeof PRICE_RANGES[number]) =>
    priceRange?.min === range.min && priceRange?.max === range.max;

  const togglePrice = (range: typeof PRICE_RANGES[number]) => {
    if (isPriceSelected(range)) {
      onPriceRangeChange(null);
    } else {
      onPriceRangeChange({ min: range.min, max: range.max });
    }
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

        {/* Clear all filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="shrink-0 rounded-lg border px-3 py-2.5 text-xs font-medium transition-all hover:border-red-400/40 hover:text-red-400"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          >
            <X size={14} className="inline mr-1" />
            Clear
          </button>
        )}
      </div>

      {/* Category pills — multi-select */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide sm:flex-wrap sm:overflow-visible sm:pb-0">
        <button
          onClick={() => { onCategoriesChange([]); onSubcategoryChange(null); }}
          className={cn(
            'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
            selectedCategories.length === 0
              ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]'
              : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--gold)]/40 hover:text-[var(--white)]',
          )}
        >
          All
        </button>
        {CATEGORY_TREE.map((cat) => {
          const Icon = ICON_MAP[cat.icon];
          const isSelected = selectedCategories.includes(cat.value);
          return (
            <button
              key={cat.value}
              onClick={() => toggleCategory(cat.value)}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                isSelected
                  ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--gold)]/40 hover:text-[var(--white)]',
              )}
            >
              {Icon && <Icon size={14} />}
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Subcategory pills */}
      {subcategories && subcategories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible sm:pb-0">
          <button
            onClick={() => onSubcategoryChange(null)}
            className={cn(
              'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all',
              !selectedSubcategory
                ? 'border-[var(--teal)] bg-[var(--teal)]/10 text-[var(--teal)]'
                : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--teal)]/40 hover:text-[var(--white)]',
            )}
          >
            All {activeCategory!.label}
          </button>
          {subcategories.map((sub) => (
            <button
              key={sub.value}
              onClick={() => onSubcategoryChange(selectedSubcategory === sub.value ? null : sub.value)}
              className={cn(
                'shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all',
                selectedSubcategory === sub.value
                  ? 'border-[var(--teal)] bg-[var(--teal)]/10 text-[var(--teal)]'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--teal)]/40 hover:text-[var(--white)]',
              )}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* Price range + In Stock row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible sm:pb-0">
        <SlidersHorizontal size={14} style={{ color: 'var(--muted)' }} className="shrink-0" />
        {PRICE_RANGES.map((range) => (
          <button
            key={range.label}
            onClick={() => togglePrice(range)}
            className={cn(
              'shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all',
              isPriceSelected(range)
                ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]'
                : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--gold)]/40 hover:text-[var(--white)]',
            )}
          >
            {range.label}
          </button>
        ))}

        {/* Divider */}
        {!hideInStock && (
          <>
            <span className="mx-1 hidden sm:block" style={{ color: 'var(--border)' }}>|</span>
            <button
              onClick={() => onInStockChange(!inStockOnly)}
              className={cn(
                'shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all',
                inStockOnly
                  ? 'border-green-500 bg-green-500/10 text-green-400'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-green-500/40 hover:text-[var(--white)]',
              )}
            >
              In Stock
            </button>
          </>
        )}
      </div>
    </div>
  );
}
