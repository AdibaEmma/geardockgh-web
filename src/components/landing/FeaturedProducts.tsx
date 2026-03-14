'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface Product {
  emoji: string;
  emojiLabel: string;
  badge: string;
  name: string;
  slug: string;
  nameHtml?: boolean;
  description: string;
  price: string;
  comparePrice?: string;
  priceUnit?: string;
  rating: number;
  reviewCount: number;
  featured?: boolean;
}

const PRODUCTS: Product[] = [
  {
    emoji: '\uD83C\uDFA7',
    emojiLabel: 'Headphones',
    badge: 'Best Seller',
    name: 'Sony WH-1000XM5 Noise-Cancelling',
    slug: 'sony-wh-1000xm5',
    nameHtml: true,
    description:
      "Industry-leading ANC. 30hr battery. Perfect for deep work in Bolgatanga heat or Tamale bustle.",
    price: 'GH\u20B5 2,400',
    comparePrice: 'GH\u20B5 3,100',
    priceUnit: '/ unit',
    rating: 5,
    reviewCount: 47,
    featured: true,
  },
  {
    emoji: '\uD83D\uDCF8',
    emojiLabel: 'Camera',
    badge: 'Creator Pick',
    name: 'Ring Light Pro 18"',
    slug: 'ring-light-pro-18',
    description: 'Adjustable CCT + remote. Great for reels, YouTube, or Zoom.',
    price: 'GH\u20B5 680',
    comparePrice: 'GH\u20B5 850',
    rating: 5,
    reviewCount: 24,
  },
  {
    emoji: '\u2328\uFE0F',
    emojiLabel: 'Keyboard',
    badge: 'New Arrival',
    name: 'Mechanical Keyboard TKL',
    slug: 'mechanical-keyboard-tkl',
    description: 'Red switches, RGB backlit, compact tenkeyless layout.',
    price: 'GH\u20B5 520',
    rating: 4,
    reviewCount: 18,
  },
  {
    emoji: '\uD83D\uDDA5\uFE0F',
    emojiLabel: 'Desktop computer',
    badge: 'Remote Fav',
    name: 'Laptop Stand \u2014 Foldable',
    slug: 'laptop-stand-foldable',
    description: 'Ergonomic aluminum. Works with any 10\u201317\u201D laptop.',
    price: 'GH\u20B5 180',
    comparePrice: 'GH\u20B5 240',
    rating: 5,
    reviewCount: 63,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="product-rating">
      <div className="stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <div className={`star${i < count ? '' : ' empty'}`} key={i} />
        ))}
      </div>
      <span className="review-count">({PRODUCTS.find((p) => p.rating === count)?.reviewCount})</span>
    </div>
  );
}

function ProductStars({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="product-rating">
      <div className="stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <div className={`star${i < rating ? '' : ' empty'}`} key={i} />
        ))}
      </div>
      <span className="review-count">({reviewCount})</span>
    </div>
  );
}

export function FeaturedProducts() {
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

    const cards = grid.querySelectorAll('.product-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="featured" id="featured">
      <div className="section-tag">// FEATURED PICKS</div>
      <h2 className="section-title">
        Top gear,<br />hand-selected.
      </h2>
      <div className="products-grid" ref={gridRef}>
        {PRODUCTS.map((product) => (
          <Link
            href={`/products/${product.slug}`}
            className={`product-card reveal-element${product.featured ? ' featured-card' : ''}`}
            key={product.name}
          >
            <div className="product-action">&rarr;</div>
            <span
              className="product-emoji"
              role="img"
              aria-label={product.emojiLabel}
            >
              {product.emoji}
            </span>
            <div className="product-badge">{product.badge}</div>
            <ProductStars rating={product.rating} reviewCount={product.reviewCount} />
            <div className="product-name">
              {product.nameHtml ? (
                <>
                  Sony WH-1000XM5<br />Noise-Cancelling
                </>
              ) : (
                product.name
              )}
            </div>
            <div className="product-desc">{product.description}</div>
            <div className="product-price">
              {product.price}
              {product.comparePrice && (
                <span className="product-compare-price">{product.comparePrice}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div className="view-all-cta">
        <Link href="/products" className="view-all-link">
          View All Products &rarr;
        </Link>
      </div>
    </section>
  );
}
