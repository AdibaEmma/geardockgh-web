import Link from 'next/link';
import { formatPesewas, formatDate } from '@/lib/utils/formatters';

const statusStyles: Record<string, { bg: string; text: string }> = {
  PENDING_PAYMENT: { bg: 'rgba(240,165,0,0.15)', text: '#F0A500' },
  PAYMENT_CONFIRMED: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
  PROCESSING: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
  SHIPPED: { bg: 'rgba(139,92,246,0.15)', text: '#8b5cf6' },
  DELIVERED: { bg: 'rgba(20,184,166,0.15)', text: 'var(--teal)' },
  CANCELLED: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' },
  REFUNDED: { bg: 'rgba(107,114,128,0.15)', text: '#6b7280' },
};

function statusLabel(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalPesewas: number;
  customerName: string;
  customerEmail: string;
  createdAt: string;
}

interface RecentOrdersTableProps {
  orders: RecentOrder[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <div
      className="rounded-xl border"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
          Recent Orders
        </h3>
        <Link
          href="/admin/orders"
          className="text-xs font-medium transition-colors hover:underline"
          style={{ color: 'var(--gold)' }}
        >
          View All
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="py-10 text-center text-sm" style={{ color: 'var(--muted)' }}>
          No orders yet
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                  Order
                </th>
                <th className="hidden px-5 py-3 text-xs font-medium uppercase tracking-wide md:table-cell" style={{ color: 'var(--muted)' }}>
                  Customer
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-right" style={{ color: 'var(--muted)' }}>
                  Amount
                </th>
                <th className="hidden px-5 py-3 text-xs font-medium uppercase tracking-wide text-right lg:table-cell" style={{ color: 'var(--muted)' }}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const style = statusStyles[order.status] ?? statusStyles.PENDING_PAYMENT;
                return (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium hover:underline"
                        style={{ color: 'var(--gold)' }}
                      >
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td className="hidden px-5 py-3 md:table-cell">
                      <div>
                        <p className="font-medium" style={{ color: 'var(--white)' }}>
                          {order.customerName}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>
                          {order.customerEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ background: style.bg, color: style.text }}
                      >
                        {statusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium" style={{ color: 'var(--white)' }}>
                      {formatPesewas(order.totalPesewas)}
                    </td>
                    <td className="hidden px-5 py-3 text-right lg:table-cell" style={{ color: 'var(--muted)' }}>
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
