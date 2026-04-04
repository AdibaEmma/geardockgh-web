'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const NAV_ITEMS = [
  { href: '/products', label: 'Shop' },
  { href: '/preorder', label: 'Pre-Order' },
  { href: '/blog', label: 'Blog' },
  { href: '#featured', label: 'Featured' },
  { href: '#how', label: 'How It Works' },
];

const MORE_ITEMS = [
  { href: '/faq', label: 'FAQ' },
  { href: '/shipping', label: 'Shipping & Delivery' },
  { href: '/about', label: 'About Us' },
  { href: '/returns', label: 'Returns & Terms' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLLIElement>(null);
  const itemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <div className={`announcement-bar${scrolled ? ' hidden' : ''}`}>
        <span>FREE DELIVERY IN BOLGATANGA ON ORDERS OVER GH&#8373; 500</span>
      </div>

      <nav className={`landing-nav${scrolled ? ' scrolled' : ''}`}>
        <Link href="/" className="nav-logo">
          <img src="/images/branding/geardockgh-logo-nobg.png" alt="" className="nav-logo-icon" />
          <span><span style={{ color: 'var(--teal)' }}>GearDock</span><span style={{ color: 'var(--gold)' }}>GH</span></span>
        </Link>

        <ul className="nav-links">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
          <li ref={moreRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setMoreOpen((prev) => !prev)}
              className="nav-more-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: 'none',
                border: 'none',
                color: 'inherit',
                font: 'inherit',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              More
              <ChevronDown
                size={14}
                style={{
                  transition: 'transform 200ms',
                  transform: moreOpen ? 'rotate(180deg)' : 'rotate(0)',
                }}
              />
            </button>
            {moreOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  minWidth: 200,
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: '8px 0',
                  zIndex: 100,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
              >
                {MORE_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    style={{
                      display: 'block',
                      padding: '10px 20px',
                      fontSize: 14,
                      color: 'var(--muted)',
                      textDecoration: 'none',
                      transition: 'color 150ms, background 150ms',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--white)';
                      e.currentTarget.style.background = 'var(--hover-bg, rgba(255,255,255,0.05))';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--muted)';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </li>
        </ul>

        <div className="nav-actions">
          <ThemeToggle />
          <Link
            href="/wishlist"
            className="nav-cart"
            aria-label="Wishlist"
            style={{ position: 'relative' }}
          >
            <Heart size={18} fill={wishlistCount > 0 ? 'currentColor' : 'none'} />
            {wishlistCount > 0 && <span className="cart-badge" style={{ background: '#ef4444' }}>{wishlistCount}</span>}
          </Link>
          <Link href="/cart" className="nav-cart" aria-label="Shopping cart">
            <ShoppingBag size={18} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          <button
            className={`hamburger-btn${mobileOpen ? ' open' : ''}`}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>

          <Link href="/products" className="nav-cta">
            Shop Now
          </Link>
        </div>
      </nav>

      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} onClick={closeMobile}>
            {item.label}
          </Link>
        ))}
        {MORE_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} onClick={closeMobile}>
            {item.label}
          </Link>
        ))}
        <Link
          href="/products"
          className="nav-cta"
          style={{ marginTop: 16 }}
          onClick={closeMobile}
        >
          Shop Now
        </Link>
      </div>
    </>
  );
}
