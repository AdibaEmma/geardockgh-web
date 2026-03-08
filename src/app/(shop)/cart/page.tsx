'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { formatPesewas } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalPesewas = useCartStore((s) => s.totalPesewas);
  const itemCount = useCartStore((s) => s.itemCount);
  const user = useAuthStore((s) => s.user);

  const handleCheckout = () => {
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <ShoppingBag
          size={56}
          className="mb-4"
          style={{ color: 'var(--border)' }}
        />
        <h1
          className="mb-2 font-[family-name:var(--font-syne)] text-xl font-bold"
          style={{ color: 'var(--white)' }}
        >
          Your cart is empty
        </h1>
        <p className="mb-6 text-sm" style={{ color: 'var(--muted)' }}>
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link href="/products">
          <Button variant="primary" size="md">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/products"
            className="mb-2 inline-flex items-center gap-1.5 text-xs transition-colors hover:text-[var(--gold)]"
            style={{ color: 'var(--muted)' }}
          >
            <ArrowLeft size={14} />
            Continue Shopping
          </Link>
          <h1
            className="font-[family-name:var(--font-syne)] text-2xl font-bold"
            style={{ color: 'var(--white)' }}
          >
            Shopping Cart ({itemCount()})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs transition-colors hover:text-red-400"
          style={{ color: 'var(--muted)' }}
        >
          Clear All
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex gap-4 rounded-xl border p-4"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--card)',
                }}
              >
                {/* Image */}
                <div
                  className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg"
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
                        size={24}
                        style={{ color: 'var(--muted)' }}
                      />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: 'var(--white)' }}
                      >
                        {item.name}
                      </p>
                      <p
                        className="mt-0.5 text-sm font-semibold"
                        style={{ color: 'var(--gold)' }}
                      >
                        {formatPesewas(item.pricePesewas)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-500/10"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    {/* Quantity controls */}
                    <div
                      className="flex items-center gap-0 rounded-lg border"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity - 1,
                          )
                        }
                        className="px-3 py-1.5 transition-colors hover:bg-white/5"
                        style={{ color: 'var(--muted)' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span
                        className="min-w-[2.5rem] border-x px-3 py-1.5 text-center font-[family-name:var(--font-space-mono)] text-sm"
                        style={{
                          color: 'var(--white)',
                          borderColor: 'var(--border)',
                        }}
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
                        className="px-3 py-1.5 transition-colors hover:bg-white/5"
                        style={{ color: 'var(--muted)' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Line total */}
                    <span
                      className="font-[family-name:var(--font-space-mono)] text-sm font-semibold"
                      style={{ color: 'var(--white)' }}
                    >
                      {formatPesewas(item.pricePesewas * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div
            className="sticky top-24 rounded-xl border p-6"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--card)',
            }}
          >
            <h2
              className="mb-4 font-[family-name:var(--font-syne)] text-lg font-bold"
              style={{ color: 'var(--white)' }}
            >
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--muted)' }}>
                  Subtotal ({itemCount()} {itemCount() === 1 ? 'item' : 'items'})
                </span>
                <span
                  className="font-[family-name:var(--font-space-mono)] text-sm"
                  style={{ color: 'var(--white)' }}
                >
                  {formatPesewas(totalPesewas())}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--muted)' }}>
                  Delivery
                </span>
                <span className="text-sm" style={{ color: 'var(--muted)' }}>
                  Calculated at checkout
                </span>
              </div>
            </div>

            <div
              className="my-4 border-t"
              style={{ borderColor: 'var(--border)' }}
            />

            <div className="mb-6 flex items-center justify-between">
              <span
                className="font-[family-name:var(--font-syne)] font-bold"
                style={{ color: 'var(--white)' }}
              >
                Total
              </span>
              <span
                className="font-[family-name:var(--font-syne)] text-xl font-bold"
                style={{ color: 'var(--gold)' }}
              >
                {formatPesewas(totalPesewas())}
              </span>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleCheckout}
            >
              {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
            </Button>

            {!user && (
              <p className="mt-3 text-center text-xs" style={{ color: 'var(--muted)' }}>
                You&apos;ll need to sign in before completing your order
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
