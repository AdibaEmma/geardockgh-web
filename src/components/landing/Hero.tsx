'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Headphones, Sun, Keyboard } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ProductImagePlaceholder } from '@/components/ui/ProductImagePlaceholder';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const STATS = [
  { value: '224', suffix: '+', label: 'Orders Fulfilled' },
  { value: '88', suffix: '+', label: 'Products' },
  { value: '13', suffix: '', label: 'Categories' },
  { value: '48', suffix: 'h', label: 'Delivery' },
];

const SHOWCASE_PRODUCTS: { name: string; price: string; icon: LucideIcon }[] = [
  { name: 'Sony WH-1000XM5', price: 'GH\u20B5 2,400', icon: Headphones },
  { name: 'Ring Light Pro 18"', price: 'GH\u20B5 680', icon: Sun },
  { name: 'Mechanical Keyboard TKL', price: 'GH\u20B5 520', icon: Keyboard },
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
      </div>

      <div className="hero-right">
        <div className="hero-showcase" ref={showcaseRef}>
          <div className="orbit-dot" />
          <div className="orbit-dot" />
          <div className="orbit-dot" />
          {SHOWCASE_PRODUCTS.map((product, i) => (
            <div className={`showcase-card showcase-card-${i + 1}`} key={product.name}>
              <ProductImagePlaceholder name={product.name} className="showcase-card-placeholder" icon={product.icon} />
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
