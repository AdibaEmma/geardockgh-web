'use client';

import { Check, Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import type { OrderStatus } from '@/types';

const timelineSteps: {
  key: OrderStatus;
  label: string;
  Icon: typeof Check;
}[] = [
  { key: 'PENDING_PAYMENT', label: 'Order Placed', Icon: Clock },
  { key: 'PAYMENT_CONFIRMED', label: 'Payment Confirmed', Icon: Check },
  { key: 'PROCESSING', label: 'Processing', Icon: Package },
  { key: 'SHIPPED', label: 'Shipped', Icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', Icon: CheckCircle },
];

const statusOrder: OrderStatus[] = [
  'PENDING_PAYMENT',
  'PAYMENT_CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
];

interface OrderTimelineProps {
  status: OrderStatus;
}

export function OrderTimeline({ status }: OrderTimelineProps) {
  if (status === 'CANCELLED' || status === 'REFUNDED') {
    return (
      <div className="flex items-center gap-3 py-4">
        <XCircle size={24} style={{ color: '#ef4444' }} />
        <span className="text-sm font-medium" style={{ color: '#ef4444' }}>
          Order {status === 'CANCELLED' ? 'Cancelled' : 'Refunded'}
        </span>
      </div>
    );
  }

  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="space-y-0">
      {timelineSteps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === timelineSteps.length - 1;
        const Icon = step.Icon;

        return (
          <div key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{
                  background: isCompleted ? 'var(--gold)' : 'var(--card)',
                  border: `2px solid ${isCompleted ? 'var(--gold)' : 'var(--border)'}`,
                  color: isCompleted ? 'var(--deep)' : 'var(--muted)',
                }}
              >
                <Icon size={14} />
              </div>
              {!isLast && (
                <div
                  className="w-0.5 flex-1 min-h-[24px]"
                  style={{
                    background: index < currentIndex ? 'var(--gold)' : 'var(--border)',
                  }}
                />
              )}
            </div>
            <div className="pb-6">
              <p
                className="text-sm font-medium"
                style={{
                  color: isCurrent ? 'var(--gold)' : isCompleted ? 'var(--white)' : 'var(--muted)',
                }}
              >
                {step.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
