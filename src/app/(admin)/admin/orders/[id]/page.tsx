'use client';

import { use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, MapPin, User, MessageSquare } from 'lucide-react';
import { getAdminOrder, updateOrderStatus } from '@/lib/api/admin';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/stores/toast-store';
import { formatPesewas, formatDate } from '@/lib/utils/formatters';
import type { Order, OrderStatus, SelectedOption } from '@/types';

const allStatuses: OrderStatus[] = [
  'PENDING_PAYMENT',
  'PAYMENT_CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
];

interface AdminOrderDetailProps {
  params: Promise<{ id: string }>;
}

export default function AdminOrderDetailPage({ params }: AdminOrderDetailProps) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => getAdminOrder(id),
  });

  const { mutate: changeStatus } = useMutation({
    mutationFn: (status: string) => updateOrderStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      addToast({ type: 'success', message: 'Order status updated' });
    },
  });

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

  const order = data?.data as
    | (Order & {
        customer?: { firstName: string; lastName: string; email: string; phone?: string };
        shippingAddress?: { street: string; city: string; region: string };
        notes?: string | null;
      })
    | undefined;

  if (!order) {
    return (
      <div className="py-12 text-center" style={{ color: 'var(--muted)' }}>
        Order not found
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-6 inline-flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--gold)]"
        style={{ color: 'var(--muted)' }}
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            className="font-[family-name:var(--font-syne)] text-2xl font-bold"
            style={{ color: 'var(--white)' }}
          >
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Items */}
          <div
            className="rounded-xl border p-6"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <h3
              className="mb-4 font-[family-name:var(--font-syne)] font-bold"
              style={{ color: 'var(--white)' }}
            >
              Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ background: 'var(--deep)' }}
                  >
                    <ShoppingBag size={14} style={{ color: 'var(--muted)' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: 'var(--white)' }}>
                      {item.product?.name ?? 'Product'}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      Qty: {item.quantity} x {formatPesewas(item.unitPricePesewas)}
                    </p>
                    {item.selectedOptionsJson && (() => {
                      try {
                        const opts: SelectedOption[] = JSON.parse(item.selectedOptionsJson);
                        if (opts.length === 0) return null;
                        return (
                          <div className="mt-0.5 flex flex-wrap gap-1">
                            {opts.map((o) => (
                              <span
                                key={o.name}
                                className="rounded px-1.5 py-0.5 text-[10px]"
                                style={{ background: 'var(--deep)', color: 'var(--muted)' }}
                              >
                                {o.name}: {o.value}
                              </span>
                            ))}
                          </div>
                        );
                      } catch { return null; }
                    })()}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
                    {formatPesewas(item.unitPricePesewas * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="mt-4 flex justify-between border-t pt-4"
              style={{ borderColor: 'var(--border)' }}
            >
              <span className="font-semibold" style={{ color: 'var(--white)' }}>Total</span>
              <span
                className="font-[family-name:var(--font-syne)] text-lg font-bold"
                style={{ color: 'var(--gold)' }}
              >
                {formatPesewas(order.totalPesewas)}
              </span>
            </div>
          </div>

          {/* Customer */}
          {order.customer && (
            <div
              className="rounded-xl border p-6"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <User size={16} style={{ color: 'var(--gold)' }} />
                <h3
                  className="font-[family-name:var(--font-syne)] font-bold"
                  style={{ color: 'var(--white)' }}
                >
                  Customer
                </h3>
              </div>
              <p className="text-sm" style={{ color: 'var(--white)' }}>
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                {order.customer.email}
              </p>
              {order.customer.phone && (
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  {order.customer.phone}
                </p>
              )}
            </div>
          )}

          {/* Address */}
          {order.shippingAddress && (
            <div
              className="rounded-xl border p-6"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} style={{ color: 'var(--gold)' }} />
                <h3
                  className="font-[family-name:var(--font-syne)] font-bold"
                  style={{ color: 'var(--white)' }}
                >
                  Shipping
                </h3>
              </div>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.region}
              </p>
            </div>
          )}

          {/* Customer Notes */}
          {order.notes && (
            <div
              className="rounded-xl border p-6"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={16} style={{ color: 'var(--gold)' }} />
                <h3
                  className="font-[family-name:var(--font-syne)] font-bold"
                  style={{ color: 'var(--white)' }}
                >
                  Customer Notes
                </h3>
              </div>
              <p
                className="text-sm whitespace-pre-wrap"
                style={{ color: 'var(--muted)' }}
              >
                {order.notes}
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div
            className="rounded-xl border p-6"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <h3
              className="mb-4 font-[family-name:var(--font-syne)] font-bold"
              style={{ color: 'var(--white)' }}
            >
              Update Status
            </h3>
            <div className="space-y-2">
              {allStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => changeStatus(status)}
                  disabled={order.status === status}
                  className="w-full rounded-lg border px-3 py-2 text-left text-xs font-medium transition-all disabled:opacity-40"
                  style={{
                    borderColor:
                      order.status === status
                        ? 'var(--gold)'
                        : 'var(--border)',
                    color:
                      order.status === status
                        ? 'var(--gold)'
                        : 'var(--white)',
                  }}
                >
                  {status.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <div
            className="rounded-xl border p-6"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <h3
              className="mb-4 font-[family-name:var(--font-syne)] font-bold"
              style={{ color: 'var(--white)' }}
            >
              Timeline
            </h3>
            <OrderTimeline status={order.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
