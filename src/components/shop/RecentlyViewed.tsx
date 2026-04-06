'use client';

import Link from 'next/link';
import { Clock } from 'lucide-react';
import { useRecentlyViewedStore } from '@/stores/recently-viewed-store';
import { formatPesewas } from '@/lib/utils/formatters';

export function RecentlyViewed() {
  const items = useRecentlyViewedStore((s) => s.items);

  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <h2
        className="mb-4 flex items-center gap-2 font-[family-name:var(--font-outfit)] text-lg font-bold"
        style={{ color: 'var(--white)' }}
      >
        <Clock size={18} style={{ color: 'var(--gold)' }} />
        Recently Viewed
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item) => {
          const images = item.image ? [item.image] : [];
          const imgSrc = images[0] ?? null;

          return (
            <Link
              key={item.productId}
              href={`/products/${item.slug}`}
              className="group flex w-36 shrink-0 flex-col overflow-hidden rounded-xl border transition-all hover:border-[var(--gold)]/40"
              style={{
                background: 'var(--card)',
                borderColor: 'var(--border)',
              }}
            >
              {/* Image */}
              <div
                className="aspect-square overflow-hidden"
                style={{ background: 'var(--deep)' }}
              >
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span
                      className="text-xs"
                      style={{ color: 'var(--muted)' }}
                    >
                      No image
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2.5">
                <p
                  className="line-clamp-1 text-xs font-medium"
                  style={{ color: 'var(--white)' }}
                >
                  {item.name}
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span
                    className="font-[family-name:var(--font-space-mono)] text-xs font-semibold"
                    style={{ color: 'var(--gold)' }}
                  >
                    {formatPesewas(item.pricePesewas)}
                  </span>
                  {item.comparePricePesewas &&
                    item.comparePricePesewas > item.pricePesewas && (
                      <span
                        className="font-[family-name:var(--font-space-mono)] text-[10px] line-through"
                        style={{ color: 'var(--muted)' }}
                      >
                        {formatPesewas(item.comparePricePesewas)}
                      </span>
                    )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
