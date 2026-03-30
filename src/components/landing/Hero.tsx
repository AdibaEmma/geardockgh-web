'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { ProductImagePlaceholder } from '@/components/ui/ProductImagePlaceholder';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { getNewArrivals } from '@/lib/api/products';
import { formatPesewas } from '@/lib/utils/formatters';
import type { Product } from '@/types';

const STATS = [
  { value: '224', suffix: '+', label: 'Orders Delivered' },
  { value: '88', suffix: '+', label: 'Products' },
  { value: '10', suffix: '', label: 'Categories' },
  { value: '48', suffix: 'h', label: 'Delivery' },
];

function parseFirstImage(product: Product): string | null {
  if (product.imagesJson) {
    try {
      const images = JSON.parse(product.imagesJson);
      return images[0] ?? null;
    } catch { /* fall through */ }
  }
  return null;
}

export function Hero() {
  const showcaseRef = useRef<HTMLDivElement>(null);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);

  useEffect(() => {
    const fetchArrivals = async () => {
      try {
        const response = await getNewArrivals();
        const products = (response.data ?? []) as Product[];
        // Take up to 3 for the showcase rotation
        setNewArrivals(products.slice(0, 3));
      } catch {
        // Fall back to static products
      }
    };
    fetchArrivals();
  }, []);

  useEffect(() => {
    const el = showcaseRef.current;
    if (!el) return;

    const handleAnimationEnd = () => {
      el.classList.add('float-active');
    };

    el.addEventListener('animationend', handleAnimationEnd);
    return () => el.removeEventListener('animationend', handleAnimationEnd);
  }, []);

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-grid" />

      <div className="hero-left">
        <span className="hero-tag">Made for Ghana&apos;s Digital Pros</span>

        <h1 className="hero-heading">
          Your Setup.<br />
          <em>Your Edge.</em>
        </h1>

        <p className="hero-sub">
          Tired of fake listings, customs surprises, and 6-week waits?
          <strong> GearDockGH</strong> delivers premium imported gear to
          Ghana&apos;s remote workers, creators, and gamers &mdash; verified,
          priced in cedis, and at your door in 48 hours.
        </p>

        <div className="hero-price-callout">
          <span className="price-from">Gear from</span>
          <span className="price-amount">GH&#8373; 120</span>
        </div>

        <div className="hero-actions">
          <Link href="/products" className="btn-primary">
            Pre-Order My Setup &rarr;
          </Link>
          <Link href="#bundles" className="btn-secondary">
            See Bundles
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 7h8M7 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>

        <div className="hero-stats">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="stat-num">
                <AnimatedCounter value={stat.value} />
                <span>{stat.suffix}</span>
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="hero-trust">
          <span className="hero-trust-item">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6l3 3 5-5" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            224+ orders delivered
          </span>
          <span className="hero-trust-item">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6l3 3 5-5" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            48h delivery
          </span>
          <span className="hero-trust-item">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6l3 3 5-5" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            7-day returns
          </span>
          <span className="hero-trust-item">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6l3 3 5-5" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            MoMo accepted
          </span>
        </div>

        {/* Mobile new arrivals strip — only visible on mobile */}
        {newArrivals.length > 0 && (
          <div className="hero-mobile-arrivals">
            <div className="hero-mobile-arrivals-label">NEW ARRIVALS</div>
            <div className="hero-mobile-arrivals-scroll">
              {newArrivals.map((product) => {
                const image = parseFirstImage(product);
                return (
                  <Link
                    href={`/products/${product.slug}`}
                    key={product.id}
                    className="hero-mobile-arrival-card"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        className="hero-mobile-arrival-img"
                      />
                    ) : (
                      <div className="hero-mobile-arrival-placeholder">
                        <Package size={20} />
                      </div>
                    )}
                    <div className="hero-mobile-arrival-info">
                      <span className="hero-mobile-arrival-name">{product.name}</span>
                      <span className="hero-mobile-arrival-price">{formatPesewas(product.pricePesewas)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="hero-right">
        <div
          className={`hero-showcase showcase-count-${newArrivals.length}`}
          ref={showcaseRef}
        >
          <div className="orbit-dot" />
          <div className="orbit-dot" />
          <div className="orbit-dot" />
          {newArrivals.map((product, i) => {
            const image = parseFirstImage(product);
            return (
              <Link
                href={`/products/${product.slug}`}
                className={`showcase-card showcase-card-${i + 1}`}
                key={product.id}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {image ? (
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 10,
                      background: 'var(--deep)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: 8,
                      }}
                    />
                  </div>
                ) : (
                  <ProductImagePlaceholder
                    name={product.name}
                    className="showcase-card-placeholder"
                    icon={Package}
                  />
                )}
                <div className="showcase-card-name">{product.name}</div>
                <div className="showcase-card-price">
                  {formatPesewas(product.pricePesewas)}
                </div>
                <span className="showcase-card-link">Shop &rarr;</span>
              </Link>
            );
          })}
          <div className="showcase-badge badge-1">NEW ARRIVAL</div>
          <div className="showcase-badge badge-2">GH CERTIFIED</div>
          <div className="showcase-badge badge-3">FREE DELIVERY IN BOLGA</div>
        </div>
      </div>
    </section>
  );
}
