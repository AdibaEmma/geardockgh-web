'use client';

import Link from 'next/link';
import { formatPesewas, formatDate } from '@/lib/utils/formatters';
import type { Preorder, PreorderStatus } from '@/types';

const STATUS_CONFIG: Record<PreorderStatus, { label: string; color: string; bg: string }> = {
  RESERVED: { label: 'Reserved', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.1)' },
  DEPOSIT_PAID: { label: 'Deposit Paid', color: 'var(--gold)', bg: 'rgba(245, 158, 11, 0.1)' },
  FULLY_PAID: { label: 'Fully Paid', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  READY_TO_SHIP: { label: 'Ready to Ship', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)' },
  FULFILLED: { label: 'Fulfilled', color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
  CANCELLED: { label: 'Cancelled', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

interface PreorderCardProps {
  preorder: Preorder;
}

export function PreorderCard({ preorder }: PreorderCardProps) {
  const config = STATUS_CONFIG[preorder.status] ?? STATUS_CONFIG.RESERVED;

  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/products/${preorder.product?.slug ?? preorder.productId}`}
            className="text-sm font-semibold hover:underline"
            style={{ color: 'var(--white)' }}
          >
            {preorder.product?.name ?? 'Product'}
          </Link>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>
            Qty: {preorder.quantity}
          </p>
        </div>
        <span
          className="flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{ color: config.color, background: config.bg }}
        >
          {config.label}
        </span>
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span style={{ color: 'var(--muted)' }}>Deposit</span>
          <span style={{ color: 'var(--white)' }}>{formatPesewas(preorder.depositPesewas)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: 'var(--muted)' }}>Balance</span>
          <span style={{ color: 'var(--muted)' }}>{formatPesewas(preorder.balancePesewas)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: 'var(--muted)' }}>Total</span>
          <span className="font-semibold" style={{ color: 'var(--gold)' }}>
            {formatPesewas(preorder.totalPesewas)}
          </span>
        </div>
      </div>

      {preorder.estArrivalDate && (
        <p className="mt-2 text-xs" style={{ color: 'var(--gold)' }}>
          Est. arrival: {formatDate(preorder.estArrivalDate)}
        </p>
      )}

      <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
        Ordered {formatDate(preorder.createdAt)}
      </p>
    </div>
  );
}
