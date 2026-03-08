'use client';

import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { formatPesewas } from '@/lib/utils/formatters';

export function OrderSummary() {
  const items = useCartStore((s) => s.items);
  const totalPesewas = useCartStore((s) => s.totalPesewas);

  const deliveryFee = 0; // Free delivery for now
  const total = totalPesewas() + deliveryFee;

  return (
    <div
      className="rounded-xl border p-6"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <h3
        className="mb-4 font-[family-name:var(--font-syne)] text-lg font-bold"
        style={{ color: 'var(--white)' }}
      >
        Order Summary
      </h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId}`}
            className="flex items-center gap-3"
          >
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg"
              style={{ background: 'var(--deep)' }}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ShoppingBag size={14} style={{ color: 'var(--muted)' }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="truncate text-sm"
                style={{ color: 'var(--white)' }}
              >
                {item.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                Qty: {item.quantity}
              </p>
            </div>
            <p
              className="text-sm font-semibold"
              style={{ color: 'var(--white)' }}
            >
              {formatPesewas(item.pricePesewas * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-4 border-t pt-4 space-y-2"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex justify-between text-sm">
          <span style={{ color: 'var(--muted)' }}>Subtotal</span>
          <span style={{ color: 'var(--white)' }}>
            {formatPesewas(totalPesewas())}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: 'var(--muted)' }}>Delivery</span>
          <span style={{ color: 'var(--teal)' }}>
            {deliveryFee === 0 ? 'Free' : formatPesewas(deliveryFee)}
          </span>
        </div>
        <div
          className="flex justify-between border-t pt-2"
          style={{ borderColor: 'var(--border)' }}
        >
          <span
            className="font-semibold"
            style={{ color: 'var(--white)' }}
          >
            Total
          </span>
          <span
            className="font-[family-name:var(--font-syne)] text-lg font-bold"
            style={{ color: 'var(--gold)' }}
          >
            {formatPesewas(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
