'use client';

import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-xl border"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--border)',
            }}
          >
            <div
              className="aspect-square"
              style={{ background: 'var(--deep)' }}
            />
            <div className="space-y-3 p-4">
              {/* Category label */}
              <div
                className="h-2.5 w-1/4 rounded"
                style={{ background: 'var(--border)' }}
              />
              {/* Product name */}
              <div
                className="h-4 w-3/4 rounded"
                style={{ background: 'var(--border)' }}
              />
              {/* Price + cart button row */}
              <div className="flex items-center justify-between pt-1">
                <div
                  className="h-5 w-1/3 rounded"
                  style={{ background: 'var(--border)' }}
                />
                <div
                  className="h-8 w-8 rounded-lg"
                  style={{ background: 'var(--border)' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className="rounded-xl border py-16 text-center"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--card)',
        }}
      >
        <p
          className="font-[family-name:var(--font-outfit)] text-lg font-semibold"
          style={{ color: 'var(--white)' }}
        >
          No products found
        </p>
        <p
          className="mt-1 text-sm"
          style={{ color: 'var(--muted)' }}
        >
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
