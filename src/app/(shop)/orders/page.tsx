'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useOrders } from '@/hooks/use-orders';
import { OrderCard } from '@/components/orders/OrderCard';
import { Button } from '@/components/ui/Button';
import type { Order, OrderStatus } from '@/types';

const statusTabs: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'PENDING_PAYMENT', label: 'Pending' },
  { key: 'PAYMENT_CONFIRMED', label: 'Confirmed' },
  { key: 'PROCESSING', label: 'Processing' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'DELIVERED', label: 'Delivered' },
];

export default function OrdersPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useOrders({
    page,
    limit: 20,
    status: activeTab === 'all' ? undefined : activeTab,
  });

  useEffect(() => {
    if (isHydrated && !user) {
      router.push('/login');
    }
  }, [isHydrated, user, router]);

  if (!isHydrated || !user) return null;

  const orders = (data?.data ?? []) as Order[];
  const meta = data?.meta;

  return (
    <div className="py-4">
      <h1
        className="mb-6 font-[family-name:var(--font-syne)] text-2xl font-bold"
        style={{ color: 'var(--white)' }}
      >
        My Orders
      </h1>

      {/* Status Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setPage(1);
            }}
            className="whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition-all"
            style={{
              background: activeTab === tab.key ? 'var(--gold)' : 'transparent',
              color: activeTab === tab.key ? 'var(--deep)' : 'var(--muted)',
              borderColor: activeTab === tab.key ? 'var(--gold)' : 'var(--border)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <span
            className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"
            style={{ color: 'var(--gold)' }}
          />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Package size={48} className="mb-4" style={{ color: 'var(--border)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
            No orders yet
          </p>
          <Button className="mt-4" onClick={() => router.push('/products')}>
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span
                className="text-sm"
                style={{ color: 'var(--muted)' }}
              >
                Page {page} of {meta.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
