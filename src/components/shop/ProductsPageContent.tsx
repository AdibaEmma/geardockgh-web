'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/use-products';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ProductFilters } from '@/components/shop/ProductFilters';
import type { Product } from '@/types';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(searchParams.get('category'));
  const [isPreorder, setIsPreorder] = useState<boolean | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useProducts({
    search: search || undefined,
    category: category ?? undefined,
    isPreorder: isPreorder ?? undefined,
    page,
    limit: 20,
  });

  const products = (data?.data ?? []) as Product[];
  const meta = data?.meta;

  return (
    <div className="animate-[fadeUp_400ms_ease-out]">
      <h1
        className="font-[family-name:var(--font-outfit)] text-3xl font-bold"
        style={{ color: 'var(--white)' }}
      >
        Products
      </h1>
      <p
        className="mt-2 text-sm"
        style={{ color: 'var(--muted)' }}
      >
        Browse our curated collection of premium gear
      </p>

      <div className="mt-6">
        <ProductFilters
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          selectedCategory={category}
          onCategoryChange={(cat) => {
            setCategory(cat);
            setPage(1);
          }}
        />
      </div>

      <div className="mt-4 flex gap-2">
        {[
          { label: 'All', value: null },
          { label: 'Pre-Order', value: true },
          { label: 'In Stock', value: false },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setIsPreorder(tab.value);
              setPage(1);
            }}
            className="rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200"
            style={{
              borderColor: isPreorder === tab.value ? 'var(--gold)' : 'var(--border)',
              color: isPreorder === tab.value ? 'var(--gold)' : 'var(--muted)',
              background: isPreorder === tab.value ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
              boxShadow: isPreorder === tab.value ? '0 2px 8px rgba(240,165,0,0.2)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <ProductGrid products={products} isLoading={isLoading} />
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:opacity-40 disabled:hover:border-[var(--border)] disabled:hover:text-[var(--muted)]"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--muted)',
            }}
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
            style={{
              borderColor: 'var(--border)',
              color: 'var(--muted)',
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export function ProductsPageContent() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
