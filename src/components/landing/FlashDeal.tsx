'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ProductImagePlaceholder } from '@/components/ui/ProductImagePlaceholder';
import { getFlashDeal } from '@/lib/api/products';
import { formatPesewas } from '@/lib/utils/formatters';
import type { Product } from '@/types';

function parseSpecs(specsJson: string | null): string[] {
  if (!specsJson) return [];
  try {
    const parsed = JSON.parse(specsJson);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === 'object' && parsed !== null) return Object.values(parsed) as string[];
  } catch { /* ignore malformed JSON */ }
  return [];
}

const STOCK_BAR_MAX = 20;

function parseFirstImage(imagesJson: string | null): string | null {
  if (!imagesJson) return null;
  try {
    const images = JSON.parse(imagesJson);
    if (Array.isArray(images) && images.length > 0) return images[0];
  } catch { /* ignore malformed JSON */ }
  return null;
}

export function FlashDeal() {
  const sectionRef = useRef<HTMLElement>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFlashDeal()
      .then((res) => setProduct(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [product]);

  if (loading || !product) return null;

  const price = product.pricePesewas;
  const comparePrice = product.comparePricePesewas;
  const discount = comparePrice ? Math.round((1 - price / comparePrice) * 100) : 0;
  const stockPercent = Math.min(100, Math.max(5, (product.stockCount / STOCK_BAR_MAX) * 100));
  const specs = parseSpecs(product.specsJson);
  const imageUrl = parseFirstImage(product.imagesJson);

  return (
    <section className="flash-deal reveal-element" ref={sectionRef}>
      <div className="flash-deal-inner">
        <div className="flash-left">
          <div className="flash-tag">
            <span className="flash-dot" />
            DEAL OF THE WEEK
          </div>
          <h2 className="flash-title">
            {product.name}
          </h2>
          {specs.length > 0 && (
            <div className="flash-specs">
              {specs.map((spec) => (
                <div className="spec-item" key={spec}>{spec}</div>
              ))}
            </div>
          )}
          <div className="flash-pricing">
            <span className="flash-price">{formatPesewas(price)}</span>
            {comparePrice && (
              <>
                <span className="flash-compare">{formatPesewas(comparePrice)}</span>
                <span className="flash-save">SAVE {discount}%</span>
              </>
            )}
          </div>
          <div className="flash-stock">
            <div className="stock-bar">
              <div className="stock-fill" style={{ width: `${stockPercent}%` }} />
            </div>
            <span className="stock-text">
              {product.stockCount > 0
                ? `Only ${product.stockCount} left in stock`
                : 'Out of stock — next batch coming soon'}
            </span>
            <span className="stock-deadline">Next batch: ~6 weeks away. This price ends when stock runs out.</span>
          </div>
          <Link href={`/products/${product.slug}`} className="btn-primary flash-cta">
            {product.isPreorder ? 'Pre-Order Now' : 'Buy Now'} &mdash; Pay with MoMo &rarr;
          </Link>
          <span className="flash-trust">7-day returns &middot; Verified import</span>
        </div>
        <div className="flash-right">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="flash-placeholder"
              style={{ objectFit: 'contain', borderRadius: 12 }}
            />
          ) : (
            <ProductImagePlaceholder name={product.name} className="flash-placeholder" />
          )}
          {discount > 0 && <div className="flash-badge">-{discount}%</div>}
        </div>
      </div>
    </section>
  );
}
