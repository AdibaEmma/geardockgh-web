'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/use-products';
import { formatPesewas } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProducts({ page, limit: 20 });

  const products = (data?.data ?? []) as Product[];
  const meta = data?.meta;

  return (
    <div>
      <h1
        className="mb-6 font-[family-name:var(--font-syne)] text-2xl font-bold"
        style={{ color: 'var(--white)' }}
      >
        Products
      </h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <span
            className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"
            style={{ color: 'var(--gold)' }}
          />
        </div>
      ) : (
        <div
          className="overflow-hidden rounded-xl border"
          style={{ borderColor: 'var(--border)' }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--card)' }}>
                {['Name', 'Category', 'Price', 'Stock', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold"
                    style={{ color: 'var(--muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium" style={{ color: 'var(--white)' }}>
                      {product.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      {product.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded-full px-2 py-0.5 text-xs"
                      style={{
                        background: 'var(--card)',
                        color: 'var(--muted)',
                      }}
                    >
                      {product.category ?? '--'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: 'var(--gold)' }}
                    >
                      {formatPesewas(product.pricePesewas)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-sm"
                      style={{
                        color:
                          product.stockCount > 0
                            ? 'var(--teal)'
                            : '#ef4444',
                      }}
                    >
                      {product.stockCount}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        background: product.isPublished
                          ? 'rgba(0,201,167,0.1)'
                          : 'rgba(239,68,68,0.1)',
                        color: product.isPublished
                          ? 'var(--teal)'
                          : '#ef4444',
                      }}
                    >
                      {product.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            Page {page} of {meta.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
