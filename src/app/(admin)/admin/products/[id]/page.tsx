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
  Star,
  AlertTriangle,
  Target,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { getAdminProductById, toggleAdminProductPublish, toggleAdminProductFeatured, updateAdminProduct, getProductAuditLogs, type ProductAuditLog } from '@/lib/api/admin';
import { ProfitCalculator } from '@/components/admin/ProfitCalculator';
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

  const { data: auditData } = useQuery({
    queryKey: ['admin-product-audit', id],
    queryFn: () => getProductAuditLogs(id),
    enabled: !!product,
  });

  const auditLogs = (auditData?.data ?? []) as ProductAuditLog[];

  const togglePublish = useMutation({
    mutationFn: () => toggleAdminProductPublish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-product', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-product-audit', id] });
      addToast({
        type: 'success',
        message: product?.isPublished ? 'Product unpublished' : 'Product published',
      });
    },
    onError: () => addToast({ type: 'error', message: 'Failed to update product' }),
  });

  const toggleFeatured = useMutation({
    mutationFn: () => toggleAdminProductFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-product', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-product-audit', id] });
      addToast({
        type: 'success',
        message: product?.isFeatured ? 'Product unfeatured' : 'Product featured',
      });
    },
    onError: () => addToast({ type: 'error', message: 'Failed to update featured status' }),
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
            className="font-[family-name:var(--font-outfit)] text-2xl font-bold"
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
            className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--hover-bg)] disabled:opacity-50"
            style={{
              borderColor: 'var(--border)',
              color: product.isPublished ? '#ef4444' : 'var(--teal)',
            }}
          >
            {product.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
            {product.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button
            onClick={() => toggleFeatured.mutate()}
            disabled={toggleFeatured.isPending}
            className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--hover-bg)] disabled:opacity-50"
            style={{ borderColor: 'var(--border)', color: product.isFeatured ? 'var(--gold)' : 'var(--muted)' }}
          >
            <Star size={14} fill={product.isFeatured ? 'var(--gold)' : 'none'} />
            {product.isFeatured ? 'Unfeature' : 'Feature'}
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
              {product.costPricePesewas ? (
                <DetailRow
                  icon={DollarSign}
                  label="Cost Price"
                  value={formatPesewas(product.costPricePesewas)}
                  valueColor="var(--teal)"
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

          {/* Profit Calculator */}
          {product.costPricePesewas && (
            <ProfitCalculator
              costPricePesewas={product.costPricePesewas}
              currentPricePesewas={product.pricePesewas}
              onApplyPrice={async (pesewas) => {
                try {
                  await updateAdminProduct(id, { pricePesewas: pesewas });
                  queryClient.invalidateQueries({ queryKey: ['admin-product', id] });
                  queryClient.invalidateQueries({ queryKey: ['admin-product-audit', id] });
                  addToast({ type: 'success', message: 'Price updated successfully' });
                } catch {
                  addToast({ type: 'error', message: 'Failed to update price' });
                }
              }}
            />
          )}

          {/* Pre-order info */}
          {product.isPreorder && (() => {
            const slotTarget = product.preorderSlotTarget;
            const slotsTaken = product.preorderSlotsTaken;
            const hasTarget = slotTarget != null && slotTarget > 0;
            const targetReached = hasTarget && slotsTaken >= slotTarget;
            const progressPercent = hasTarget
              ? Math.min((slotsTaken / slotTarget) * 100, 100)
              : 0;

            return (
              <div
                className="rounded-xl border p-5"
                style={{
                  background: 'var(--card)',
                  borderColor: targetReached
                    ? 'rgba(239, 68, 68, 0.5)'
                    : 'rgba(245, 158, 11, 0.3)',
                }}
              >
                <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--gold)' }}>
                  Pre-Order Settings
                </h3>

                {/* Alert banner when target reached */}
                {targetReached && (
                  <div
                    className="mb-4 flex items-start gap-2.5 rounded-lg border p-3"
                    style={{
                      background: 'rgba(239, 68, 68, 0.08)',
                      borderColor: 'rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    <AlertTriangle size={18} className="mt-0.5 shrink-0" style={{ color: '#ef4444' }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#ef4444' }}>
                        Slot target reached!
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                        {slotsTaken} of {slotTarget} slots filled. Time to place an order with your supplier.
                      </p>
                    </div>
                  </div>
                )}

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

                  {/* Slots with progress */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Target size={14} style={{ color: 'var(--muted)' }} />
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>
                        Slots
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className="text-xs font-medium"
                        style={{
                          color: targetReached ? '#ef4444' : 'var(--white)',
                        }}
                      >
                        {slotsTaken}
                        {hasTarget && (
                          <span style={{ color: 'var(--muted)' }}> / {slotTarget}</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {hasTarget && (
                    <div
                      className="h-2 w-full rounded-full overflow-hidden"
                      style={{ background: 'var(--deep)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progressPercent}%`,
                          background: targetReached
                            ? '#ef4444'
                            : progressPercent >= 75
                              ? 'var(--gold)'
                              : 'var(--teal)',
                        }}
                      />
                    </div>
                  )}

                  {product.estArrivalDate && (
                    <DetailRow
                      icon={Calendar}
                      label="ETA"
                      value={formatDate(product.estArrivalDate)}
                      valueColor="var(--gold)"
                    />
                  )}
                </div>
              </div>
            );
          })()}

        </div>
      </div>

      {/* Audit Trail — full width below the grid */}
      <div
        className="rounded-xl border p-6"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: 'rgba(var(--gold-rgb, 234,179,8), 0.12)' }}
          >
            <Clock size={16} style={{ color: 'var(--gold)' }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
              Audit Trail
            </h3>
            <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
              Product history and change tracking
            </p>
          </div>
        </div>

        {/* Metadata cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Clock, label: 'Created', value: formatDatetime(product.createdAt), color: 'var(--teal)' },
            { icon: Clock, label: 'Last Updated', value: formatDatetime(product.updatedAt), color: 'var(--gold)' },
            { icon: Hash, label: 'Product ID', value: product.id, mono: true },
            ...(product.importbrainProductId
              ? [{ icon: Globe, label: 'ImportBrain ID', value: product.importbrainProductId, mono: true }]
              : []),
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border p-3"
              style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <item.icon size={12} style={{ color: item.color ?? 'var(--muted)' }} />
                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                  {item.label}
                </span>
              </div>
              <p
                className={`text-xs font-semibold ${item.mono ? 'font-[family-name:var(--font-space-mono)] break-all' : ''}`}
                style={{ color: item.color ?? 'var(--white)' }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Change History Timeline */}
        {auditLogs.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--white)' }}>
                <FileText size={13} style={{ color: 'var(--gold)' }} />
                Change History
              </h4>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ color: 'var(--muted)', background: 'var(--background)' }}>
                {auditLogs.length} {auditLogs.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>

            <div className="relative max-h-96 overflow-y-auto pr-1">
              {/* Timeline line */}
              <div
                className="absolute left-[7px] top-2 bottom-2 w-px"
                style={{ background: 'var(--border)' }}
              />

              <div className="space-y-3">
                {auditLogs.map((log) => {
                  const changes: Array<{ field: string; label: string; from: unknown; to: unknown }> = (() => {
                    try { return log.changes ? JSON.parse(log.changes) : []; } catch { return []; }
                  })();

                  const actionConfig: Record<string, { color: string; bg: string; dotColor: string }> = {
                    created: { color: 'var(--teal)', bg: 'rgba(45,212,191,0.08)', dotColor: 'rgb(45,212,191)' },
                    updated: { color: 'var(--gold)', bg: 'rgba(234,179,8,0.08)', dotColor: 'rgb(234,179,8)' },
                    deleted: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', dotColor: 'rgb(239,68,68)' },
                    published: { color: 'var(--teal)', bg: 'rgba(45,212,191,0.08)', dotColor: 'rgb(45,212,191)' },
                    unpublished: { color: 'var(--muted)', bg: 'rgba(128,128,128,0.08)', dotColor: 'rgb(128,128,128)' },
                  };

                  const config = actionConfig[log.action] ?? actionConfig.updated;

                  return (
                    <div key={log.id} className="relative flex gap-4 pl-6">
                      {/* Timeline dot */}
                      <div
                        className="absolute left-0 top-3 h-[15px] w-[15px] rounded-full border-2 z-10"
                        style={{
                          borderColor: config.dotColor,
                          background: 'var(--card)',
                          boxShadow: `0 0 0 3px ${config.bg}`,
                        }}
                      />

                      {/* Entry card */}
                      <div
                        className="flex-1 rounded-lg border p-3.5"
                        style={{
                          borderColor: 'var(--border)',
                          background: config.bg,
                          borderLeftWidth: '3px',
                          borderLeftColor: config.dotColor,
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                            style={{ color: config.color, background: config.bg }}
                          >
                            {log.action}
                          </span>
                          <span className="text-[10px] font-medium" style={{ color: 'var(--muted)' }}>
                            {formatDatetime(log.createdAt)}
                          </span>
                        </div>
                        {changes.length > 0 && (
                          <div className="space-y-1.5 mt-1">
                            {changes.map((c, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs">
                                <span
                                  className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold"
                                  style={{ background: 'var(--background)', color: 'var(--white)' }}
                                >
                                  {c.label}
                                </span>
                                {log.action === 'created' ? (
                                  <span className="pt-0.5" style={{ color: 'var(--teal)' }}>{formatAuditValue(c.to, c.field)}</span>
                                ) : (
                                  <span className="flex items-center gap-1.5 flex-wrap pt-0.5" style={{ color: 'var(--muted)' }}>
                                    <span className="line-through opacity-70">{formatAuditValue(c.from, c.field)}</span>
                                    <ArrowRight size={11} className="shrink-0" style={{ color: config.color }} />
                                    <span className="font-medium" style={{ color: config.color }}>{formatAuditValue(c.to, c.field)}</span>
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {auditLogs.length === 0 && (
          <div className="mt-5 flex flex-col items-center justify-center rounded-lg border border-dashed py-8" style={{ borderColor: 'var(--border)' }}>
            <FileText size={24} style={{ color: 'var(--muted)' }} />
            <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>No changes recorded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

const PESEWAS_FIELDS = new Set(['pricePesewas', 'comparePricePesewas', 'costPricePesewas', 'preorderDepositValue']);
const JSON_FIELDS = new Set(['optionsJson', 'imagesJson', 'specsJson', 'selectedOptionsJson']);

function formatAuditValue(value: unknown, field?: string): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') {
    if (field && PESEWAS_FIELDS.has(field)) {
      return `GHS ${(value / 100).toFixed(2)}`;
    }
    return value.toLocaleString();
  }
  const str = String(value);
  if (field && JSON_FIELDS.has(field)) {
    return formatJsonFieldSummary(str, field);
  }
  return str.length > 60 ? str.slice(0, 57) + '...' : str;
}

function formatJsonFieldSummary(jsonStr: string, field: string): string {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) return jsonStr.slice(0, 57) + '...';

    if (field === 'optionsJson') {
      return parsed
        .map((opt: { name?: string; values?: { label?: string }[] }) => {
          const values = opt.values?.map((v) => v.label).filter(Boolean).join(', ');
          return values ? `${opt.name}: ${values}` : opt.name;
        })
        .join(' · ');
    }

    if (field === 'imagesJson') {
      return `${parsed.length} image${parsed.length !== 1 ? 's' : ''}`;
    }

    if (field === 'specsJson') {
      return parsed
        .map((s: { key?: string; value?: string }) => `${s.key}: ${s.value}`)
        .join(' · ');
    }

    return `${parsed.length} item${parsed.length !== 1 ? 's' : ''}`;
  } catch {
    return jsonStr.length > 60 ? jsonStr.slice(0, 57) + '...' : jsonStr;
  }
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
