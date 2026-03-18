'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, ShoppingCart, Package } from 'lucide-react';
import { useProduct } from '@/hooks/use-products';
import { useCartStore } from '@/stores/cart-store';
import { useToastStore } from '@/stores/toast-store';
import { formatPesewas, formatDate } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/Button';
import { PreorderBadge } from '@/components/shop/PreorderBadge';
import { PreorderInfo, calculateDeposit } from '@/components/shop/PreorderInfo';
import type { Product, ProductVariant } from '@/types';

interface ProductDetailProps {
  slug: string;
}

export function ProductDetail({ slug }: ProductDetailProps) {
  const { data, isLoading } = useProduct(slug);
  const product = data?.data as Product | undefined;
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-32 rounded" style={{ background: 'var(--border)' }} />
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="aspect-square rounded-xl" style={{ background: 'var(--card)' }} />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded" style={{ background: 'var(--border)' }} />
            <div className="h-6 w-1/3 rounded" style={{ background: 'var(--border)' }} />
            <div className="h-20 w-full rounded" style={{ background: 'var(--border)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium" style={{ color: 'var(--white)' }}>
          Product not found
        </p>
        <Link
          href="/products"
          className="mt-2 inline-block text-sm hover:underline"
          style={{ color: 'var(--gold)' }}
        >
          Back to products
        </Link>
      </div>
    );
  }

  const images = product.imagesJson ? (JSON.parse(product.imagesJson) as string[]) : [];
  const specs = product.specsJson ? (JSON.parse(product.specsJson) as Record<string, string>) : {};

  const activePrice = selectedVariant?.pricePesewas ?? product.pricePesewas;
  const activeStock = selectedVariant?.stockCount ?? product.stockCount;
  const isOutOfStock = !product.isPreorder && activeStock === 0;

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        variantId: selectedVariant?.id ?? null,
        name: selectedVariant
          ? `${product.name} - ${selectedVariant.name}`
          : product.name,
        pricePesewas: activePrice,
        image: images[0] ?? null,
        isPreorder: product.isPreorder,
        depositPesewas: product.isPreorder
          ? calculateDeposit(product, 1)
          : activePrice,
      },
      quantity,
    );
    addToast({ type: 'success', message: `${product.name} added to cart` });
    setQuantity(1);
  };

  return (
    <div>
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-1.5 text-sm transition-colors hover:underline"
        style={{ color: 'var(--muted)' }}
      >
        <ArrowLeft size={16} />
        Back to products
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          <div
            className="aspect-square overflow-hidden rounded-xl border"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--border)',
            }}
          >
            {images.length > 0 ? (
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package size={48} style={{ color: 'var(--muted)' }} />
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border transition-all"
                  style={{
                    borderColor:
                      i === selectedImageIndex ? 'var(--gold)' : 'var(--border)',
                  }}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {product.category && (
            <span
              className="mb-2 inline-block font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-wider"
              style={{ color: 'var(--muted)' }}
            >
              {product.category}
            </span>
          )}

          <h1
            className="font-[family-name:var(--font-syne)] text-2xl font-bold lg:text-3xl"
            style={{ color: 'var(--white)' }}
          >
            {product.name}
          </h1>

          <div className="mt-3 flex items-baseline gap-3">
            <span
              className="font-[family-name:var(--font-syne)] text-2xl font-bold"
              style={{ color: 'var(--gold)' }}
            >
              {formatPesewas(activePrice)}
            </span>
            {product.comparePricePesewas &&
              product.comparePricePesewas > activePrice && (
                <span
                  className="text-base line-through"
                  style={{ color: 'var(--muted)' }}
                >
                  {formatPesewas(product.comparePricePesewas)}
                </span>
              )}
          </div>

          {product.description && (
            <p
              className="mt-4 text-sm leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              {product.description}
            </p>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-6">
              <label
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--white)' }}
              >
                Variant
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() =>
                      setSelectedVariant(
                        selectedVariant?.id === variant.id ? null : variant,
                      )
                    }
                    className="rounded-lg border px-3 py-2 text-sm transition-all"
                    style={{
                      borderColor:
                        selectedVariant?.id === variant.id
                          ? 'var(--gold)'
                          : 'var(--border)',
                      color:
                        selectedVariant?.id === variant.id
                          ? 'var(--gold)'
                          : 'var(--white)',
                      background:
                        selectedVariant?.id === variant.id
                          ? 'var(--gold-light)/10'
                          : 'transparent',
                    }}
                  >
                    {variant.name} — {formatPesewas(variant.pricePesewas)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="mt-4">
            {product.isPreorder ? (
              <div className="space-y-3">
                <PreorderBadge size="md" />
                <PreorderInfo product={product} quantity={quantity} />
              </div>
            ) : isOutOfStock ? (
              <span className="text-sm text-red-400">Out of stock</span>
            ) : activeStock <= 5 ? (
              <span className="text-sm text-orange-400">
                Only {activeStock} left in stock
              </span>
            ) : (
              <span className="text-sm" style={{ color: 'var(--teal)' }}>
                In stock
              </span>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          <div className="mt-6 flex items-center gap-4">
            <div
              className="flex items-center gap-3 rounded-lg border px-3 py-2"
              style={{ borderColor: 'var(--border)' }}
            >
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{ color: 'var(--muted)' }}
              >
                <Minus size={16} />
              </button>
              <span
                className="min-w-[2rem] text-center font-[family-name:var(--font-space-mono)] text-sm"
                style={{ color: 'var(--white)' }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                style={{ color: 'var(--muted)' }}
              >
                <Plus size={16} />
              </button>
            </div>

            <Button
              size="lg"
              className="flex-1 gap-2"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              style={product.isPreorder ? { background: '#F59E0B', color: '#000' } : undefined}
            >
              <ShoppingCart size={18} />
              {isOutOfStock ? 'Out of Stock' : product.isPreorder ? 'Pre-Order Now' : 'Add to Cart'}
            </Button>
          </div>

          {/* Specs */}
          {Object.keys(specs).length > 0 && (
            <div className="mt-8">
              <h3
                className="mb-3 font-[family-name:var(--font-syne)] text-sm font-semibold"
                style={{ color: 'var(--white)' }}
              >
                Specifications
              </h3>
              <div
                className="divide-y divide-[var(--border)] rounded-lg border"
                style={{
                  borderColor: 'var(--border)',
                }}
              >
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between px-4 py-2.5">
                    <span
                      className="text-sm"
                      style={{ color: 'var(--muted)' }}
                    >
                      {key}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: 'var(--white)' }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
