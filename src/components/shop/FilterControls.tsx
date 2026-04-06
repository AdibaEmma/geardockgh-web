'use client';

import { ChevronDown, ChevronRight, Plane, Ship } from 'lucide-react';
import { CATEGORY_TREE } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

const PRICE_RANGES = [
  { label: 'Under GH₵ 200', min: 0, max: 20000 },
  { label: 'GH₵ 200 – 500', min: 20000, max: 50000 },
  { label: 'GH₵ 500 – 1,000', min: 50000, max: 100000 },
  { label: 'GH₵ 1,000 – 2,500', min: 100000, max: 250000 },
  { label: 'GH₵ 2,500+', min: 250000, max: undefined },
];

interface FilterControlsProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  selectedSubcategories: string[];
  onSubcategoriesChange: (subcategories: string[]) => void;
  priceRange: { min?: number; max?: number } | null;
  onPriceRangeChange: (range: { min?: number; max?: number } | null) => void;
  inStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
  hideInStock?: boolean;
  shippingMethod?: string | null;
  onShippingMethodChange?: (method: string | null) => void;
  showShippingFilter?: boolean;
}

export function FilterControls({
  selectedCategories,
  onCategoriesChange,
  selectedSubcategories,
  onSubcategoriesChange,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockChange,
  hideInStock,
  shippingMethod,
  onShippingMethodChange,
  showShippingFilter,
}: FilterControlsProps) {
  const toggleCategory = (value: string) => {
    const isSelected = selectedCategories.includes(value);
    if (isSelected) {
      onCategoriesChange(selectedCategories.filter((c) => c !== value));
    } else {
      onCategoriesChange([...selectedCategories, value]);
    }
    onSubcategoriesChange([]);
  };

  const isPriceSelected = (range: (typeof PRICE_RANGES)[number]) =>
    priceRange?.min === range.min && priceRange?.max === range.max;

  const togglePrice = (range: (typeof PRICE_RANGES)[number]) => {
    if (isPriceSelected(range)) {
      onPriceRangeChange(null);
    } else {
      onPriceRangeChange({ min: range.min, max: range.max });
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Categories */}
      <div>
        <h3
          className="mb-3 font-[family-name:var(--font-outfit)] text-sm font-semibold uppercase tracking-wider"
          style={{ color: 'var(--muted)' }}
        >
          Categories
        </h3>
        <div
          className="border-b pb-1"
          style={{ borderColor: 'var(--border)' }}
        />
        <div className="mt-3 space-y-1">
          {CATEGORY_TREE.map((cat) => {
            const isSelected = selectedCategories.includes(cat.value);
            const hasSubs = cat.subcategories && cat.subcategories.length > 0;

            return (
              <div key={cat.value}>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 transition-colors hover:bg-[var(--deep)]">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCategory(cat.value)}
                    className="h-4 w-4 rounded border-[var(--border)] accent-[var(--gold)]"
                  />
                  <span
                    className={cn(
                      'text-sm font-medium transition-colors',
                      isSelected
                        ? 'text-[var(--white)]'
                        : 'text-[var(--muted)]',
                    )}
                  >
                    {cat.label}
                  </span>
                  {hasSubs && (
                    <span className="ml-auto" style={{ color: 'var(--muted)' }}>
                      {isSelected ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </span>
                  )}
                </label>

                {/* Subcategories */}
                {isSelected && hasSubs && (
                  <div className="ml-6 space-y-0.5 pb-1">
                    {cat.subcategories!.map((sub) => (
                      <label
                        key={sub.value}
                        className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1 transition-colors hover:bg-[var(--deep)]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSubcategories.includes(sub.value)}
                          onChange={() => {
                            const isSelected = selectedSubcategories.includes(sub.value);
                            onSubcategoriesChange(
                              isSelected
                                ? selectedSubcategories.filter((s) => s !== sub.value)
                                : [...selectedSubcategories, sub.value],
                            );
                          }}
                          className="h-3.5 w-3.5 rounded border-[var(--border)] accent-[var(--teal)]"
                        />
                        <span
                          className={cn(
                            'text-xs font-medium transition-colors',
                            selectedSubcategories.includes(sub.value)
                              ? 'text-[var(--teal)]'
                              : 'text-[var(--muted)]',
                          )}
                        >
                          {sub.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter by Price */}
      <div>
        <h3
          className="mb-3 font-[family-name:var(--font-outfit)] text-sm font-semibold uppercase tracking-wider"
          style={{ color: 'var(--muted)' }}
        >
          Price Range
        </h3>
        <div
          className="border-b pb-1"
          style={{ borderColor: 'var(--border)' }}
        />
        <div className="mt-3 space-y-1">
          {PRICE_RANGES.map((range) => (
            <label
              key={range.label}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 transition-colors hover:bg-[var(--deep)]"
            >
              <input
                type="checkbox"
                checked={isPriceSelected(range)}
                onChange={() => togglePrice(range)}
                className="h-4 w-4 rounded border-[var(--border)] accent-[var(--gold)]"
              />
              <span
                className={cn(
                  'text-sm font-medium transition-colors',
                  isPriceSelected(range)
                    ? 'text-[var(--gold)]'
                    : 'text-[var(--muted)]',
                )}
              >
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Shipping Method */}
      {showShippingFilter && onShippingMethodChange && (
        <div>
          <h3
            className="mb-3 font-[family-name:var(--font-outfit)] text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--muted)' }}
          >
            Shipping
          </h3>
          <div
            className="border-b pb-1"
            style={{ borderColor: 'var(--border)' }}
          />
          <div className="mt-3 space-y-1">
            {[
              { value: 'AIR', label: 'Air Shipping', sublabel: '1–3 weeks', Icon: Plane, color: 'var(--teal)' },
              { value: 'SEA', label: 'Sea Shipping', sublabel: '6–10 weeks', Icon: Ship, color: '#3b82f6' },
            ].map((method) => (
              <label
                key={method.value}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 transition-colors hover:bg-[var(--deep)]"
              >
                <input
                  type="checkbox"
                  checked={shippingMethod === method.value}
                  onChange={() =>
                    onShippingMethodChange(
                      shippingMethod === method.value ? null : method.value,
                    )
                  }
                  className="h-4 w-4 rounded border-[var(--border)]"
                  style={{ accentColor: method.color }}
                />
                <method.Icon size={14} style={{ color: shippingMethod === method.value ? method.color : 'var(--muted)' }} />
                <span
                  className={cn(
                    'text-sm font-medium transition-colors',
                    shippingMethod === method.value
                      ? 'text-[var(--white)]'
                      : 'text-[var(--muted)]',
                  )}
                >
                  {method.label}
                  <span className="ml-1 text-[10px] opacity-60">({method.sublabel})</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* In Stock */}
      {!hideInStock && (
        <div>
          <h3
            className="mb-3 font-[family-name:var(--font-outfit)] text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--muted)' }}
          >
            Availability
          </h3>
          <div
            className="border-b pb-1"
            style={{ borderColor: 'var(--border)' }}
          />
          <label className="mt-3 flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 transition-colors hover:bg-[var(--deep)]">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={() => onInStockChange(!inStockOnly)}
              className="h-4 w-4 rounded border-[var(--border)] accent-green-500"
            />
            <span
              className={cn(
                'text-sm font-medium transition-colors',
                inStockOnly ? 'text-green-400' : 'text-[var(--muted)]',
              )}
            >
              In Stock Only
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
