'use client';

import type { OrderStatus } from '@/types';

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; bg: string }
> = {
  PENDING_PAYMENT: { label: 'Pending Payment', color: 'var(--gold)', bg: 'rgba(240,165,0,0.1)' },
  PAYMENT_CONFIRMED: { label: 'Confirmed', color: 'var(--teal)', bg: 'rgba(0,201,167,0.1)' },
  PROCESSING: { label: 'Processing', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  SHIPPED: { label: 'Shipped', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  DELIVERED: { label: 'Delivered', color: 'var(--teal)', bg: 'rgba(0,201,167,0.1)' },
  CANCELLED: { label: 'Cancelled', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  REFUNDED: { label: 'Refunded', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ color: config.color, background: config.bg }}
    >
      {config.label}
    </span>
  );
}
