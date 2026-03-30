'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Smartphone, CreditCard, Truck, ShieldCheck, RefreshCw } from 'lucide-react';

const TRUST_ITEMS: { icon: LucideIcon; label: string; href?: string }[] = [
  { icon: Smartphone, label: 'MTN MoMo Accepted' },
  { icon: CreditCard, label: 'Visa & Mastercard' },
  { icon: Truck, label: '48h Delivery in Bolgatanga' },
  { icon: ShieldCheck, label: 'Verified Imports Only' },
  { icon: RefreshCw, label: '7-Day Easy Returns', href: '/returns' },
];

export function TrustBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="trust-bar reveal-element" ref={barRef}>
      {TRUST_ITEMS.map((item) => {
        const content = (
          <>
            <span className="trust-icon">
              <item.icon size={18} style={{ color: 'var(--gold)' }} />
            </span>
            <span className="trust-label">{item.label}</span>
          </>
        );

        return item.href ? (
          <Link
            href={item.href}
            className="trust-item"
            key={item.label}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {content}
          </Link>
        ) : (
          <div className="trust-item" key={item.label}>
            {content}
          </div>
        );
      })}
    </section>
  );
}
