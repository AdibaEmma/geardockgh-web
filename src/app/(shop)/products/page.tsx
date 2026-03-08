'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/use-products';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ProductFilters } from '@/components/shop/ProductFilters';
import type { Product } from '@/types';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useProducts({
    search: search || undefined,
    category: category ?? undefined,
    page,
    limit: 20,
  });

  const products = (data?.data ?? []) as Product[];
  const meta = data?.meta;

  return (
    <div>
      <h1
        className="font-[family-name:var(--font-syne)] text-3xl font-bold"
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

      <div className="mt-6">
        <ProductGrid products={products} isLoading={isLoading} />
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-lg border px-3 py-1.5 text-sm transition-colors disabled:opacity-40"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--muted)',
            }}
          >
            Previous
          </button>
          <span
            className="px-3 font-[family-name:var(--font-space-mono)] text-xs"
            style={{ color: 'var(--muted)' }}
          >
            {page} / {meta.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page >= meta.totalPages}
            className="rounded-lg border px-3 py-1.5 text-sm transition-colors disabled:opacity-40"
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
