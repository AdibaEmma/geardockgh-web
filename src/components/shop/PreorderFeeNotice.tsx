import { Info } from 'lucide-react';

interface PreorderFeeNoticeProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function PreorderFeeNotice({ variant = 'default', className = '' }: PreorderFeeNoticeProps) {
  const message =
    variant === 'compact'
      ? 'Excl. shipping & applicable fees on arrival'
      : 'Price excludes shipping and other applicable fees which will be calculated when your order is ready for delivery.';

  return (
    <div
      className={`flex items-start gap-2 rounded-lg px-3 py-2.5 ${className}`}
      style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' }}
    >
      <Info size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--gold)' }} />
      <p className="text-xs leading-relaxed" style={{ color: 'var(--gold)' }}>
        {message}
      </p>
    </div>
  );
}
