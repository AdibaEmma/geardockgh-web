'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, LogOut, Menu, X, Shield } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { useLogout } from '@/hooks/use-auth';
import { CartDrawer } from './CartDrawer';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function ShopHeader() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const { mutate: logout } = useLogout();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b shadow-sm backdrop-blur-sm"
        style={{
          background: 'color-mix(in srgb, var(--deep) 92%, transparent)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-[family-name:var(--font-outfit)] text-lg font-bold"
            style={{ color: 'var(--teal)' }}
          >
            <img
              src="/images/branding/geardockgh-logo-nobg.png"
              alt=""
              className="h-16 w-16 -my-4 -ml-2 -mr-3 object-contain"
            />
            GearDock<span style={{ color: 'var(--gold)' }}>GH</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            <ThemeToggle />
            <Link
              href="/products"
              className="text-sm transition-colors hover:text-[var(--gold)]"
              style={{ color: 'var(--muted)' }}
            >
              Products
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--gold)]"
              style={{ color: 'var(--muted)' }}
            >
              <ShoppingCart size={18} />
              <span>Cart</span>
              {count > 0 && (
                <span className="absolute -right-2.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--gold)] font-[family-name:var(--font-space-mono)] text-[10px] font-bold text-[var(--deep)]">
                  {count}
                </span>
              )}
            </button>

            {/* Orders */}
            <Link
              href="/orders"
              className="text-sm transition-colors hover:text-[var(--gold)]"
              style={{ color: 'var(--muted)' }}
            >
              Orders
            </Link>

            {/* Admin */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[var(--gold)]"
                style={{ color: 'var(--gold)' }}
              >
                <Shield size={16} />
                Admin
              </Link>
            )}

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--gold)]"
                  style={{ color: 'var(--white)' }}
                >
                  <User size={16} />
                  {user.firstName}
                </Link>
                <button
                  onClick={() => logout()}
                  className="rounded-lg p-1.5 transition-colors hover:bg-[var(--hover-bg)]"
                  style={{ color: 'var(--muted)' }}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-lg border px-3 py-1.5 text-sm font-medium transition-all hover:border-[var(--gold)] hover:text-[var(--gold)]"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--white)',
                }}
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile: Cart + Menu */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setCartOpen(true)}
              className="relative"
              style={{ color: 'var(--muted)' }}
            >
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--gold)] font-[family-name:var(--font-space-mono)] text-[10px] font-bold text-[var(--deep)]">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: 'var(--muted)' }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="animate-[slideDown_200ms_ease-out] border-t px-4 py-4 md:hidden"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex flex-col gap-3">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm"
                style={{ color: 'var(--muted)' }}
              >
                Products
              </Link>
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm"
                style={{ color: 'var(--muted)' }}
              >
                Orders
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 text-sm font-medium"
                  style={{ color: 'var(--gold)' }}
                >
                  <Shield size={16} />
                  Admin
                </Link>
              )}
              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm"
                    style={{ color: 'var(--white)' }}
                  >
                    Hi, {user.firstName}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-sm text-red-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm"
                  style={{ color: 'var(--gold)' }}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
