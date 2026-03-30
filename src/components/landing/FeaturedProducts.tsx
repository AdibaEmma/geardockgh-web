'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { getFeaturedProducts } from '@/lib/api/products';
import { formatPesewas } from '@/lib/utils/formatters';
import { CATEGORIES } from '@/lib/utils/constants';
import type { Product } from '@/types';

function getCategoryLabel(slug: string | null): string | null {
  if (!slug) return null;
  return CATEGORIES.find((c) => c.value === slug)?.label ?? slug;
}

function parseImages(product: Product): string[] {
  if (product.imagesJson) {
    try { return JSON.parse(product.imagesJson); } catch { /* fall through */ }
  }
  return [];
}

export function FeaturedProducts() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await getFeaturedProducts();
        setProducts((response.data ?? []) as Product[]);
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    const cards = grid.querySelectorAll('.product-card');
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [isLoading, products]);

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="featured" id="featured">
      <div className="section-tag">// FEATURED PICKS</div>
      <h2 className="section-title">
        Top gear,<br />hand-selected.
      </h2>

      {isLoading ? (
        <div className="products-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="product-card reveal-element visible"
              style={{ opacity: 0.4 }}
            >
              <div style={{ height: 240, background: 'var(--deep)', borderRadius: 12 }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="products-grid" ref={gridRef}>
          {products.map((product, i) => {
            const images = parseImages(product);
            const firstImage = images[0] ?? null;
            const categoryLabel = getCategoryLabel(product.category);
            const isFeaturedCard = i === 0 && products.length > 2;

            return (
              <Link
                href={`/products/${product.slug}`}
                className={`product-card reveal-element${isFeaturedCard ? ' featured-card' : ''}`}
                key={product.id}
              >
                <div className="product-action">&rarr;</div>

                {/* Product image */}
                <div
                  style={{
                    width: '100%',
                    aspectRatio: isFeaturedCard ? '3/2' : '16/10',
                    borderRadius: 12,
                    overflow: 'hidden',
                    marginBottom: 16,
                    background: 'var(--black)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {firstImage ? (
                    <img
                      src={firstImage}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: 12,
                        mixBlendMode: 'normal',
                      }}
                    />
                  ) : (
                    <Package size={48} style={{ color: 'var(--border)' }} />
                  )}
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {product.isPreorder && (
                    <span
                      style={{
                        display: 'inline-block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        background: 'var(--gold)',
                        color: 'var(--black)',
                        fontWeight: 700,
                        borderRadius: 2,
                      }}
                    >
                      Pre-Order
                    </span>
                  )}
                  {categoryLabel && (
                    <div className="product-badge" style={{ marginBottom: 0 }}>
                      {categoryLabel}
                    </div>
                  )}
                </div>

                <div className="product-name">{product.name}</div>

                {product.description && (
                  <div className="product-desc">
                    {product.description.length > 120
                      ? product.description.slice(0, 120) + '...'
                      : product.description}
                  </div>
                )}

                <div className="product-price">
                  {formatPesewas(product.pricePesewas)}
                  {!product.isPreorder &&
                    product.comparePricePesewas &&
                    product.comparePricePesewas > product.pricePesewas && (
                      <span className="product-compare-price">
                        {formatPesewas(product.comparePricePesewas)}
                      </span>
                    )}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="swipe-indicator">Swipe to explore</div>
      )}

      <div className="view-all-cta">
        <Link href="/products" className="view-all-link">
          View All Products &rarr;
        </Link>
      </div>
    </section>
  );
}
