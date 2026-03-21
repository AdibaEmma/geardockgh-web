'use client';

import { ShoppingBag, Info } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { formatPesewas } from '@/lib/utils/formatters';
import { PreorderFeeNotice } from '@/components/shop/PreorderFeeNotice';

const FREE_DELIVERY_MIN_PESEWAS = 10000; // GH₵100 minimum for free delivery

export function OrderSummary() {
  const items = useCartStore((s) => s.items);
  const totalPesewas = useCartStore((s) => s.totalPesewas);
  const depositTotal = useCartStore((s) => s.depositTotalPesewas);
  const regularTotal = useCartStore((s) => s.regularTotalPesewas);
  const hasPreorderItems = useCartStore((s) => s.hasPreorderItems);

  const hasPreorder = hasPreorderItems();
  const regularItemsTotal = regularTotal();
  const preorderDepositsTotal = depositTotal();
  const hasRegularItems = items.some((i) => !i.isPreorder);

  // Delivery fee applies to regular items only
  const qualifiesForFreeDelivery = regularItemsTotal >= FREE_DELIVERY_MIN_PESEWAS;
  const deliveryFee = !hasRegularItems ? 0 : qualifiesForFreeDelivery ? 0 : 2500; // GH₵25 flat rate

  const dueToday = hasPreorder
    ? regularItemsTotal + preorderDepositsTotal + deliveryFee
    : totalPesewas() + deliveryFee;

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

      {/* Cart items */}
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
              <p className="truncate text-sm" style={{ color: 'var(--white)' }}>
                {item.name}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  Qty: {item.quantity}
                </p>
                {item.isPreorder && (
                  <span
                    className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase"
                    style={{ background: 'var(--gold)', color: 'var(--black)' }}
                  >
                    Pre-Order
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
              {formatPesewas(item.pricePesewas * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Totals */}
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

        {/* Delivery for regular items */}
        {hasRegularItems && (
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--muted)' }}>Delivery</span>
            <span style={{ color: 'var(--teal)' }}>
              {deliveryFee === 0 ? 'Free in Bolgatanga' : formatPesewas(deliveryFee)}
            </span>
          </div>
        )}

        {/* Pre-order breakdown */}
        {hasPreorder && (
          <>
            {hasRegularItems && (
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--muted)' }}>Regular items</span>
                <span style={{ color: 'var(--white)' }}>{formatPesewas(regularItemsTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--gold)' }}>Pre-order deposit{items.filter((i) => i.isPreorder).length > 1 ? 's' : ''}</span>
              <span style={{ color: 'var(--gold)' }}>{formatPesewas(preorderDepositsTotal)}</span>
            </div>
            {totalPesewas() - regularItemsTotal - preorderDepositsTotal > 0 && (
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--muted)' }}>Balance on arrival</span>
                <span style={{ color: 'var(--muted)' }}>
                  {formatPesewas(totalPesewas() - regularItemsTotal - preorderDepositsTotal)}
                </span>
              </div>
            )}

            <PreorderFeeNotice className="mt-2" />
          </>
        )}

        {/* Due today */}
        <div
          className="flex justify-between border-t pt-2"
          style={{ borderColor: 'var(--border)' }}
        >
          <span className="font-semibold" style={{ color: 'var(--white)' }}>
            {hasPreorder ? 'Due Today' : 'Total'}
          </span>
          <span
            className="font-[family-name:var(--font-syne)] text-lg font-bold"
            style={{ color: 'var(--gold)' }}
          >
            {formatPesewas(dueToday)}
          </span>
        </div>

        {/* Free delivery note for non-preorder */}
        {!hasPreorder && deliveryFee === 0 && hasRegularItems && (
          <div className="flex items-center gap-1.5 pt-1">
            <Info size={12} style={{ color: 'var(--teal)' }} />
            <p className="text-[10px]" style={{ color: 'var(--muted)' }}>
              Free delivery within Bolgatanga on orders over {formatPesewas(FREE_DELIVERY_MIN_PESEWAS)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
