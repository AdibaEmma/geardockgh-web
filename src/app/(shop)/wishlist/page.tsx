'use client';

import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore, type WishlistItem } from '@/stores/wishlist-store';
import { useCartStore } from '@/stores/cart-store';
import { useToastStore } from '@/stores/toast-store';
import { formatPesewas } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/Button';

function WishlistCard({ item }: { item: WishlistItem }) {
  const removeItem = useWishlistStore((s) => s.removeItem);
  const addCartItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);

  const handleAddToCart = () => {
    addCartItem({
      productId: item.productId,
      variantId: null,
      name: item.name,
      pricePesewas: item.pricePesewas,
      image: item.image,
      isPreorder: item.isPreorder,
      depositPesewas: item.pricePesewas,
      selectedOptions: [],
    });
    addToast({ type: 'success', message: `${item.name} added to cart` });
  };

  const handleRemove = () => {
    removeItem(item.productId);
    addToast({ type: 'info', message: `${item.name} removed from wishlist` });
  };

  return (
    <div
      className="group overflow-hidden rounded-xl border transition-all duration-200 hover:border-[var(--gold)]/40"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <Link href={`/products/${item.slug}`}>
        <div
          className="relative aspect-square overflow-hidden"
          style={{ background: 'var(--deep)' }}
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>No Image</span>
            </div>
          )}

          {item.isPreorder && (
            <span
              className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md"
              style={{ background: 'var(--gold)', color: 'var(--black)' }}
            >
              Pre-Order
            </span>
          )}
        </div>
      </Link>

      <div className="p-3 sm:p-4">
        {item.category && (
          <span
            className="mb-1 block font-[family-name:var(--font-space-mono)] text-[9px] uppercase tracking-wider"
            style={{ color: 'var(--muted)' }}
          >
            {item.category}
          </span>
        )}

        <Link href={`/products/${item.slug}`}>
          <h3
            className="mb-2 line-clamp-2 text-sm font-medium leading-snug hover:text-[var(--gold)] transition-colors"
            style={{ color: 'var(--white)' }}
          >
            {item.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2">
          <span
            className="font-[family-name:var(--font-outfit)] text-lg font-bold"
            style={{ color: 'var(--gold)' }}
          >
            {formatPesewas(item.pricePesewas)}
          </span>
          {item.comparePricePesewas && item.comparePricePesewas > item.pricePesewas && (
            <span className="text-xs line-through" style={{ color: 'var(--muted)' }}>
              {formatPesewas(item.comparePricePesewas)}
            </span>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all hover:border-[var(--gold)] hover:text-[var(--gold)]"
            style={{ borderColor: 'var(--border)', color: 'var(--white)' }}
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
          <button
            onClick={handleRemove}
            className="rounded-lg border px-3 py-2 text-xs transition-all hover:border-red-400 hover:text-red-400"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            aria-label="Remove from wishlist"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);

  return (
    <div className="animate-[fadeUp_400ms_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-[family-name:var(--font-outfit)] text-3xl font-bold"
            style={{ color: 'var(--white)' }}
          >
            Wishlist
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
            {items.length === 0
              ? 'Save products you love for later'
              : `${items.length} item${items.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="rounded-lg border px-3 py-2 text-xs font-medium transition-all hover:border-red-400 hover:text-red-400"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div
          className="mt-12 flex flex-col items-center justify-center rounded-xl border py-16"
          style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
        >
          <Heart size={48} style={{ color: 'var(--muted)' }} />
          <h2
            className="mt-4 font-[family-name:var(--font-outfit)] text-lg font-semibold"
            style={{ color: 'var(--white)' }}
          >
            Your wishlist is empty
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
            Browse our collection and save items you love
          </p>
          <Link href="/products">
            <Button variant="primary" className="mt-6">
              Browse Shop <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <WishlistCard key={item.productId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
