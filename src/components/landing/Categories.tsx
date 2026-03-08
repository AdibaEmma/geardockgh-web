'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface Category {
  icon: string;
  iconLabel: string;
  title: string;
  slug: string;
  description: string;
  count: string;
  startingFrom: string;
}

const CATEGORIES: Category[] = [
  {
    icon: '\uD83D\uDCBC',
    iconLabel: 'Briefcase',
    title: 'Remote Work',
    slug: 'remote-work',
    description:
      'Ergonomic desks, monitors, mechanical keyboards, webcams, and noise-cancelling headsets built for deep work.',
    count: '// 48 PRODUCTS',
    startingFrom: 'GH\u20B5 180',
  },
  {
    icon: '\uD83C\uDFAC',
    iconLabel: 'Clapper board',
    title: 'Creator Tools',
    slug: 'creator-tools',
    description:
      'Ring lights, microphones, capture cards, green screens, and camera accessories for your next viral upload.',
    count: '// 62 PRODUCTS',
    startingFrom: 'GH\u20B5 120',
  },
  {
    icon: '\uD83C\uDFAE',
    iconLabel: 'Game controller',
    title: 'Gaming Setup',
    slug: 'gaming',
    description:
      'High-refresh monitors, gaming mice, RGB peripherals, chairs, and controllers for PC and console gamers.',
    count: '// 55 PRODUCTS',
    startingFrom: 'GH\u20B5 250',
  },
  {
    icon: '\uD83D\uDCDA',
    iconLabel: 'Books',
    title: 'Student Essentials',
    slug: 'student-essentials',
    description:
      'Laptop stands, portable monitors, study lighting, cable management, and accessories on a student-friendly budget.',
    count: '// 38 PRODUCTS',
    startingFrom: 'GH\u20B5 90',
  },
];

export function Categories() {
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

    const cards = grid.querySelectorAll('.category-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section" id="categories">
      <div className="section-tag">// 04 CATEGORIES</div>
      <h2 className="section-title">
        Everything<br />your workspace needs.
      </h2>
      <div className="categories-grid" ref={gridRef}>
        {CATEGORIES.map((cat) => (
          <Link
            href={`/products?category=${cat.slug}`}
            className="category-card reveal-element"
            key={cat.title}
          >
            <span className="cat-icon" role="img" aria-label={cat.iconLabel}>
              {cat.icon}
            </span>
            <div className="cat-title">{cat.title}</div>
            <div className="cat-desc">{cat.description}</div>
            <div className="cat-price">
              <span>From </span>{cat.startingFrom}
            </div>
            <div className="cat-count">{cat.count}</div>
            <div className="cat-arrow">&rarr;</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
