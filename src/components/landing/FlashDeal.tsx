'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const SPECS = ['30h Battery', 'ANC', 'Bluetooth 5.3', 'USB-C'];

export function FlashDeal() {
  const sectionRef = useRef<HTMLElement>(null);

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
  }, []);

  return (
    <section className="flash-deal reveal-element" ref={sectionRef}>
      <div className="flash-deal-inner">
        <div className="flash-left">
          <div className="flash-tag">
            <span className="flash-dot" />
            DEAL OF THE WEEK
          </div>
          <h2 className="flash-title">
            Sony WH-1000XM5<br />
            <span>Noise-Cancelling</span>
          </h2>
          <div className="flash-specs">
            {SPECS.map((spec) => (
              <div className="spec-item" key={spec}>{spec}</div>
            ))}
          </div>
          <div className="flash-pricing">
            <span className="flash-price">GH&#8373; 2,400</span>
            <span className="flash-compare">GH&#8373; 3,100</span>
            <span className="flash-save">SAVE 23%</span>
          </div>
          <div className="flash-stock">
            <div className="stock-bar">
              <div className="stock-fill" style={{ width: '35%' }} />
            </div>
            <span className="stock-text">Only 7 left in stock</span>
          </div>
          <Link href="/products/sony-wh-1000xm5" className="btn-primary flash-cta">
            Grab This Deal &rarr;
          </Link>
        </div>
        <div className="flash-right">
          <div className="flash-emoji" role="img" aria-label="Headphones">
            &#x1F3A7;
          </div>
          <div className="flash-badge">-23%</div>
        </div>
      </div>
    </section>
  );
}
