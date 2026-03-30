'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Bell, Loader2, Check } from 'lucide-react';
import { formatPesewas, formatDate } from '@/lib/utils/formatters';
import { useCartStore } from '@/stores/cart-store';
import { useToastStore } from '@/stores/toast-store';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);
  const [cartStatus, setCartStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const images = product.imagesJson ? JSON.parse(product.imagesJson) as string[] : [];
  const firstImage = images[0] ?? null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartStatus !== 'idle') return;

    setCartStatus('loading');
    addItem({
      productId: product.id,
      variantId: null,
      name: product.name,
      pricePesewas: product.pricePesewas,
      image: firstImage,
      isPreorder: product.isPreorder,
      depositPesewas: product.isPreorder
        ? (() => {
            if (product.preorderDepositType === 'percentage' && product.preorderDepositValue != null) {
              return Math.round((product.pricePesewas * product.preorderDepositValue) / 100);
            }
            if (product.preorderDepositType === 'fixed' && product.preorderDepositValue != null) {
              return product.preorderDepositValue;
            }
            return product.pricePesewas;
          })()
        : product.pricePesewas,
      selectedOptions: [],
    });
    addToast({ type: 'success', message: `${product.name} added to cart` });
    setCartStatus('success');
    setTimeout(() => setCartStatus('idle'), 2000);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-xl border shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--gold)]/40 hover:shadow-lg"
      style={{
        background: 'var(--card)',
        borderColor: 'var(--border)',
      }}
    >
      <div
        className="relative aspect-square overflow-hidden"
        style={{ background: 'var(--deep)' }}
      >
        {firstImage ? (
          <img
            src={firstImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span
              className="font-[family-name:var(--font-space-mono)] text-xs"
              style={{ color: 'var(--muted)' }}
            >
              No Image
            </span>
          </div>
        )}

        {product.isPreorder && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md"
              style={{ background: 'var(--gold)', color: 'var(--black)' }}
            >
              Pre-Order
            </span>
            {product.shippingMethod && (
              <span
                className="rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wider shadow-md"
                style={{
                  background: product.shippingMethod === 'AIR' ? 'var(--teal)' : '#3b82f6',
                  color: 'var(--black)',
                }}
              >
                {product.shippingMethod === 'AIR' ? '✈ Air' : '🚢 Sea'}
              </span>
            )}
          </div>
        )}

        {!product.isPreorder && product.comparePricePesewas && product.comparePricePesewas > product.pricePesewas && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
            {Math.round(((product.comparePricePesewas - product.pricePesewas) / product.comparePricePesewas) * 100)}% OFF
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4">
        {product.category && (
          <span
            className="mb-1 sm:mb-1.5 block font-[family-name:var(--font-space-mono)] text-[9px] sm:text-[10px] uppercase tracking-wider"
            style={{ color: 'var(--muted)' }}
          >
            {product.category}
          </span>
        )}

        <h3
          className="mb-1.5 sm:mb-2 line-clamp-2 text-xs sm:text-sm font-medium leading-snug"
          style={{ color: 'var(--white)' }}
        >
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <span
              className="font-[family-name:var(--font-outfit)] text-sm sm:text-lg font-bold"
              style={{ color: 'var(--gold)' }}
            >
              {formatPesewas(product.pricePesewas)}
            </span>
            {product.comparePricePesewas && product.comparePricePesewas > product.pricePesewas && (
              <span
                className="text-[10px] sm:text-xs line-through"
                style={{ color: 'var(--muted)' }}
              >
                {formatPesewas(product.comparePricePesewas)}
              </span>
            )}
          </div>

          {!product.isPreorder && product.stockCount === 0 ? (
            <div
              className="rounded-lg p-2"
              style={{ color: 'var(--muted)' }}
              title="Notify me when available"
            >
              <Bell size={18} />
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={cartStatus !== 'idle'}
              className="rounded-lg p-2 transition-colors hover:bg-[var(--gold)]/10 disabled:opacity-60"
              style={{ color: cartStatus === 'success' ? 'var(--teal)' : 'var(--gold)' }}
              aria-label={`Add ${product.name} to cart`}
            >
              {cartStatus === 'loading' && <Loader2 size={18} className="animate-spin" />}
              {cartStatus === 'success' && <Check size={18} />}
              {cartStatus === 'idle' && <ShoppingCart size={18} />}
            </button>
          )}
        </div>

        {product.isPreorder && (
          <p className="mt-1.5 text-xs" style={{ color: 'var(--muted)' }}>
            {product.preorderDepositType && product.preorderDepositValue != null && (
              <span style={{ color: 'var(--gold)' }}>
                {product.preorderDepositType === 'percentage'
                  ? `${product.preorderDepositValue}% deposit`
                  : `${formatPesewas(product.preorderDepositValue)} deposit`}
              </span>
            )}
            {product.shippingMethod && (
              <span>
                {product.preorderDepositType ? ' · ' : ''}
                {product.shippingMethod === 'AIR' ? '1–3 wks' : '6–10 wks'}
              </span>
            )}
            {product.estArrivalDate && ` · ETA ${formatDate(product.estArrivalDate)}`}
          </p>
        )}

        {!product.isPreorder && product.stockCount <= 5 && product.stockCount > 0 && (
          <p className="mt-2 text-xs text-orange-400">
            Only {product.stockCount} left
          </p>
        )}

        {!product.isPreorder && product.stockCount === 0 && (
          <p className="mt-2 text-xs text-red-400">Out of stock</p>
        )}
      </div>
    </Link>
  );
}
