'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, Package, Heart } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Search, label: 'Shop', href: '/products' },
  { icon: ShoppingBag, label: 'Cart', href: '/cart' },
  { icon: Heart, label: 'Wishlist', href: '/wishlist' },
  { icon: Package, label: 'Pre-Order', href: '/preorder' },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      // Only toggle after a meaningful scroll (threshold of 10px)
      if (delta > 10 && currentY > 100) {
        setVisible(false); // scrolling down
      } else if (delta < -10) {
        setVisible(true); // scrolling up
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`mobile-bottom-nav ${visible ? '' : 'hidden-nav'}`}
      role="navigation"
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        const isCart = item.href === '/cart';
        const isWishlist = item.href === '/wishlist';
        const badgeCount = isCart ? cartCount : isWishlist ? wishlistCount : 0;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-bottom-nav-item ${active ? 'active' : ''}`}
          >
            <span className="mobile-bottom-nav-icon">
              <Icon
                size={22}
                strokeWidth={active ? 2.2 : 1.5}
                fill={isWishlist && wishlistCount > 0 ? 'currentColor' : 'none'}
              />
              {badgeCount > 0 && (
                <span className="mobile-bottom-nav-badge">
                  {badgeCount > 9 ? '9+' : badgeCount}
                </span>
              )}
            </span>
            <span className="mobile-bottom-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
