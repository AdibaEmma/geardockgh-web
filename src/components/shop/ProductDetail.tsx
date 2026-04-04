'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, ShoppingCart, Package, Bell, BellOff } from 'lucide-react';
import { ShareButton } from '@/components/shop/ShareButton';
import { useProduct } from '@/hooks/use-products';
import { useCartStore } from '@/stores/cart-store';
import { useToastStore } from '@/stores/toast-store';
import { useAuthStore } from '@/stores/auth-store';
import { useStockNotification, useSubscribeStock, useUnsubscribeStock } from '@/hooks/use-stock-notification';
import { formatPesewas, formatDate } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/Button';
import { PreorderBadge } from '@/components/shop/PreorderBadge';
import { PreorderInfo, calculateDeposit } from '@/components/shop/PreorderInfo';
import { WishlistButton } from '@/components/shop/WishlistButton';
import { isProductPreorderable } from '@/lib/utils/product-helpers';
import type { Product, ProductVariant, ProductOption, ProductOptionValue } from '@/types';

interface ProductDetailProps {
  slug: string;
}

export function ProductDetail({ slug }: ProductDetailProps) {
  const { data, isLoading } = useProduct(slug);
  const product = data?.data as Product | undefined;
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);
  const user = useAuthStore((s) => s.user);

  const productId = product?.id ?? '';
  const { data: notifData } = useStockNotification(productId);
  const isNotifySubscribed = !!(notifData?.data as any)?.subscribed;
  const { mutate: subscribeStock, isPending: isSubscribing } = useSubscribeStock();
  const { mutate: unsubscribeStock, isPending: isUnsubscribing } = useUnsubscribeStock();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, ProductOptionValue>>({});

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
  const options: ProductOption[] = product.optionsJson
    ? (JSON.parse(product.optionsJson) as ProductOption[])
    : [];

  const optionsDelta = Object.values(selections).reduce(
    (sum, v) => sum + (v.priceDelta ?? 0),
    0,
  );
  const activePrice =
    (selectedVariant?.pricePesewas ?? product.pricePesewas) + optionsDelta;
  const activeStock = selectedVariant?.stockCount ?? product.stockCount;
  const preorderable = isProductPreorderable(product);
  const isOutOfStock = !preorderable && activeStock === 0;

  // Check if all required options are selected
  const missingOptions = options.filter((o) => !selections[o.name]);
  const allOptionsSelected = options.length === 0 || missingOptions.length === 0;

  const handleAddToCart = () => {
    const selectedOpts = Object.entries(selections).map(([name, val]) => ({
      name,
      value: val.label,
      priceDelta: val.priceDelta,
    }));

    const optionLabels = selectedOpts.map((o) => o.value).join(' · ');
    const displayName = optionLabels
      ? `${product.name} - ${optionLabels}`
      : selectedVariant
        ? `${product.name} - ${selectedVariant.name}`
        : product.name;

    addItem(
      {
        productId: product.id,
        variantId: selectedVariant?.id ?? null,
        name: displayName,
        pricePesewas: selectedVariant?.pricePesewas ?? product.pricePesewas,
        image: images[0] ?? null,
        isPreorder: preorderable,
        depositPesewas: preorderable
          ? calculateDeposit(product, 1, optionsDelta)
          : activePrice,
        selectedOptions: selectedOpts,
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
            className="aspect-square overflow-hidden rounded-xl border shadow-md"
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
                  className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border transition-all duration-200 hover:scale-105"
                  style={{
                    borderColor:
                      i === selectedImageIndex ? 'var(--gold)' : 'var(--border)',
                    boxShadow:
                      i === selectedImageIndex ? '0 0 0 1px var(--gold)' : 'none',
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
            className="font-[family-name:var(--font-outfit)] text-2xl font-bold lg:text-3xl"
            style={{ color: 'var(--white)' }}
          >
            {product.name}
          </h1>

          <div className="mt-3 flex items-baseline gap-3">
            <span
              className="font-[family-name:var(--font-outfit)] text-2xl font-bold"
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

          {/* Product Options */}
          {options.map((option) => (
            <div key={option.name} className="mt-5">
              <label
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--white)' }}
              >
                {option.type === 'color' && selections[option.name]
                  ? `Color: ${selections[option.name].label}`
                  : option.name}
              </label>

              {option.type === 'color' ? (
                <div className="flex flex-wrap gap-2.5">
                  {option.values.map((val: ProductOptionValue) => {
                    const isSelected = selections[option.name]?.label === val.label;
                    return (
                      <button
                        key={val.label}
                        onClick={() =>
                          setSelections((prev) => ({ ...prev, [option.name]: val }))
                        }
                        className="relative h-9 w-9 rounded-full transition-all"
                        style={{
                          background: val.hex ?? '#888',
                          boxShadow: isSelected
                            ? '0 0 0 2px var(--deep), 0 0 0 4px var(--gold)'
                            : '0 0 0 1px var(--border)',
                        }}
                        title={
                          val.priceDelta
                            ? `${val.label} (+${formatPesewas(val.priceDelta)})`
                            : val.label
                        }
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {option.values.map((val: ProductOptionValue) => {
                    const isSelected = selections[option.name]?.label === val.label;
                    return (
                      <button
                        key={val.label}
                        onClick={() =>
                          setSelections((prev) => ({ ...prev, [option.name]: val }))
                        }
                        className="rounded-lg border px-3 py-2 text-sm transition-all"
                        style={{
                          borderColor: isSelected ? 'var(--gold)' : 'var(--border)',
                          color: isSelected ? 'var(--gold)' : 'var(--white)',
                          background: isSelected
                            ? 'rgba(245, 158, 11, 0.08)'
                            : 'transparent',
                        }}
                      >
                        {val.label}
                        {val.priceDelta ? (
                          <span
                            className="ml-1 text-xs"
                            style={{ color: 'var(--muted)' }}
                          >
                            (+{formatPesewas(val.priceDelta)})
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Stock Status */}
          <div className="mt-4">
            {preorderable ? (
              <div className="space-y-3">
                <PreorderBadge size="md" />
                <PreorderInfo product={product} quantity={quantity} optionsDeltaPesewas={optionsDelta} />
                {product.preorderSlotTarget && (
                  <div
                    className="rounded-lg border px-3 py-2 text-xs"
                    style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                  >
                    <span className="font-medium" style={{ color: 'var(--gold)' }}>
                      {product.preorderSlotTarget - product.preorderSlotsTaken} units available
                    </span>
                    {' '}&middot; Next shipment: ~6 weeks
                  </div>
                )}
              </div>
            ) : isOutOfStock ? (
              <span className="text-sm text-red-400">Out of stock</span>
            ) : activeStock <= 5 ? (
              <div className="space-y-1">
                <span className="text-sm font-medium text-orange-400">
                  Only {activeStock} left in stock
                </span>
                <div
                  className="h-1.5 w-full max-w-[200px] rounded-full overflow-hidden"
                  style={{ background: 'var(--border)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(10, (activeStock / 20) * 100)}%`,
                      background: 'rgb(251, 146, 60)',
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: 'var(--teal)' }}>
                  In stock
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'var(--muted)' }}
                >
                  &middot; {activeStock} units available
                </span>
              </div>
            )}
          </div>

          {/* Quantity + Add to Cart / Notify Me */}
          {isOutOfStock && !preorderable ? (
            <div className="mt-6">
              {user ? (
                isNotifySubscribed ? (
                  <button
                    onClick={() => unsubscribeStock(product.id)}
                    disabled={isUnsubscribing}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors"
                    style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                  >
                    <BellOff size={16} />
                    {isUnsubscribing ? 'Removing...' : "You'll be notified · Cancel"}
                  </button>
                ) : (
                  <Button
                    size="lg"
                    className="w-full gap-2"
                    onClick={() => subscribeStock(product.id)}
                    isLoading={isSubscribing}
                  >
                    <Bell size={18} />
                    Notify Me When Available
                  </Button>
                )
              ) : (
                <Link href="/login">
                  <Button size="lg" className="w-full gap-2" variant="secondary">
                    <Bell size={18} />
                    Sign in to get notified
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-6 flex items-center gap-4">
              <div
                className="flex items-center gap-1 rounded-lg border px-2 py-1.5"
                style={{ borderColor: 'var(--border)', background: 'var(--deep)' }}
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="rounded-md p-1.5 transition-colors hover:bg-[var(--hover-bg)]"
                  style={{ color: 'var(--muted)' }}
                >
                  <Minus size={16} />
                </button>
                <span
                  className="min-w-[2.5rem] text-center font-[family-name:var(--font-space-mono)] text-sm"
                  style={{ color: 'var(--white)' }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="rounded-md p-1.5 transition-colors hover:bg-[var(--hover-bg)]"
                  style={{ color: 'var(--muted)' }}
                >
                  <Plus size={16} />
                </button>
              </div>

              <Button
                size="lg"
                className="flex-1 gap-2"
                disabled={!allOptionsSelected}
                onClick={handleAddToCart}
                style={preorderable ? { background: 'var(--gold)', color: 'var(--black)' } : undefined}
              >
                <ShoppingCart size={18} />
                {!allOptionsSelected
                  ? `Select ${missingOptions.map((o) => o.name).join(', ')}`
                  : preorderable
                    ? 'Pre-Order Now — Pay with MoMo'
                    : 'Add to Cart'}
              </Button>
            </div>
          )}

          {/* Trust messaging + Share */}
          <div className="mt-3 flex items-center justify-between">
            <div
              className="flex flex-wrap gap-x-4 gap-y-1 text-xs"
              style={{ color: 'var(--muted)' }}
            >
              <span>48h delivery in Bolgatanga</span>
              <span>7-day easy returns</span>
              <span>Verified imports only</span>
            </div>
            <div className="flex items-center gap-3">
              <WishlistButton product={product} size={18} showLabel />
              <ShareButton productName={product.name} productSlug={product.slug} />
            </div>
          </div>

          {/* Specs */}
          {Object.keys(specs).length > 0 && (
            <div className="mt-8">
              <h3
                className="mb-3 font-[family-name:var(--font-outfit)] text-sm font-semibold"
                style={{ color: 'var(--white)' }}
              >
                Specifications
              </h3>
              <div
                className="divide-y divide-[var(--border)] overflow-hidden rounded-lg border shadow-sm"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--card)',
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
