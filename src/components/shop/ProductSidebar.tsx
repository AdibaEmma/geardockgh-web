'use client';

import { FilterControls } from './FilterControls';

interface ProductSidebarProps {
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

export function ProductSidebar({
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
}: ProductSidebarProps) {
  return (
    <aside className="hidden lg:block lg:w-60 lg:shrink-0">
      <div
        className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border p-4 scrollbar-hide"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
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
    </aside>
  );
}
