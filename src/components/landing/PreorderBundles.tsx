'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Package, Gift, Check } from 'lucide-react';
import { getFeaturedBundles } from '@/lib/api/bundles';
import { formatPesewas } from '@/lib/utils/formatters';
import type { Bundle } from '@/types';

interface BundleDisplayItem {
  name: string;
  isBonus: boolean;
}

interface FallbackBundle {
  name: string;
  slug: string;
  tagline: string;
  category: string;
  pricePesewas: number;
  comparePricePesewas: number;
  stockCount: number;
  imageUrl: string | null;
  displayItems: BundleDisplayItem[];
}

const FALLBACK_BUNDLES: FallbackBundle[] = [
  {
    name: 'The Desk That Means Business',
    slug: 'remote-work-starter',
    tagline: 'Your complete remote work setup in one order',
    category: 'Remote Work',
    pricePesewas: 75000,
    comparePricePesewas: 89000,
    stockCount: 50,
    imageUrl: null,
    displayItems: [
      { name: 'Mechanical Keyboard TKL', isBonus: false },
      { name: 'USB-C Hub', isBonus: false },
      { name: 'Laptop Stand', isBonus: false },
      { name: 'Cable Management Kit', isBonus: true },
    ],
  },
  {
    name: 'The Studio Upgrade',
    slug: 'creator-setup',
    tagline: 'Everything you need to create like a pro',
    category: 'Content Creation',
    pricePesewas: 135000,
    comparePricePesewas: 160000,
    stockCount: 50,
    imageUrl: null,
    displayItems: [
      { name: 'Ring Light Pro 18"', isBonus: false },
      { name: 'Webcam 4K', isBonus: false },
      { name: 'Desk Mic', isBonus: false },
      { name: 'Green Screen Backdrop', isBonus: true },
    ],
  },
  {
    name: 'The Setup That Levels You Up',
    slug: 'gaming-edge',
    tagline: 'Dominate with gear built for winners',
    category: 'Gaming',
    pricePesewas: 100000,
    comparePricePesewas: 120000,
    stockCount: 50,
    imageUrl: null,
    displayItems: [
      { name: 'Gaming Mouse', isBonus: false },
      { name: 'Mechanical Keyboard', isBonus: false },
      { name: 'Gaming Headset', isBonus: false },
      { name: 'Mouse Pad XL', isBonus: true },
    ],
  },
];

function apiBundleToDisplay(bundle: Bundle): FallbackBundle {
  return {
    name: bundle.name,
    slug: bundle.slug,
    tagline: bundle.tagline ?? '',
    category: bundle.category ?? '',
    pricePesewas: bundle.pricePesewas,
    comparePricePesewas: bundle.comparePricePesewas ?? 0,
    stockCount: bundle.stockCount,
    imageUrl: bundle.imageUrl,
    displayItems: bundle.items.map((item) => ({
      name: item.product.name,
      isBonus: item.isBonus,
    })),
  };
}

function BundleCard({ bundle }: { bundle: FallbackBundle }) {
  const savings = bundle.comparePricePesewas > bundle.pricePesewas
    ? bundle.comparePricePesewas - bundle.pricePesewas
    : 0;

  const regularItems = bundle.displayItems.filter((i) => !i.isBonus);
  const bonusItems = bundle.displayItems.filter((i) => i.isBonus);

  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="bundle-card"
    >
      {/* Header: Category + Savings */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          gap: 12,
        }}
      >
        {bundle.category && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '1.5px',
              textTransform: 'uppercase' as const,
              color: 'var(--muted)',
            }}
          >
            {bundle.category}
          </span>
        )}
        {savings > 0 && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.5px',
              padding: '4px 10px',
              borderRadius: 4,
              background: 'rgba(0, 201, 167, 0.12)',
              color: 'var(--teal)',
              fontWeight: 600,
              whiteSpace: 'nowrap' as const,
            }}
          >
            SAVE {formatPesewas(savings)}
          </span>
        )}
      </div>

      {/* Image placeholder */}
      <div
        style={{
          width: '100%',
          aspectRatio: '4/3',
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 20,
          background: 'var(--deep)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {bundle.imageUrl ? (
          <img
            src={bundle.imageUrl}
            alt={bundle.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }}
          />
        ) : (
          <Package size={48} style={{ color: 'var(--border)' }} />
        )}
      </div>

      {/* Name + Tagline */}
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.2rem',
          fontWeight: 700,
          color: 'var(--white)',
          marginBottom: 6,
        }}
      >
        {bundle.name}
      </h3>
      <p
        style={{
          fontSize: '0.85rem',
          color: 'var(--muted)',
          marginBottom: 16,
          lineHeight: 1.4,
        }}
      >
        {bundle.tagline}
      </p>

      {/* Items list */}
      <ul
        style={{
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          marginBottom: 20,
          flex: 1,
          padding: 0,
        }}
      >
        {regularItems.map((item) => (
          <li
            key={item.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: '0.85rem',
              color: 'var(--white)',
            }}
          >
            <Check size={16} style={{ color: 'var(--teal)', flexShrink: 0 }} />
            <span>{item.name}</span>
          </li>
        ))}
        {bonusItems.map((item) => (
          <li
            key={item.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: '0.85rem',
              color: 'var(--gold)',
            }}
          >
            <Gift size={16} style={{ flexShrink: 0 }} />
            <span>{item.name}</span>
            <span
              style={{
                marginLeft: 'auto',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '1px',
                padding: '2px 8px',
                borderRadius: 2,
                background: 'var(--gold)',
                color: 'var(--black)',
                fontWeight: 700,
              }}
            >
              FREE
            </span>
          </li>
        ))}
      </ul>

      {/* Pricing */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--gold)',
          }}
        >
          {formatPesewas(bundle.pricePesewas)}
        </span>
        {bundle.comparePricePesewas > 0 && (
          <span
            style={{
              fontSize: '0.9rem',
              textDecoration: 'line-through',
              color: 'var(--muted)',
            }}
          >
            {formatPesewas(bundle.comparePricePesewas)}
          </span>
        )}
      </div>

      {/* CTA */}
      <Link
        href="/products"
        className="btn-primary"
        style={{
          width: '100%',
          textAlign: 'center',
          fontSize: '0.85rem',
          padding: '14px 16px',
          display: 'block',
        }}
      >
        Pre-Order This Bundle &mdash; Pay with MoMo
      </Link>

      {/* Trust line */}
      <div
        style={{
          textAlign: 'center',
          marginTop: 10,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.3px',
          color: 'var(--muted)',
        }}
      >
        48h delivery in Bolgatanga &middot; 7-day returns &middot; {bundle.stockCount} units this batch
      </div>
    </div>
  );
}

export function PreorderBundles() {
  const sectionRef = useRef<HTMLElement>(null);
  const [bundles, setBundles] = useState<FallbackBundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const response = await getFeaturedBundles();
        const apiBundles = (response.data ?? []) as Bundle[];
        setBundles(
          apiBundles.length > 0
            ? apiBundles.map(apiBundleToDisplay)
            : FALLBACK_BUNDLES,
        );
      } catch {
        setBundles(FALLBACK_BUNDLES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBundles();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [isLoading, bundles]);

  return (
    <section
      className="preorder-bundles reveal-element"
      id="bundles"
      ref={sectionRef}
      style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}
    >
      <div className="section-tag">// PRE-ORDER BUNDLES</div>
      <h2 className="section-title">
        Your complete setup,<br />one order.
      </h2>
      <p
        style={{
          fontSize: '1rem',
          color: 'var(--muted)',
          maxWidth: 520,
          lineHeight: 1.6,
          marginTop: 12,
          marginBottom: 48,
        }}
      >
        Curated bundles with everything you need &mdash; priced lower than buying
        separately. Limited first-batch units.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
        }}
      >
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 500,
                  background: 'var(--deep)',
                  borderRadius: 16,
                  opacity: 0.4,
                }}
              />
            ))
          : bundles.map((bundle) => (
              <BundleCard key={bundle.slug} bundle={bundle} />
            ))}
      </div>

      {/* Guarantee */}
      <div
        style={{
          textAlign: 'center',
          marginTop: 40,
          padding: '16px 24px',
          borderRadius: 12,
          border: '1px solid var(--border)',
          background: 'var(--card)',
          fontSize: '0.85rem',
          color: 'var(--muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: '1.2rem', color: 'var(--teal)' }}>&#9432;</span>
        7-day no-questions return. If it&apos;s not right, we&apos;ll sort it &mdash; MoMo refund within 24h.
      </div>
    </section>
  );
}
