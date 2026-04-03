'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/use-products';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ProductFilters } from '@/components/shop/ProductFilters';
import type { Product } from '@/types';

function ProductsContent({ initialCategory }: { initialCategory?: string }) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<string[]>(() => {
    if (initialCategory) return [initialCategory];
    const param = searchParams.get('category');
    return param ? param.split(',') : [];
  });
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number } | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useProducts({
    search: search || undefined,
    category: categories.length > 0 ? categories.join(',') : undefined,
    subcategory: subcategory ?? undefined,
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
        <ProductFilters
          search={search}
          onSearchChange={(val) => { setSearch(val); resetPage(); }}
          selectedCategories={categories}
          onCategoriesChange={initialCategory ? () => {} : (cats) => { setCategories(cats); setSubcategory(null); resetPage(); }}
          selectedSubcategory={subcategory}
          onSubcategoryChange={(sub) => { setSubcategory(sub); resetPage(); }}
          priceRange={priceRange}
          onPriceRangeChange={(range) => { setPriceRange(range); resetPage(); }}
          inStockOnly={inStockOnly}
          onInStockChange={(val) => { setInStockOnly(val); resetPage(); }}
          hideCategories={!!initialCategory}
        />
      </div>

      <div className="mt-6">
        <ProductGrid products={products} isLoading={isLoading} />
      </div>

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
