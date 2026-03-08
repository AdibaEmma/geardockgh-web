'use client';

import { use } from 'react';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useOrder } from '@/hooks/use-orders';
import { formatPesewas } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/Button';
import type { Order } from '@/types';

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderConfirmationPage({ params }: ConfirmationPageProps) {
  const { id } = use(params);
  const { data, isLoading } = useOrder(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span
          className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"
          style={{ color: 'var(--gold)' }}
        />
      </div>
    );
  }

  const order = data?.data as Order | undefined;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p style={{ color: 'var(--muted)' }}>Order not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg py-12 text-center">
      <div className="mb-6">
        <CheckCircle
          size={64}
          className="mx-auto"
          style={{ color: 'var(--teal)' }}
        />
      </div>

      <h1
        className="mb-2 font-[family-name:var(--font-syne)] text-3xl font-bold"
        style={{ color: 'var(--white)' }}
      >
        Order Placed!
      </h1>
      <p className="mb-6 text-sm" style={{ color: 'var(--muted)' }}>
        Thank you for your order. We&apos;ll notify you when it ships.
      </p>

      <div
        className="mx-auto mb-8 rounded-xl border p-6"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="mb-4 flex items-center justify-center gap-2">
          <Package size={18} style={{ color: 'var(--gold)' }} />
          <span
            className="font-[family-name:var(--font-space-mono)] text-sm font-bold"
            style={{ color: 'var(--white)' }}
          >
            {order.orderNumber}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--muted)' }}>Items</span>
            <span style={{ color: 'var(--white)' }}>{order.items.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--muted)' }}>Total</span>
            <span
              className="font-[family-name:var(--font-syne)] font-bold"
              style={{ color: 'var(--gold)' }}
            >
              {formatPesewas(order.totalPesewas)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--muted)' }}>Status</span>
            <span
              className="font-medium"
              style={{
                color:
                  order.status === 'PAYMENT_CONFIRMED'
                    ? 'var(--teal)'
                    : 'var(--gold)',
              }}
            >
              {order.status === 'PAYMENT_CONFIRMED'
                ? 'Payment Confirmed'
                : 'Awaiting Payment'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href={`/orders/${order.id}`}>
          <Button variant="secondary" className="w-full sm:w-auto">
            View Order Details
          </Button>
        </Link>
        <Link href="/products">
          <Button className="w-full sm:w-auto">
            Continue Shopping
            <ArrowRight size={16} className="ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
