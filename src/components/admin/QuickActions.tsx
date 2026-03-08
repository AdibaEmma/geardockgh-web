import Link from 'next/link';
import { ShoppingCart, Package, Plus } from 'lucide-react';

const actions = [
  {
    href: '/admin/orders',
    label: 'Manage Orders',
    description: 'View and update order statuses',
    Icon: ShoppingCart,
    color: 'var(--teal)',
  },
  {
    href: '/admin/products',
    label: 'Manage Products',
    description: 'View and manage your inventory',
    Icon: Package,
    color: '#3b82f6',
  },
];

export function QuickActions() {
  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <h3
        className="mb-4 text-sm font-semibold"
        style={{ color: 'var(--white)' }}
      >
        Quick Actions
      </h3>
      <div className="space-y-2">
        {actions.map(({ href, label, description, Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ background: `${color}15`, color }}
            >
              <Icon size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium" style={{ color: 'var(--white)' }}>
                {label}
              </p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                {description}
              </p>
            </div>
            <Plus size={14} style={{ color: 'var(--muted)' }} />
          </Link>
        ))}
      </div>
    </div>
  );
}
