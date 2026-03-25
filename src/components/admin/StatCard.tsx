import type { LucideIcon } from 'lucide-react';
import { TrendingUp } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  Icon: LucideIcon;
  color: string;
  trend?: string;
}

export function StatCard({ label, value, subValue, Icon, color, trend }: StatCardProps) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
            {label}
          </p>
          <p
            className="mt-2 font-[family-name:var(--font-outfit)] text-2xl font-bold"
            style={{ color: 'var(--white)' }}
          >
            {value}
          </p>
          {subValue && (
            <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
              {subValue}
            </p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp size={12} style={{ color: 'var(--teal)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--teal)' }}>
                {trend}
              </span>
            </div>
          )}
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `${color}15`, color }}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
