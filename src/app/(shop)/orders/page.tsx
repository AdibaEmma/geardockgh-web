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
    <div className="py-6">
      <h1
        className="mb-2 font-[family-name:var(--font-outfit)] text-2xl font-bold"
        style={{ color: 'var(--white)' }}
      >
        My Orders
      </h1>
      <p className="mb-6 text-sm" style={{ color: 'var(--muted)' }}>
        Track and manage your purchases
      </p>

      {/* Status Tabs */}
      <div
        className="mb-6 flex gap-2 overflow-x-auto border-b pb-4"
        style={{ borderColor: 'var(--border)' }}
      >
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setPage(1);
            }}
            className="whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200"
            style={{
              background: activeTab === tab.key ? 'var(--gold)' : 'transparent',
              color: activeTab === tab.key ? 'var(--deep)' : 'var(--muted)',
              borderColor: activeTab === tab.key ? 'var(--gold)' : 'var(--border)',
              boxShadow: activeTab === tab.key ? '0 2px 8px rgba(240,165,0,0.25)' : 'none',
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
        <div
          className="flex flex-col items-center justify-center rounded-xl border py-20"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: 'rgba(240,165,0,0.08)' }}
          >
            <Package size={28} style={{ color: 'var(--gold)' }} />
          </div>
          <p className="text-base font-semibold" style={{ color: 'var(--white)' }}>
            No orders yet
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Your order history will appear here
          </p>
          <Button className="mt-6" onClick={() => router.push('/products')}>
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-3.5">
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
