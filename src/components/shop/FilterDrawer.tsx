'use client';

import { useEffect, useRef } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { FilterControls } from './FilterControls';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  selectedSubcategories: string[];
  onSubcategoriesChange: (subcategories: string[]) => void;
  priceRange: { min?: number; max?: number } | null;
  onPriceRangeChange: (range: { min?: number; max?: number } | null) => void;
  inStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
  hideInStock?: boolean;
  onClearAll: () => void;
  shippingMethod?: string | null;
  onShippingMethodChange?: (method: string | null) => void;
  showShippingFilter?: boolean;
}

export function FilterDrawer({
  isOpen,
  onClose,
  selectedCategories,
  onCategoriesChange,
  selectedSubcategories,
  onSubcategoriesChange,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockChange,
  hideInStock,
  onClearAll,
  shippingMethod,
  onShippingMethodChange,
  showShippingFilter,
}: FilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeCount =
    selectedCategories.length +
    selectedSubcategories.length +
    (priceRange ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed left-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-r shadow-2xl animate-[slideInLeft_250ms_ease-out]"
        style={{
          background: 'var(--deep)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2
            className="flex items-center gap-2 font-[family-name:var(--font-outfit)] text-lg font-bold"
            style={{ color: 'var(--white)' }}
          >
            <SlidersHorizontal size={20} />
            Filter Products
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors hover:bg-[var(--card)]"
            style={{ color: 'var(--muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <FilterControls
            selectedCategories={selectedCategories}
            onCategoriesChange={onCategoriesChange}
            selectedSubcategories={selectedSubcategories}
            onSubcategoriesChange={onSubcategoriesChange}
            priceRange={priceRange}
            onPriceRangeChange={onPriceRangeChange}
            inStockOnly={inStockOnly}
            onInStockChange={onInStockChange}
            hideInStock={hideInStock}
            shippingMethod={shippingMethod}
            onShippingMethodChange={onShippingMethodChange}
            showShippingFilter={showShippingFilter}
          />
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-3 border-t px-5 py-4"
          style={{ borderColor: 'var(--border)' }}
        >
          {activeCount > 0 && (
            <button
              onClick={onClearAll}
              className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all hover:border-red-400/40 hover:text-red-400"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              Clear All
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
            style={{
              background: 'var(--gold)',
              color: 'var(--black)',
            }}
          >
            Show Results
          </button>
        </div>
      </div>
    </>
  );
}
