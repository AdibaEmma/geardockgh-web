interface PreorderBadgeProps {
  size?: 'sm' | 'md';
}

export function PreorderBadge({ size = 'sm' }: PreorderBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider shadow-md ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
      style={{ background: '#F59E0B', color: '#000' }}
    >
      Pre-Order
    </span>
  );
}
