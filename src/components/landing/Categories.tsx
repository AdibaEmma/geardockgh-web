'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  Smartphone,
  Armchair,
  Laptop,
  Headphones,
  Battery,
  Camera,
  Cable,
  HardDrive,
  Gamepad2,
} from 'lucide-react';

interface Category {
  icon: LucideIcon;
  title: string;
  slug: string;
  description: string;
  count: string;
  startingFrom: string;
}

const CATEGORIES: Category[] = [
  {
    icon: Smartphone,
    title: 'Phones & Tablets',
    slug: 'phones-tablets',
    description: 'Smartphones, tablets & mobile accessories.',
    count: '// PHONES & TABLETS',
    startingFrom: 'GH₵ 800',
  },
  {
    icon: Laptop,
    title: 'Computing',
    slug: 'computing',
    description: 'Laptops, monitors, keyboards & mice for work and creative projects.',
    count: '// COMPUTING',
    startingFrom: 'GH₵ 90',
  },
  {
    icon: Headphones,
    title: 'Audio',
    slug: 'audio',
    description: 'Headphones, mics & speakers — hear everything, be heard clearly.',
    count: '// AUDIO',
    startingFrom: 'GH₵ 120',
  },
  {
    icon: Armchair,
    title: 'Home & Office',
    slug: 'home-office',
    description: 'Desks, chairs, lighting & fans — your body pays the price of a bad setup.',
    count: '// HOME & OFFICE',
    startingFrom: 'GH₵ 60',
  },
  {
    icon: Battery,
    title: 'Power & Energy',
    slug: 'power-energy',
    description: 'Power stations, UPS systems & solar panels — dumsor-proof your setup.',
    count: '// POWER & ENERGY',
    startingFrom: 'GH₵ 200',
  },
  {
    icon: Camera,
    title: 'Cameras & Video',
    slug: 'cameras-video',
    description: 'Webcams, ring lights & capture cards for streaming and content.',
    count: '// CAMERAS & VIDEO',
    startingFrom: 'GH₵ 150',
  },
  {
    icon: Cable,
    title: 'Accessories',
    slug: 'accessories',
    description: 'Cables, hubs, docks & desk accessories to complete your setup.',
    count: '// ACCESSORIES',
    startingFrom: 'GH₵ 30',
  },
  {
    icon: HardDrive,
    title: 'Storage & Networking',
    slug: 'storage-networking',
    description: 'SSDs, external drives & routers for fast, reliable connectivity.',
    count: '// STORAGE & NETWORKING',
    startingFrom: 'GH₵ 80',
  },
  {
    icon: Gamepad2,
    title: 'Gaming',
    slug: 'gaming',
    description: 'Consoles, controllers, headsets & peripherals to level up your play.',
    count: '// GAMING',
    startingFrom: 'GH₵ 80',
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
            observer.unobserve(entry.target);
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
      <div className="section-tag">// 10 CATEGORIES</div>
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
            <span className="cat-icon">
              <cat.icon size={28} style={{ color: 'var(--gold)' }} />
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
      <div className="swipe-indicator">Swipe to explore</div>
    </section>
  );
}
