'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const NAV_ITEMS = [
  { href: '/products', label: 'Shop' },
  { href: '#featured', label: 'Featured' },
  { href: '#how', label: 'How It Works' },
  { href: '#why', label: 'Why Us' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        </ul>

        <div className="nav-actions">
          <ThemeToggle />
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
