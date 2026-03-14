'use client';

import { useEffect, useRef } from 'react';

const STEPS = [
  {
    num: '01',
    emoji: '\uD83D\uDED2',
    title: 'Browse & Add to Cart',
    description:
      'Explore curated gear across 4 categories. Filter by budget, category, or popularity.',
  },
  {
    num: '02',
    emoji: '\uD83D\uDCF1',
    title: 'Pay with MoMo or Card',
    description:
      'Checkout with MTN MoMo, Vodafone Cash, AirtelTigo Money, or Visa/Mastercard. All secure.',
  },
  {
    num: '03',
    emoji: '\uD83D\uDCE6',
    title: 'Delivered to Your Door',
    description:
      '48-hour delivery in Bolgatanga. Nationwide shipping within 5\u20137 days. Real-time tracking included.',
  },
];

export function HowItWorks() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = grid.querySelectorAll('.step-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="how-it-works" id="how">
      <div className="section-tag">// HOW IT WORKS</div>
      <h2 className="section-title">
        Three steps to<br />your new setup.
      </h2>
      <div className="steps-grid" ref={gridRef}>
        {STEPS.map((step) => (
          <div className="step-card reveal-element" key={step.num}>
            <div className="step-num">{step.num}</div>
            <span className="step-emoji">{step.emoji}</span>
            <div className="step-title">{step.title}</div>
            <div className="step-desc">{step.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
