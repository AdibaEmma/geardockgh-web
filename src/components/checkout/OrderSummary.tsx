'use client';

import { useState } from 'react';
import { ShoppingBag, Info, Tag, Loader2, X } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { formatPesewas } from '@/lib/utils/formatters';
import { PreorderFeeNotice } from '@/components/shop/PreorderFeeNotice';
import { validateDiscountCode } from '@/lib/api/admin';

const FREE_DELIVERY_MIN_PESEWAS = 10000; // GH₵100 minimum for free delivery

interface OrderSummaryProps {
  onDiscountApplied?: (code: string, discountPesewas: number) => void;
  onDiscountRemoved?: () => void;
}

export function OrderSummary({ onDiscountApplied, onDiscountRemoved }: OrderSummaryProps = {}) {
  const items = useCartStore((s) => s.items);
  const totalPesewas = useCartStore((s) => s.totalPesewas);
  const depositTotal = useCartStore((s) => s.depositTotalPesewas);
  const regularTotal = useCartStore((s) => s.regularTotalPesewas);
  const hasPreorderItems = useCartStore((s) => s.hasPreorderItems);

  const [discountInput, setDiscountInput] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountMessage, setDiscountMessage] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [discountError, setDiscountError] = useState('');

  const hasPreorder = hasPreorderItems();
  const regularItemsTotal = regularTotal();
  const preorderDepositsTotal = depositTotal();
  const hasRegularItems = items.some((i) => !i.isPreorder);

  // Delivery fee applies to regular items only
  const qualifiesForFreeDelivery = regularItemsTotal >= FREE_DELIVERY_MIN_PESEWAS;
  const deliveryFee = !hasRegularItems ? 0 : qualifiesForFreeDelivery ? 0 : 2500; // GH₵25 flat rate

  const subtotal = totalPesewas();
  const dueToday = hasPreorder
    ? regularItemsTotal + preorderDepositsTotal + deliveryFee - discountAmount
    : subtotal + deliveryFee - discountAmount;

  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) return;
    setIsValidating(true);
    setDiscountError('');

    try {
      const res = await validateDiscountCode(discountInput.trim(), subtotal);
      const result = res.data as any;
      if (result.valid) {
        setAppliedCode(discountInput.trim().toUpperCase());
        setDiscountAmount(result.discountPesewas);
        setDiscountMessage(result.message);
        setDiscountError('');
        onDiscountApplied?.(discountInput.trim().toUpperCase(), result.discountPesewas);
      } else {
        setDiscountError(result.message);
      }
    } catch {
      setDiscountError('Failed to validate code');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedCode(null);
    setDiscountAmount(0);
    setDiscountMessage('');
    setDiscountInput('');
    setDiscountError('');
    onDiscountRemoved?.();
  };

  return (
    <div
      className="rounded-xl border p-6 shadow-md"
      style={{ background: 'var(--card)', borderColor: 'var(--border)', borderTop: '2px solid var(--gold)' }}
    >
      <h3
        className="mb-4 font-[family-name:var(--font-outfit)] text-lg font-bold"
        style={{ color: 'var(--white)' }}
      >
        Order Summary
      </h3>

      {/* Cart items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId}-${item.selectedOptions?.map((o) => o.value).join('-') ?? ''}`}
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
              {item.selectedOptions && item.selectedOptions.length > 0 && (
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  {item.selectedOptions.map((o) => o.value).join(' · ')}
                </p>
              )}
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
              {formatPesewas((item.pricePesewas + (item.selectedOptions ?? []).reduce((s, o) => s + (o.priceDelta ?? 0), 0)) * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Discount Code */}
      <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
        {appliedCode ? (
          <div
            className="flex items-center justify-between rounded-lg border px-3 py-2"
            style={{ borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.05)' }}
          >
            <div className="flex items-center gap-2">
              <Tag size={14} style={{ color: '#4ade80' }} />
              <span className="font-mono text-sm font-bold" style={{ color: '#4ade80' }}>
                {appliedCode}
              </span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                {discountMessage}
              </span>
            </div>
            <button
              onClick={handleRemoveDiscount}
              className="rounded p-1 transition-colors hover:bg-white/5"
            >
              <X size={14} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                value={discountInput}
                onChange={(e) => { setDiscountInput(e.target.value.toUpperCase()); setDiscountError(''); }}
                placeholder="Discount code"
                className="flex-1 rounded-lg border px-3 py-2 text-sm uppercase outline-none transition-colors focus:border-[var(--gold)]"
                style={{ background: 'var(--deep)', borderColor: 'var(--border)', color: 'var(--white)' }}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyDiscount())}
              />
              <button
                onClick={handleApplyDiscount}
                disabled={isValidating || !discountInput.trim()}
                className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40"
                style={{ background: 'var(--gold)', color: 'var(--black)' }}
              >
                {isValidating ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
              </button>
            </div>
            {discountError && (
              <p className="mt-1.5 text-xs" style={{ color: '#ef4444' }}>{discountError}</p>
            )}
          </div>
        )}
      </div>

      {/* Totals */}
      <div
        className="mt-4 border-t pt-4 space-y-2"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex justify-between text-sm">
          <span style={{ color: 'var(--muted)' }}>Subtotal</span>
          <span style={{ color: 'var(--white)' }}>
            {formatPesewas(subtotal)}
          </span>
        </div>

        {/* Applied discount */}
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span style={{ color: '#4ade80' }}>Discount ({appliedCode})</span>
            <span style={{ color: '#4ade80' }}>-{formatPesewas(discountAmount)}</span>
          </div>
        )}

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
            className="font-[family-name:var(--font-outfit)] text-lg font-bold"
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
