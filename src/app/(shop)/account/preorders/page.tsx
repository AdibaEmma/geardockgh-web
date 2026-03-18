'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePreorders } from '@/hooks/use-preorders';
import { PreorderCard } from '@/components/account/PreorderCard';
import type { Preorder, PreorderStatus } from '@/types';

const TABS: { label: string; value: PreorderStatus | null }[] = [
  { label: 'All', value: null },
  { label: 'Deposit Paid', value: 'DEPOSIT_PAID' },
  { label: 'Ready to Ship', value: 'READY_TO_SHIP' },
  { label: 'Fulfilled', value: 'FULFILLED' },
];

export default function PreordersPage() {
  const [status, setStatus] = useState<PreorderStatus | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = usePreorders({
    status: status ?? undefined,
    page,
    limit: 20,
  });

  const preorders = (data?.data ?? []) as Preorder[];
  const meta = data?.meta;

  return (
    <div>
      <Link
        href="/account"
        className="mb-4 inline-flex items-center gap-1.5 text-sm transition-colors hover:underline"
        style={{ color: 'var(--muted)' }}
      >
        <ArrowLeft size={16} />
        Back to account
      </Link>

      <h1
        className="font-[family-name:var(--font-syne)] text-2xl font-bold"
        style={{ color: 'var(--white)' }}
      >
        My Pre-Orders
      </h1>

      <div className="mt-4 flex gap-2 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
            className="flex-shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors"
            style={{
              borderColor: status === tab.value ? '#F59E0B' : 'var(--border)',
              color: status === tab.value ? '#F59E0B' : 'var(--muted)',
              background: status === tab.value ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-xl"
              style={{ background: 'var(--card)' }}
            />
          ))
        ) : preorders.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              No pre-orders found
            </p>
            <Link
              href="/products"
              className="mt-2 inline-block text-sm hover:underline"
              style={{ color: 'var(--gold)' }}
            >
              Browse products
            </Link>
          </div>
        ) : (
          preorders.map((preorder) => (
            <PreorderCard key={preorder.id} preorder={preorder} />
          ))
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          >
            Previous
          </button>
          <span
            className="px-3 font-[family-name:var(--font-space-mono)] text-xs"
            style={{ color: 'var(--muted)' }}
          >
            {page} / {meta.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page >= meta.totalPages}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
