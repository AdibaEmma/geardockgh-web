'use client';

import {
  Search, X,
  Smartphone, Laptop, Monitor, Headphones, Keyboard, Battery,
  Armchair, Camera, Gamepad2, HardDrive, Lightbulb,
  Cable, Tv,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CATEGORY_TREE } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

const ICON_MAP: Record<string, LucideIcon> = {
  Smartphone, Laptop, Monitor, Headphones, Keyboard, Battery,
  Armchair, Camera, Gamepad2, HardDrive, Lightbulb,
  Cable, Tv,
};

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  selectedSubcategory: string | null;
  onSubcategoryChange: (subcategory: string | null) => void;
}

export function ProductFilters({
  search,
  onSearchChange,
  selectedCategories,
  onCategoriesChange,
  selectedSubcategory,
  onSubcategoryChange,
}: ProductFiltersProps) {
  // Get subcategories when exactly 1 category is selected
  const activeCategory = selectedCategories.length === 1
    ? CATEGORY_TREE.find(c => c.value === selectedCategories[0])
    : null;
  const subcategories = activeCategory?.subcategories;

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
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
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

      {/* Category pills — multi-select */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide sm:flex-wrap sm:overflow-visible sm:pb-0">
        <button
          onClick={clearAll}
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

      {/* Subcategory pills — shown when exactly 1 category with subcategories is selected */}
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
    </div>
  );
}
