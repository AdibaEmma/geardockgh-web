import { formatDate } from '@/lib/utils/formatters';
import { User } from 'lucide-react';

interface RecentCustomer {
  id: string;
  name: string;
  email: string;
  ordersCount: number;
  joinedAt: string;
}

interface RecentCustomersProps {
  customers: RecentCustomer[];
}

export function RecentCustomers({ customers }: RecentCustomersProps) {
  return (
    <div
      className="rounded-xl border"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="border-b px-5 py-4" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
          Recent Customers
        </h3>
      </div>

      {customers.length === 0 ? (
        <p className="py-10 text-center text-sm" style={{ color: 'var(--muted)' }}>
          No customers yet
        </p>
      ) : (
        <ul>
          {customers.map((c, i) => (
            <li
              key={c.id}
              className="flex items-center gap-3 px-5 py-3"
              style={{
                borderBottom: i < customers.length - 1 ? '1px solid var(--border)' : undefined,
              }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}
              >
                <User size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium" style={{ color: 'var(--white)' }}>
                  {c.name}
                </p>
                <p className="truncate text-xs" style={{ color: 'var(--muted)' }}>
                  {c.email}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-medium" style={{ color: 'var(--white)' }}>
                  {c.ordersCount} {c.ordersCount === 1 ? 'order' : 'orders'}
                </p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  {formatDate(c.joinedAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
