'use client';

import Link from 'next/link';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { formatPesewas, formatDate } from '@/lib/utils/formatters';
import { OrderStatusBadge } from './OrderStatusBadge';
import type { Order } from '@/types';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const firstItem = order.items[0];

  return (
    <Link href={`/orders/${order.id}`}>
      <div
        className="flex items-center gap-4 rounded-xl border p-4 transition-all hover:border-[var(--gold)]"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Image */}
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg"
          style={{ background: 'var(--deep)' }}
        >
          {firstItem?.product?.imagesJson ? (
            <img
              src={JSON.parse(firstItem.product.imagesJson)[0]}
              alt={firstItem.product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <ShoppingBag size={20} style={{ color: 'var(--muted)' }} />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p
              className="font-[family-name:var(--font-space-mono)] text-sm font-bold"
              style={{ color: 'var(--white)' }}
            >
              {order.orderNumber}
            </p>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>
            {formatDate(order.createdAt)} · {order.items.length}{' '}
            {order.items.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Price + Arrow */}
        <div className="flex items-center gap-2">
          <span
            className="font-[family-name:var(--font-syne)] font-bold"
            style={{ color: 'var(--gold)' }}
          >
            {formatPesewas(order.totalPesewas)}
          </span>
          <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
        </div>
      </div>
    </Link>
  );
}
