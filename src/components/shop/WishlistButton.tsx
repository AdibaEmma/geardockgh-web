'use client';

import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlist-store';
import { useToastStore } from '@/stores/toast-store';
import type { Product } from '@/types';
import { cn } from '@/lib/utils/cn';

interface WishlistButtonProps {
  product: Product;
  size?: number;
  showLabel?: boolean;
  className?: string;
}

function buildWishlistItem(product: Product) {
  const images = product.imagesJson ? JSON.parse(product.imagesJson) as string[] : [];
  return {
    productId: product.id,
    name: product.name,
    slug: product.slug,
    pricePesewas: product.pricePesewas,
    comparePricePesewas: product.comparePricePesewas,
    image: images[0] ?? null,
    category: product.category,
    isPreorder: product.isPreorder,
  };
}

export function WishlistButton({ product, size = 18, showLabel = false, className }: WishlistButtonProps) {
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const addToast = useToastStore((s) => s.addToast);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const wasAdded = toggleItem(buildWishlistItem(product));
    addToast({
      type: wasAdded ? 'success' : 'info',
      message: wasAdded ? `${product.name} added to wishlist` : `${product.name} removed from wishlist`,
    });
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'inline-flex items-center gap-2 transition-all duration-200',
        showLabel
          ? 'rounded-lg border px-4 py-2.5 text-sm font-medium'
          : 'rounded-lg p-2',
        isInWishlist
          ? showLabel
            ? 'border-red-500/30 bg-red-500/10 text-red-400'
            : 'text-red-400'
          : showLabel
            ? 'border-[var(--border)] text-[var(--muted)] hover:border-red-500/30 hover:text-red-400'
            : 'text-[var(--muted)] hover:text-red-400',
        className,
      )}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={size}
        fill={isInWishlist ? 'currentColor' : 'none'}
        className={cn(
          'transition-transform duration-200',
          isInWishlist && 'scale-110',
        )}
      />
      {showLabel && (
        <span>{isInWishlist ? 'Saved' : 'Save to Wishlist'}</span>
      )}
    </button>
  );
}
