'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '@/hooks/use-products';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ProductFilters } from '@/components/shop/ProductFilters';
import { ProductSidebar } from '@/components/shop/ProductSidebar';
import { FilterDrawer } from '@/components/shop/FilterDrawer';
import { RecentlyViewed } from '@/components/shop/RecentlyViewed';
import type { Product } from '@/types';

function ProductsContent({ initialCategory }: { initialCategory?: string }) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<string[]>(() => {
    if (initialCategory) return [initialCategory];
    const param = searchParams.get('category');
    return param ? param.split(',') : [];
  });
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number } | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, isLoading } = useProducts({
    search: search || undefined,
    category: categories.length > 0 ? categories.join(',') : undefined,
    subcategory: subcategories.length > 0 ? subcategories.join(',') : undefined,
    minPrice: priceRange?.min,
    maxPrice: priceRange?.max,
    inStock: inStockOnly || undefined,
    isPreorder: false,
    page,
    limit: 20,
  });

  const products = (data?.data ?? []) as Product[];
  const meta = data?.meta;

  const resetPage = () => setPage(1);

  const clearAllFilters = () => {
    setCategories([]);
    setSubcategories([]);
    setPriceRange(null);
    setInStockOnly(false);
    setSearch('');
    resetPage();
  };

  const activeFilterCount =
    categories.length +
    subcategories.length +
    (priceRange ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const hideCats = !!initialCategory;

  return (
    <div className="animate-[fadeUp_400ms_ease-out]">
      {!initialCategory && (
        <>
          <h1
            className="font-[family-name:var(--font-outfit)] text-3xl font-bold"
            style={{ color: 'var(--white)' }}
          >
            Shop
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
            Browse our in-stock collection of premium gear — ready for delivery
          </p>
        </>
      )}

      <div className={initialCategory ? '' : 'mt-6'}>
        <div className="lg:flex lg:gap-8">
          {/* Desktop Sidebar */}
          {!hideCats && (
            <ProductSidebar
              selectedCategories={categories}
              onCategoriesChange={(cats) => { setCategories(cats); setSubcategories([]); resetPage(); }}
              selectedSubcategories={subcategories}
              onSubcategoriesChange={(subs) => { setSubcategories(subs); resetPage(); }}
              priceRange={priceRange}
              onPriceRangeChange={(range) => { setPriceRange(range); resetPage(); }}
              inStockOnly={inStockOnly}
              onInStockChange={(val) => { setInStockOnly(val); resetPage(); }}
            />
          )}

          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Desktop search bar (lg+) */}
            <div className="mb-4 hidden lg:flex lg:gap-2">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--muted)' }}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); resetPage(); }}
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
                    onClick={() => { setSearch(''); resetPage(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--muted)' }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {(search || activeFilterCount > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="shrink-0 rounded-lg border px-3 py-2.5 text-xs font-medium transition-all hover:border-red-400/40 hover:text-red-400"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                >
                  <X size={14} className="mr-1 inline" />
                  Clear
                </button>
              )}
            </div>

            {/* Mobile/Tablet filters (< lg) */}
            <div className="lg:hidden">
              <ProductFilters
                search={search}
                onSearchChange={(val) => { setSearch(val); resetPage(); }}
                selectedCategories={categories}
                onCategoriesChange={hideCats ? () => {} : (cats) => { setCategories(cats); setSubcategories([]); resetPage(); }}
                selectedSubcategories={subcategories}
                onSubcategoriesChange={(subs) => { setSubcategories(subs); resetPage(); }}
                priceRange={priceRange}
                onPriceRangeChange={(range) => { setPriceRange(range); resetPage(); }}
                inStockOnly={inStockOnly}
                onInStockChange={(val) => { setInStockOnly(val); resetPage(); }}
                hideCategories={hideCats}
              />
            </div>

            {/* Product grid */}
            <div className="mt-4 lg:mt-0">
              <ProductGrid products={products} isLoading={isLoading} />
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:opacity-40 disabled:hover:border-[var(--border)] disabled:hover:text-[var(--muted)]"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                >
                  Previous
                </button>
                <span
                  className="min-w-[4rem] text-center font-[family-name:var(--font-space-mono)] text-sm"
                  style={{ color: 'var(--muted)' }}
                >
                  {page} / {meta.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page >= meta.totalPages}
                  className="rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:opacity-40 disabled:hover:border-[var(--border)] disabled:hover:text-[var(--muted)]"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                >
                  Next
                </button>
              </div>
            )}

            {/* Recently Viewed */}
            <RecentlyViewed />
          </div>
        </div>
      </div>

      {/* Mobile Filter FAB (< lg) */}
      <button
        onClick={() => setIsFilterOpen(true)}
        className="fixed bottom-20 left-4 z-40 flex items-center gap-2 rounded-full px-4 py-3 shadow-lg transition-transform active:scale-95 lg:hidden"
        style={{
          background: 'var(--gold)',
          color: 'var(--black)',
        }}
      >
        <SlidersHorizontal size={16} />
        <span className="text-sm font-semibold">Filter</span>
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCategories={categories}
        onCategoriesChange={hideCats ? () => {} : (cats) => { setCategories(cats); setSubcategories([]); resetPage(); }}
        selectedSubcategories={subcategories}
        onSubcategoriesChange={(subs) => { setSubcategories(subs); resetPage(); }}
        priceRange={priceRange}
        onPriceRangeChange={(range) => { setPriceRange(range); resetPage(); }}
        inStockOnly={inStockOnly}
        onInStockChange={(val) => { setInStockOnly(val); resetPage(); }}
        hideInStock={false}
        onClearAll={clearAllFilters}
      />
    </div>
  );
}

export function ProductsPageContent({ initialCategory }: { initialCategory?: string } = {}) {
  return (
    <Suspense>
      <ProductsContent initialCategory={initialCategory} />
    </Suspense>
  );
}
