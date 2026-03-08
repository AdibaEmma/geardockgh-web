'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ChevronRight, Search } from 'lucide-react';
import { getAdminOrders, updateOrderStatus } from '@/lib/api/admin';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { Button } from '@/components/ui/Button';
import { formatPesewas, formatDate } from '@/lib/utils/formatters';
import { useToastStore } from '@/stores/toast-store';
import type { Order, OrderStatus } from '@/types';

const allStatuses: OrderStatus[] = [
  'PENDING_PAYMENT',
  'PAYMENT_CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
];

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', { page, status: statusFilter, search }],
    queryFn: () =>
      getAdminOrders({
        page,
        limit: 20,
        status: statusFilter || undefined,
        search: search || undefined,
      }),
  });

  const { mutate: changeStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateOrderStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      addToast({ type: 'success', message: 'Order status updated' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to update status' });
    },
  });

  const orders = (data?.data ?? []) as (Order & {
    customer?: { firstName: string; lastName: string; email: string };
  })[];
  const meta = data?.meta;

  return (
    <div>
      <h1
        className="mb-6 font-[family-name:var(--font-syne)] text-2xl font-bold"
        style={{ color: 'var(--white)' }}
      >
        Orders
      </h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4 flex items-center gap-3">
        <div
          className="flex flex-1 items-center gap-2 rounded-lg border px-3 py-2"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <Search size={16} style={{ color: 'var(--muted)' }} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by order number or customer name..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
            style={{ color: 'var(--white)' }}
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          style={{ background: 'var(--gold)', color: 'var(--black)' }}
        >
          Search
        </button>
      </form>

      {/* Filter */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => {
            setStatusFilter('');
            setPage(1);
          }}
          className="whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium"
          style={{
            background: !statusFilter ? 'var(--gold)' : 'transparent',
            color: !statusFilter ? 'var(--deep)' : 'var(--muted)',
            borderColor: !statusFilter ? 'var(--gold)' : 'var(--border)',
          }}
        >
          All
        </button>
        {allStatuses.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className="whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium"
            style={{
              background: statusFilter === s ? 'var(--gold)' : 'transparent',
              color: statusFilter === s ? 'var(--deep)' : 'var(--muted)',
              borderColor: statusFilter === s ? 'var(--gold)' : 'var(--border)',
            }}
          >
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <span
            className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"
            style={{ color: 'var(--gold)' }}
          />
        </div>
      ) : (
        <div
          className="overflow-hidden rounded-xl border"
          style={{ borderColor: 'var(--border)' }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--card)' }}>
                {['Order', 'Customer', 'Status', 'Total', 'Date', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold"
                      style={{ color: 'var(--muted)' }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <td className="px-4 py-3">
                    <span
                      className="font-[family-name:var(--font-space-mono)] text-sm font-bold"
                      style={{ color: 'var(--white)' }}
                    >
                      {order.orderNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm" style={{ color: 'var(--white)' }}>
                      {order.customer
                        ? `${order.customer.firstName} ${order.customer.lastName}`
                        : '--'}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      {order.customer?.email}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        changeStatus({
                          id: order.id,
                          status: e.target.value,
                        })
                      }
                      className="rounded border px-2 py-1 text-xs"
                      style={{
                        background: 'var(--deep)',
                        color: 'var(--white)',
                        borderColor: 'var(--border)',
                      }}
                    >
                      {allStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: 'var(--gold)' }}
                    >
                      {formatPesewas(order.totalPesewas)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
                      {formatDate(order.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs font-medium transition-colors hover:text-[var(--gold)]"
                      style={{ color: 'var(--muted)' }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
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
  );
}
