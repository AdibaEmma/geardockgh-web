'use client';

import { useEffect, useRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ShieldCheck, Smartphone, RefreshCw } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

interface Feature {
  num: string;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    num: '01',
    title: 'Premium, Verified Imports',
    description:
      'Every product is sourced from reputable international suppliers. No knockoffs. No risk. Just gear that works.',
  },
  {
    num: '02',
    title: 'Ghana-First Pricing',
    description:
      'We price in cedis, accept Mobile Money (MTN/Vodafone/AirtelTigo), and offer flexible payment options.',
  },
  {
    num: '03',
    title: 'Fast, Reliable Delivery',
    description:
      '48-hour delivery in Bolgatanga. Nationwide shipping within 5\u20137 days. Real-time tracking on every order.',
  },
  {
    num: '04',
    title: 'Expert Curation',
    description:
      'Every product is tested and selected by remote workers and creators \u2014 not just resold from a catalog.',
  },
];

const TRUST_STATS = [
  { value: '50', suffix: '+', label: 'Orders Delivered' },
  { value: '4.9', suffix: '/5', label: 'Customer Rating' },
  { value: '20', suffix: '+', label: 'Products Curated' },
  { value: '48', suffix: 'h', label: 'Bolgatanga Delivery' },
];

const TRUST_BADGES: { icon: LucideIcon; label: string }[] = [
  { icon: ShieldCheck, label: 'Verified Imports' },
  { icon: Smartphone, label: 'MoMo Accepted' },
  { icon: RefreshCw, label: 'Easy Returns' },
];

export function WhyUs() {
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = featuresRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = container.querySelectorAll('.why-item');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="why" id="why">
      <div className="why-grid">
        <div className="why-left">
          <div className="section-tag">// WHY GEARDOCKGH</div>
          <h2 className="section-title">
            Built for<br />Ghana&apos;s digital<br />workforce.
          </h2>
          <div className="why-features" ref={featuresRef}>
            {FEATURES.map((feature) => (
              <div className="why-item reveal-element" key={feature.num}>
                <div className="why-num">{feature.num}</div>
                <div>
                  <div className="why-title">{feature.title}</div>
                  <div className="why-desc">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="why-right-revamped">
          <div className="trust-grid">
            {TRUST_STATS.map((stat) => (
              <div className="trust-stat" key={stat.label}>
                <div className="trust-stat-num">
                  <AnimatedCounter value={stat.value} /><span>{stat.suffix}</span>
                </div>
                <div className="trust-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="trust-badges">
            {TRUST_BADGES.map((badge) => (
              <div className="trust-badge-item" key={badge.label}>
                <badge.icon size={16} style={{ color: 'var(--gold)' }} />
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
