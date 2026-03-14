'use client';

import { useEffect, useRef } from 'react';

const TRUST_ITEMS = [
  { icon: '\uD83D\uDCF1', label: 'MTN MoMo Accepted' },
  { icon: '\uD83D\uDCB3', label: 'Visa & Mastercard' },
  { icon: '\uD83D\uDE9A', label: '48h Delivery in Bolgatanga' },
  { icon: '\u2705', label: 'Verified Imports Only' },
  { icon: '\uD83D\uDD04', label: '7-Day Easy Returns' },
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
      {TRUST_ITEMS.map((item) => (
        <div className="trust-item" key={item.label}>
          <span className="trust-icon">{item.icon}</span>
          <span className="trust-label">{item.label}</span>
        </div>
      ))}
    </section>
  );
}
