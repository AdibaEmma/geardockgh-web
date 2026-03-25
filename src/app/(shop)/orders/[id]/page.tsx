'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useOrder, useCancelOrder } from '@/hooks/use-orders';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { Button } from '@/components/ui/Button';
import { formatPesewas, formatDate } from '@/lib/utils/formatters';
import type { Order } from '@/types';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading } = useOrder(id);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

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

  const order = data?.data as (Order & { shippingAddress?: { street: string; city: string; region: string } }) | undefined;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p style={{ color: 'var(--muted)' }}>Order not found</p>
        <Button className="mt-4" onClick={() => router.push('/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="py-4">
      <Link
        href="/orders"
        className="mb-6 inline-flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--gold)]"
        style={{ color: 'var(--muted)' }}
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            className="font-[family-name:var(--font-outfit)] text-2xl font-bold"
            style={{ color: 'var(--white)' }}
          >
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Items + Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Items */}
          <div
            className="rounded-xl border p-6"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <h3
              className="mb-4 font-[family-name:var(--font-outfit)] font-bold"
              style={{ color: 'var(--white)' }}
            >
              Items
            </h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg"
                    style={{ background: 'var(--deep)' }}
                  >
                    {item.product?.imagesJson ? (
                      <img
                        src={JSON.parse(item.product.imagesJson)[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ShoppingBag
                        size={16}
                        style={{ color: 'var(--muted)' }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium"
                      style={{ color: 'var(--white)' }}
                    >
                      {item.product?.name ?? 'Product'}
                    </p>
                    {item.variant && (
                      <p
                        className="text-xs"
                        style={{ color: 'var(--muted)' }}
                      >
                        {item.variant.name}
                      </p>
                    )}
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      Qty: {item.quantity} x{' '}
                      {formatPesewas(item.unitPricePesewas)}
                    </p>
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--white)' }}
                  >
                    {formatPesewas(item.unitPricePesewas * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div
              className="mt-4 space-y-2 border-t pt-4"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--muted)' }}>Subtotal</span>
                <span style={{ color: 'var(--white)' }}>
                  {formatPesewas(order.subtotalPesewas)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--muted)' }}>Delivery</span>
                <span style={{ color: 'var(--teal)' }}>
                  {order.deliveryFee === 0
                    ? 'Free'
                    : formatPesewas(order.deliveryFee)}
                </span>
              </div>
              {order.discountPesewas > 0 && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted)' }}>Discount</span>
                  <span style={{ color: 'var(--teal)' }}>
                    -{formatPesewas(order.discountPesewas)}
                  </span>
                </div>
              )}
              <div
                className="flex justify-between border-t pt-2"
                style={{ borderColor: 'var(--border)' }}
              >
                <span
                  className="font-semibold"
                  style={{ color: 'var(--white)' }}
                >
                  Total
                </span>
                <span
                  className="font-[family-name:var(--font-outfit)] text-lg font-bold"
                  style={{ color: 'var(--gold)' }}
                >
                  {formatPesewas(order.totalPesewas)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div
              className="rounded-xl border p-6"
              style={{
                background: 'var(--card)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} style={{ color: 'var(--gold)' }} />
                <h3
                  className="font-[family-name:var(--font-outfit)] font-bold"
                  style={{ color: 'var(--white)' }}
                >
                  Shipping Address
                </h3>
              </div>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.region}
              </p>
            </div>
          )}
        </div>

        {/* Right: Timeline + Actions */}
        <div className="space-y-6">
          <div
            className="rounded-xl border p-6"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <h3
              className="mb-4 font-[family-name:var(--font-outfit)] font-bold"
              style={{ color: 'var(--white)' }}
            >
              Order Status
            </h3>
            <OrderTimeline status={order.status} />
          </div>

          {order.status === 'PENDING_PAYMENT' && (
            <Button
              variant="secondary"
              className="w-full border-red-500/50 text-red-400 hover:border-red-500 hover:text-red-400"
              onClick={() =>
                cancelOrder(order.id, {
                  onSuccess: () => router.push('/orders'),
                })
              }
              isLoading={isCancelling}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
