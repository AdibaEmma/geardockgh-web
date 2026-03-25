'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  Smartphone,
  Armchair,
  Laptop,
  Monitor,
  Headphones,
  Keyboard,
  Battery,
  Camera,
  Cable,
  Lightbulb,
  HardDrive,
  Gamepad2,
  Joystick,
  Package,
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
    description:
      'Smartphones, tablets, and mobile accessories for staying connected on the go.',
    count: '// PHONES & TABLETS',
    startingFrom: 'GH₵ 800',
  },
  {
    icon: Armchair,
    title: 'Desks & Furniture',
    slug: 'desks-furniture',
    description:
      'Standing desks, ergonomic chairs, monitor arms, and workspace furniture designed for comfort and productivity.',
    count: '// DESKS & FURNITURE',
    startingFrom: 'GH₵ 350',
  },
  {
    icon: Laptop,
    title: 'Laptops & Computers',
    slug: 'laptops-computers',
    description:
      'Laptops, desktops, mini PCs, and computing essentials for work, creative projects, and everyday use.',
    count: '// LAPTOPS & COMPUTERS',
    startingFrom: 'GH₵ 2,500',
  },
  {
    icon: Monitor,
    title: 'Monitors & Displays',
    slug: 'monitors-displays',
    description:
      'High-resolution monitors, ultrawide displays, portable screens, and display accessories for any setup.',
    count: '// MONITORS & DISPLAYS',
    startingFrom: 'GH₵ 800',
  },
  {
    icon: Headphones,
    title: 'Audio & Headphones',
    slug: 'audio-headphones',
    description:
      'Headphones, earbuds, microphones, speakers, and audio interfaces for calls, music, and content creation.',
    count: '// AUDIO & HEADPHONES',
    startingFrom: 'GH₵ 120',
  },
  {
    icon: Keyboard,
    title: 'Keyboards & Mice',
    slug: 'keyboards-mice',
    description:
      'Mechanical keyboards, wireless mice, trackpads, and input devices for precision and comfort.',
    count: '// KEYBOARDS & MICE',
    startingFrom: 'GH₵ 90',
  },
  {
    icon: Battery,
    title: 'Power & Energy',
    slug: 'power-energy',
    description:
      'Portable power stations, UPS systems, solar panels, and power banks to keep your gear running anywhere.',
    count: '// POWER & ENERGY',
    startingFrom: 'GH₵ 200',
  },
  {
    icon: Camera,
    title: 'Cameras & Video',
    slug: 'cameras-video',
    description:
      'Webcams, action cameras, ring lights, capture cards, and video gear for streaming and content creation.',
    count: '// CAMERAS & VIDEO',
    startingFrom: 'GH₵ 150',
  },
  {
    icon: Cable,
    title: 'Accessories',
    slug: 'accessories',
    description:
      'Cables, adapters, hubs, docking stations, and desk accessories to complete your setup.',
    count: '// ACCESSORIES',
    startingFrom: 'GH₵ 30',
  },
  {
    icon: Lightbulb,
    title: 'Lighting',
    slug: 'lighting',
    description:
      'Desk lamps, LED light bars, monitor backlighting, and ambient lighting for any workspace.',
    count: '// LIGHTING',
    startingFrom: 'GH₵ 60',
  },
  {
    icon: HardDrive,
    title: 'Storage & Networking',
    slug: 'storage-networking',
    description:
      'External drives, SSDs, NAS devices, routers, and networking gear for fast, reliable connectivity.',
    count: '// STORAGE & NETWORKING',
    startingFrom: 'GH₵ 80',
  },
  {
    icon: Gamepad2,
    title: 'Gaming Consoles',
    slug: 'gaming-consoles',
    description:
      'PlayStation, Xbox, Nintendo Switch, and handheld consoles for casual and competitive gaming.',
    count: '// GAMING CONSOLES',
    startingFrom: 'GH₵ 1,200',
  },
  {
    icon: Joystick,
    title: 'Gaming Accessories',
    slug: 'gaming-accessories',
    description:
      'Controllers, gaming headsets, charging docks, console stands, and peripherals to level up your play.',
    count: '// GAMING ACCESSORIES',
    startingFrom: 'GH₵ 80',
  },
  {
    icon: Package,
    title: 'Other',
    slug: 'other',
    description:
      'Unique finds and uncategorized gear that doesn\u2019t fit neatly into a box \u2014 but belongs on your desk.',
    count: '// OTHER',
    startingFrom: 'GH₵ 20',
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
      <div className="section-tag">// 13 CATEGORIES</div>
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
    </section>
  );
}
