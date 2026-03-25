'use client';

import Link from 'next/link';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { formatPesewas, formatDate } from '@/lib/utils/formatters';
import { OrderStatusBadge, getStatusAccentColor } from './OrderStatusBadge';
import type { Order } from '@/types';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const firstItem = order.items[0];
  const accentColor = getStatusAccentColor(order.status);

  return (
    <Link href={`/orders/${order.id}`} className="group block">
      <div
        className="relative flex items-center gap-4 overflow-hidden rounded-xl border p-5 transition-all duration-300 ease-out hover:-translate-y-0.5"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = accentColor;
          e.currentTarget.style.boxShadow = `var(--shadow-md), 0 0 30px ${accentColor}15`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }}
      >
        {/* Status accent bar */}
        <div
          className="absolute left-0 top-0 h-full w-[3px]"
          style={{ background: accentColor }}
        />

        {/* Image */}
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg"
          style={{ background: 'var(--deep)' }}
        >
          {firstItem?.product?.imagesJson ? (
            <img
              src={JSON.parse(firstItem.product.imagesJson)[0]}
              alt={firstItem.product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <ShoppingBag size={20} style={{ color: 'var(--muted)' }} />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <p
              className="font-[family-name:var(--font-space-mono)] text-sm font-bold"
              style={{ color: 'var(--white)' }}
            >
              {order.orderNumber}
            </p>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
            {formatDate(order.createdAt)} · {order.items.length}{' '}
            {order.items.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Price + Arrow */}
        <div className="flex items-center gap-3">
          <span
            className="font-[family-name:var(--font-outfit)] text-base font-bold"
            style={{ color: 'var(--gold)' }}
          >
            {formatPesewas(order.totalPesewas)}
          </span>
          <ChevronRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
            style={{ color: 'var(--muted)' }}
          />
        </div>
      </div>
    </Link>
  );
}
