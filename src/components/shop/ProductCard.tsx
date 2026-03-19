'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
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

  const images = product.imagesJson ? JSON.parse(product.imagesJson) as string[] : [];
  const firstImage = images[0] ?? null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    });
    addToast({ type: 'success', message: `${product.name} added to cart` });
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-xl border transition-all duration-200 hover:border-[var(--gold)]/40"
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
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md"
            style={{ background: 'var(--gold)', color: 'var(--black)' }}
          >
            Pre-Order
          </span>
        )}

        {!product.isPreorder && product.comparePricePesewas && product.comparePricePesewas > product.pricePesewas && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500/20 px-2.5 py-1 text-xs font-medium text-red-400">
            Sale
          </span>
        )}
      </div>

      <div className="p-4">
        {product.category && (
          <span
            className="mb-1.5 block font-[family-name:var(--font-space-mono)] text-[10px] uppercase tracking-wider"
            style={{ color: 'var(--muted)' }}
          >
            {product.category}
          </span>
        )}

        <h3
          className="mb-2 line-clamp-2 text-sm font-medium leading-snug"
          style={{ color: 'var(--white)' }}
        >
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span
              className="font-[family-name:var(--font-syne)] text-lg font-bold"
              style={{ color: 'var(--gold)' }}
            >
              {formatPesewas(product.pricePesewas)}
            </span>
            {product.comparePricePesewas && product.comparePricePesewas > product.pricePesewas && (
              <span
                className="text-xs line-through"
                style={{ color: 'var(--muted)' }}
              >
                {formatPesewas(product.comparePricePesewas)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="rounded-lg p-2 transition-colors hover:bg-[var(--gold)]/10"
            style={{ color: 'var(--gold)' }}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>

        {product.isPreorder && product.preorderDepositType && product.preorderDepositValue != null && (
          <p className="mt-1.5 text-xs" style={{ color: 'var(--gold)' }}>
            {product.preorderDepositType === 'percentage'
              ? `${product.preorderDepositValue}% deposit`
              : `${formatPesewas(product.preorderDepositValue)} deposit`}
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
