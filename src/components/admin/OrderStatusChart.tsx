interface StatusBarProps {
  label: string;
  count: number;
  total: number;
  color: string;
}

function StatusBar({ label, count, total, color }: StatusBarProps) {
  const pct = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: 'var(--muted)' }}>{label}</span>
        <span className="font-medium" style={{ color: 'var(--white)' }}>
          {count}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full"
        style={{ background: 'var(--border)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

interface OrderStatusChartProps {
  ordersByStatus: {
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  total: number;
}

export function OrderStatusChart({ ordersByStatus, total }: OrderStatusChartProps) {
  const statuses: { label: string; key: keyof typeof ordersByStatus; color: string }[] = [
    { label: 'Pending Payment', key: 'pending', color: '#F0A500' },
    { label: 'Confirmed', key: 'confirmed', color: '#22c55e' },
    { label: 'Processing', key: 'processing', color: '#3b82f6' },
    { label: 'Shipped', key: 'shipped', color: '#8b5cf6' },
    { label: 'Delivered', key: 'delivered', color: 'var(--teal)' },
    { label: 'Cancelled', key: 'cancelled', color: '#ef4444' },
  ];

  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <h3
        className="mb-4 text-sm font-semibold"
        style={{ color: 'var(--white)' }}
      >
        Order Status Breakdown
      </h3>
      {total === 0 ? (
        <p className="py-6 text-center text-sm" style={{ color: 'var(--muted)' }}>
          No orders yet
        </p>
      ) : (
        <div className="space-y-3">
          {statuses.map(({ label, key, color }) => (
            <StatusBar
              key={key}
              label={label}
              count={ordersByStatus[key]}
              total={total}
              color={color}
            />
          ))}
        </div>
      )}
    </div>
  );
}
