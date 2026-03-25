'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ProductImagePlaceholder } from '@/components/ui/ProductImagePlaceholder';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const STATS = [
  { value: '200', suffix: '+', label: 'Products Curated' },
  { value: '48', suffix: 'h', label: 'Delivery in Bolgatanga' },
  { value: '13', suffix: '', label: 'Categories' },
];

const SHOWCASE_PRODUCTS = [
  { name: 'Sony WH-1000XM5', price: 'GH\u20B5 2,400' },
  { name: 'Ring Light Pro 18"', price: 'GH\u20B5 680' },
  { name: 'Mechanical Keyboard TKL', price: 'GH\u20B5 520' },
];

export function Hero() {
  const showcaseRef = useRef<HTMLDivElement>(null);

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
          <strong>GearDockGH</strong> helps Ghana&apos;s remote workers,
          creators, and gamers get premium imported gear delivered to their
          door &mdash; no stress, no customs, no waiting.
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
          <span className="trust-dot-live" />
          <span>200+ products curated &middot; 48h delivery in Bolgatanga &middot; MoMo accepted</span>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-showcase" ref={showcaseRef}>
          <div className="orbit-dot" />
          <div className="orbit-dot" />
          <div className="orbit-dot" />
          {SHOWCASE_PRODUCTS.map((product, i) => (
            <div className={`showcase-card showcase-card-${i + 1}`} key={product.name}>
              <ProductImagePlaceholder name={product.name} className="showcase-card-placeholder" />
              <div className="showcase-card-name">{product.name}</div>
              <div className="showcase-card-price">{product.price}</div>
              <span className="showcase-card-link">Shop &rarr;</span>
            </div>
          ))}
          <div className="showcase-badge badge-1">NEW ARRIVAL</div>
          <div className="showcase-badge badge-2">GH CERTIFIED</div>
          <div className="showcase-badge badge-3">FREE SHIPPING</div>
        </div>
      </div>
    </section>
  );
}
