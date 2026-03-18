'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Package,
  Eye,
  EyeOff,
  Pencil,
  Calendar,
  Tag,
  DollarSign,
  Layers,
  Clock,
  Globe,
  Hash,
} from 'lucide-react';
import { getAdminProductById, toggleAdminProductPublish } from '@/lib/api/admin';
import { formatPesewas, formatDate, formatDatetime } from '@/lib/utils/formatters';
import { CATEGORIES } from '@/lib/utils/constants';
import { useToastStore } from '@/stores/toast-store';
import type { Product } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => getAdminProductById(id),
  });

  const product = data?.data as Product | undefined;

  const togglePublish = useMutation({
    mutationFn: () => toggleAdminProductPublish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-product', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      addToast({
        type: 'success',
        message: product?.isPublished ? 'Product unpublished' : 'Product published',
      });
    },
    onError: () => addToast({ type: 'error', message: 'Failed to update product' }),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div
          className="h-6 w-32 animate-pulse rounded"
          style={{ background: 'var(--border)' }}
        />
        <div
          className="h-64 animate-pulse rounded-xl"
          style={{ background: 'var(--card)' }}
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 text-center">
        <p style={{ color: 'var(--muted)' }}>Product not found</p>
        <Link
          href="/admin/products"
          className="mt-2 inline-block text-sm hover:underline"
          style={{ color: 'var(--gold)' }}
        >
          Back to products
        </Link>
      </div>
    );
  }

  const images = product.imagesJson
    ? (() => {
        try {
          return JSON.parse(product.imagesJson) as string[];
        } catch {
          return [];
        }
      })()
    : [];

  const specs = product.specsJson
    ? (() => {
        try {
          return JSON.parse(product.specsJson) as Record<string, string>;
        } catch {
          return {};
        }
      })()
    : {};

  const categoryLabel =
    CATEGORIES.find((c) => c.value === product.category)?.label ?? product.category;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-sm transition-colors hover:underline"
        style={{ color: 'var(--muted)' }}
      >
        <ArrowLeft size={16} />
        Back to products
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="font-[family-name:var(--font-syne)] text-2xl font-bold"
            style={{ color: 'var(--white)' }}
          >
            {product.name}
          </h1>
          <p
            className="mt-1 font-[family-name:var(--font-space-mono)] text-xs"
            style={{ color: 'var(--muted)' }}
          >
            {product.slug}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="rounded-full px-3 py-1 text-xs font-medium"
            style={{
              background: product.isPublished
                ? 'rgba(0,201,167,0.1)'
                : 'rgba(239,68,68,0.1)',
              color: product.isPublished ? 'var(--teal)' : '#ef4444',
            }}
          >
            {product.isPublished ? 'Published' : 'Draft'}
          </span>
          <button
            onClick={() => togglePublish.mutate()}
            disabled={togglePublish.isPending}
            className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5 disabled:opacity-50"
            style={{
              borderColor: 'var(--border)',
              color: product.isPublished ? '#ef4444' : 'var(--teal)',
            }}
          >
            {product.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
            {product.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <Link
            href={`/admin/products?edit=${id}`}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            style={{ background: 'var(--gold)', color: 'var(--black)' }}
          >
            <Pencil size={14} />
            Edit
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Image + Description */}
        <div className="space-y-6 lg:col-span-2">
          {/* Image */}
          <div
            className="overflow-hidden rounded-xl border"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            {images.length > 0 ? (
              <img
                src={images[0]}
                alt={product.name}
                className="h-72 w-full object-contain"
                style={{ background: 'var(--deep)' }}
              />
            ) : (
              <div
                className="flex h-72 items-center justify-center"
                style={{ background: 'var(--deep)' }}
              >
                <Package size={48} style={{ color: 'var(--border)' }} />
              </div>
            )}
            {images.length > 1 && (
              <div
                className="flex gap-2 border-t p-3"
                style={{ borderColor: 'var(--border)' }}
              >
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="h-16 w-16 rounded-lg border object-cover"
                    style={{ borderColor: 'var(--border)' }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div
              className="rounded-xl border p-5"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--white)' }}>
                Description
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {product.description}
              </p>
            </div>
          )}

          {/* Specifications */}
          {Object.keys(specs).length > 0 && (
            <div
              className="rounded-xl border p-5"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--white)' }}>
                Specifications
              </h3>
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2.5">
                    <span className="text-sm" style={{ color: 'var(--muted)' }}>
                      {key}
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--white)' }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar: Details + Audit */}
        <div className="space-y-6">
          {/* Pricing */}
          <div
            className="rounded-xl border p-5"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--white)' }}>
              Pricing & Stock
            </h3>
            <div className="space-y-3">
              <DetailRow
                icon={DollarSign}
                label="Price"
                value={formatPesewas(product.pricePesewas)}
                valueColor="var(--gold)"
              />
              {product.comparePricePesewas ? (
                <DetailRow
                  icon={DollarSign}
                  label="Compare Price"
                  value={formatPesewas(product.comparePricePesewas)}
                />
              ) : null}
              <DetailRow
                icon={Layers}
                label="Stock"
                value={String(product.stockCount)}
                valueColor={product.stockCount > 0 ? 'var(--teal)' : '#ef4444'}
              />
              {product.category && (
                <DetailRow icon={Tag} label="Category" value={categoryLabel ?? '--'} />
              )}
            </div>
          </div>

          {/* Pre-order info */}
          {product.isPreorder && (
            <div
              className="rounded-xl border p-5"
              style={{
                background: 'var(--card)',
                borderColor: 'rgba(245, 158, 11, 0.3)',
              }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: '#F59E0B' }}>
                Pre-Order Settings
              </h3>
              <div className="space-y-3">
                {product.preorderDepositType && (
                  <DetailRow label="Deposit Type" value={product.preorderDepositType} />
                )}
                {product.preorderDepositValue != null && (
                  <DetailRow
                    label="Deposit Value"
                    value={
                      product.preorderDepositType === 'percentage'
                        ? `${product.preorderDepositValue}%`
                        : formatPesewas(product.preorderDepositValue)
                    }
                  />
                )}
                {product.preorderMinUnits != null && (
                  <DetailRow
                    label="Min Units"
                    value={String(product.preorderMinUnits)}
                  />
                )}
                <DetailRow
                  label="Slots Taken"
                  value={String(product.preorderSlotsTaken)}
                />
                {product.estArrivalDate && (
                  <DetailRow
                    icon={Calendar}
                    label="ETA"
                    value={formatDate(product.estArrivalDate)}
                    valueColor="#F59E0B"
                  />
                )}
              </div>
            </div>
          )}

          {/* Audit Trail */}
          <div
            className="rounded-xl border p-5"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--white)' }}>
              Audit Trail
            </h3>
            <div className="space-y-3">
              <DetailRow
                icon={Clock}
                label="Created"
                value={formatDatetime(product.createdAt)}
              />
              <DetailRow
                icon={Clock}
                label="Updated"
                value={formatDatetime(product.updatedAt)}
              />
              <DetailRow icon={Hash} label="Product ID" value={product.id} mono />
              {product.importbrainProductId && (
                <DetailRow
                  icon={Globe}
                  label="ImportBrain ID"
                  value={product.importbrainProductId}
                  mono
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  valueColor,
  mono,
}: {
  icon?: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
  valueColor?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} />}
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {label}
        </span>
      </div>
      <span
        className={`text-right text-xs font-medium ${mono ? 'font-[family-name:var(--font-space-mono)] break-all' : ''}`}
        style={{ color: valueColor ?? 'var(--white)', maxWidth: '60%' }}
      >
        {value}
      </span>
    </div>
  );
}
