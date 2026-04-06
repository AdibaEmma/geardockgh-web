'use client';

import { useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Shield, MessageCircle, RefreshCw } from 'lucide-react';
import { useProducts } from '@/hooks/use-products';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ProductFilters } from '@/components/shop/ProductFilters';
import { ProductSidebar } from '@/components/shop/ProductSidebar';
import { FilterDrawer } from '@/components/shop/FilterDrawer';
import { RecentlyViewed } from '@/components/shop/RecentlyViewed';
import { PreorderHero } from '@/components/shop/PreorderHero';
import { PreorderSteps } from '@/components/shop/PreorderSteps';
import type { Product } from '@/types';

const FAQ_ITEMS = [
  {
    icon: Shield,
    question: 'Is my deposit refundable?',
    answer: 'Yes, 100%. If we can\'t fulfill your pre-order for any reason, your full deposit is refunded to your MoMo within 24 hours.',
  },
  {
    icon: MessageCircle,
    question: 'How do I know when my gear arrives?',
    answer: 'You\'ll get WhatsApp updates at every stage — when it ships from the supplier, clears customs, and is out for delivery.',
  },
  {
    icon: RefreshCw,
    question: 'Can I change or cancel my pre-order?',
    answer: 'Yes, you can modify or cancel anytime before the item ships. Your deposit is fully refundable.',
  },
];

export default function PreorderPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number } | null>(null);
  const [shippingMethod, setShippingMethod] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, isLoading } = useProducts({
    search: search || undefined,
    category: categories.length > 0 ? categories.join(',') : undefined,
    subcategory: subcategories.length > 0 ? subcategories.join(',') : undefined,
    minPrice: priceRange?.min,
    maxPrice: priceRange?.max,
    shippingMethod: shippingMethod ?? undefined,
    isPreorder: true,
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
    setShippingMethod(null);
    setSearch('');
    resetPage();
  };

  const activeFilterCount =
    categories.length +
    subcategories.length +
    (priceRange ? 1 : 0) +
    (shippingMethod ? 1 : 0);

  return (
    <div className="animate-[fadeUp_400ms_ease-out]">
      <PreorderHero />
      <PreorderSteps />

      {/* Pre-Order Products */}
      <section className="mt-12" id="preorder-products">
        <div className="mb-6 flex items-center justify-between">
          <h2
            className="font-[family-name:var(--font-outfit)] text-xl font-bold sm:text-2xl"
            style={{ color: 'var(--white)' }}
          >
            Available for Pre-Order
          </h2>
          <span
            className="font-[family-name:var(--font-space-mono)] text-xs"
            style={{ color: 'var(--muted)' }}
          >
            {meta?.total ?? 0} items
          </span>
        </div>

        <div className="lg:flex lg:gap-8">
          {/* Desktop Sidebar */}
          <ProductSidebar
            selectedCategories={categories}
            onCategoriesChange={(cats) => { setCategories(cats); setSubcategories([]); resetPage(); }}
            selectedSubcategories={subcategories}
            onSubcategoriesChange={(subs) => { setSubcategories(subs); resetPage(); }}
            priceRange={priceRange}
            onPriceRangeChange={(range) => { setPriceRange(range); resetPage(); }}
            inStockOnly={false}
            onInStockChange={() => {}}
            hideInStock
            shippingMethod={shippingMethod}
            onShippingMethodChange={(m) => { setShippingMethod(m); resetPage(); }}
            showShippingFilter
          />

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
                  placeholder="Search pre-order products..."
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
            <div className="mb-6 lg:hidden">
              <ProductFilters
                search={search}
                onSearchChange={(val) => { setSearch(val); resetPage(); }}
                selectedCategories={categories}
                onCategoriesChange={(cats) => { setCategories(cats); setSubcategories([]); resetPage(); }}
                selectedSubcategories={subcategories}
                onSubcategoriesChange={(subs) => { setSubcategories(subs); resetPage(); }}
                priceRange={priceRange}
                onPriceRangeChange={(range) => { setPriceRange(range); resetPage(); }}
                inStockOnly={false}
                onInStockChange={() => {}}
                hideInStock
              />
            </div>

            {/* Product grid */}
            <div className="lg:mt-0">
              <ProductGrid products={products} isLoading={isLoading} />
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:opacity-40"
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
                  className="rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:opacity-40"
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
      </section>

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
        onCategoriesChange={(cats) => { setCategories(cats); setSubcategories([]); resetPage(); }}
        selectedSubcategories={subcategories}
        onSubcategoriesChange={(subs) => { setSubcategories(subs); resetPage(); }}
        priceRange={priceRange}
        onPriceRangeChange={(range) => { setPriceRange(range); resetPage(); }}
        inStockOnly={false}
        onInStockChange={() => {}}
        hideInStock
        onClearAll={clearAllFilters}
        shippingMethod={shippingMethod}
        onShippingMethodChange={(m) => { setShippingMethod(m); resetPage(); }}
        showShippingFilter
      />

      {/* FAQ / Trust */}
      <section className="mt-16 mb-8">
        <h2
          className="mb-6 text-center font-[family-name:var(--font-outfit)] text-xl font-bold sm:text-2xl"
          style={{ color: 'var(--white)' }}
        >
          Pre-Order FAQ
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FAQ_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.question}
                className="rounded-xl border p-5"
                style={{
                  background: 'var(--card)',
                  borderColor: 'var(--border)',
                }}
              >
                <div className="mb-3 flex items-center gap-2">
                  <Icon size={16} style={{ color: 'var(--teal)' }} />
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: 'var(--white)' }}
                  >
                    {item.question}
                  </h3>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  {item.answer}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
