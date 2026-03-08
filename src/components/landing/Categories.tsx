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
    icon: '🪑',
    iconLabel: 'Desk',
    title: 'Desks & Furniture',
    slug: 'desks-furniture',
    description:
      'Standing desks, ergonomic chairs, monitor arms, and workspace furniture designed for comfort and productivity.',
    count: '// DESKS & FURNITURE',
    startingFrom: 'GH\u20B5 350',
  },
  {
    icon: '\uD83D\uDCBB',
    iconLabel: 'Laptop',
    title: 'Laptops & Computers',
    slug: 'laptops-computers',
    description:
      'Laptops, desktops, mini PCs, and computing essentials for work, creative projects, and everyday use.',
    count: '// LAPTOPS & COMPUTERS',
    startingFrom: 'GH\u20B5 2,500',
  },
  {
    icon: '\uD83D\uDDA5\uFE0F',
    iconLabel: 'Monitor',
    title: 'Monitors & Displays',
    slug: 'monitors-displays',
    description:
      'High-resolution monitors, ultrawide displays, portable screens, and display accessories for any setup.',
    count: '// MONITORS & DISPLAYS',
    startingFrom: 'GH\u20B5 800',
  },
  {
    icon: '\uD83C\uDFA7',
    iconLabel: 'Headphones',
    title: 'Audio & Headphones',
    slug: 'audio-headphones',
    description:
      'Headphones, earbuds, microphones, speakers, and audio interfaces for calls, music, and content creation.',
    count: '// AUDIO & HEADPHONES',
    startingFrom: 'GH\u20B5 120',
  },
  {
    icon: '\u2328\uFE0F',
    iconLabel: 'Keyboard',
    title: 'Keyboards & Mice',
    slug: 'keyboards-mice',
    description:
      'Mechanical keyboards, wireless mice, trackpads, and input devices for precision and comfort.',
    count: '// KEYBOARDS & MICE',
    startingFrom: 'GH\u20B5 90',
  },
  {
    icon: '\uD83D\uDCF7',
    iconLabel: 'Camera',
    title: 'Cameras & Video',
    slug: 'cameras-video',
    description:
      'Webcams, action cameras, ring lights, capture cards, and video gear for streaming and content creation.',
    count: '// CAMERAS & VIDEO',
    startingFrom: 'GH\u20B5 150',
  },
  {
    icon: '\uD83D\uDD0C',
    iconLabel: 'Plug',
    title: 'Accessories',
    slug: 'accessories',
    description:
      'Cables, adapters, hubs, docking stations, and desk accessories to complete your setup.',
    count: '// ACCESSORIES',
    startingFrom: 'GH\u20B5 30',
  },
  {
    icon: '\uD83D\uDCA1',
    iconLabel: 'Light bulb',
    title: 'Lighting',
    slug: 'lighting',
    description:
      'Desk lamps, LED light bars, monitor backlighting, and ambient lighting for any workspace.',
    count: '// LIGHTING',
    startingFrom: 'GH\u20B5 60',
  },
  {
    icon: '\uD83D\uDCBE',
    iconLabel: 'Floppy disk',
    title: 'Storage & Networking',
    slug: 'storage-networking',
    description:
      'External drives, SSDs, NAS devices, routers, and networking gear for fast, reliable connectivity.',
    count: '// STORAGE & NETWORKING',
    startingFrom: 'GH\u20B5 80',
  },
  {
    icon: '🎮',
    iconLabel: 'Game controller',
    title: 'Gaming Consoles',
    slug: 'gaming-consoles',
    description:
      'PlayStation, Xbox, Nintendo Switch, and handheld consoles for casual and competitive gaming.',
    count: '// GAMING CONSOLES',
    startingFrom: 'GH\u20B5 1,200',
  },
  {
    icon: '🕹️',
    iconLabel: 'Joystick',
    title: 'Gaming Accessories',
    slug: 'gaming-accessories',
    description:
      'Controllers, gaming headsets, charging docks, console stands, and peripherals to level up your play.',
    count: '// GAMING ACCESSORIES',
    startingFrom: 'GH\u20B5 80',
  },
  {
    icon: '\uD83D\uDCE6',
    iconLabel: 'Package',
    title: 'Other',
    slug: 'other',
    description:
      'Unique finds and uncategorized gear that doesn\u2019t fit neatly into a box \u2014 but belongs on your desk.',
    count: '// OTHER',
    startingFrom: 'GH\u20B5 20',
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
      <div className="section-tag">// 12 CATEGORIES</div>
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
