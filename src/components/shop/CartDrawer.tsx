'use client';

import { useEffect, useRef } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { formatPesewas } from '@/lib/utils/formatters';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = items.reduce((sum, item) => sum + item.pricePesewas * item.quantity, 0);
  const user = useAuthStore((s) => s.user);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l"
        style={{
          background: 'var(--deep)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2
            className="flex items-center gap-2 font-[family-name:var(--font-syne)] text-lg font-bold"
            style={{ color: 'var(--white)' }}
          >
            <ShoppingBag size={20} />
            Cart ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors hover:bg-white/5"
            style={{ color: 'var(--muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <ShoppingBag
                size={48}
                className="mb-4"
                style={{ color: 'var(--border)' }}
              />
              <p
                className="text-sm font-medium"
                style={{ color: 'var(--muted)' }}
              >
                Your cart is empty
              </p>
              <Link
                href="/products"
                onClick={onClose}
                className="mt-3 text-sm font-medium transition-colors hover:underline"
                style={{ color: 'var(--gold)' }}
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex gap-4 rounded-lg border p-3"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--card)',
                  }}
                >
                  {/* Image */}
                  <div
                    className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg"
                    style={{ background: 'var(--deep)' }}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ShoppingBag
                          size={16}
                          style={{ color: 'var(--muted)' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p
                        className="line-clamp-1 text-sm font-medium"
                        style={{ color: 'var(--white)' }}
                      >
                        {item.name}
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: 'var(--gold)' }}
                      >
                        {formatPesewas(item.pricePesewas)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity - 1,
                            )
                          }
                          className="rounded p-1 transition-colors hover:bg-white/5"
                          style={{ color: 'var(--muted)' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span
                          className="min-w-[1.5rem] text-center font-[family-name:var(--font-space-mono)] text-xs"
                          style={{ color: 'var(--white)' }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity + 1,
                            )
                          }
                          className="rounded p-1 transition-colors hover:bg-white/5"
                          style={{ color: 'var(--muted)' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeItem(item.productId, item.variantId)
                        }
                        className="rounded p-1 text-red-400 transition-colors hover:bg-red-500/10"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="border-t px-6 py-4"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="mb-4 flex items-center justify-between">
              <span
                className="text-sm"
                style={{ color: 'var(--muted)' }}
              >
                Subtotal
              </span>
              <span
                className="font-[family-name:var(--font-syne)] text-lg font-bold"
                style={{ color: 'var(--gold)' }}
              >
                {formatPesewas(total)}
              </span>
            </div>

            {user ? (
              <Link href="/checkout" onClick={onClose}>
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
            ) : (
              <Link href="/login?redirect=/checkout" onClick={onClose}>
                <Button className="w-full" size="lg">
                  Sign in to Checkout
                </Button>
              </Link>
            )}

            <button
              onClick={clearCart}
              className="mt-3 w-full text-center text-xs transition-colors hover:text-red-400"
              style={{ color: 'var(--muted)' }}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
