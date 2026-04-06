'use client';

import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SortState {
  field: string;
  order: 'asc' | 'desc';
}

interface SortableHeaderProps {
  label: string;
  field: string;
  currentSort: SortState | null;
  onSort: (sort: SortState | null) => void;
  className?: string;
}

export function SortableHeader({
  label,
  field,
  currentSort,
  onSort,
  className,
}: SortableHeaderProps) {
  const isActive = currentSort?.field === field;
  const direction = isActive ? currentSort.order : null;

  const handleClick = () => {
    if (!isActive) {
      onSort({ field, order: 'asc' });
    } else if (direction === 'asc') {
      onSort({ field, order: 'desc' });
    } else {
      onSort(null);
    }
  };

  return (
    <th
      className={cn(
        'cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold transition-colors hover:text-[var(--gold)]',
        className,
      )}
      style={{ color: isActive ? 'var(--gold)' : 'var(--muted)' }}
      onClick={handleClick}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive ? (
          direction === 'asc' ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )
        ) : (
          <ChevronsUpDown size={12} style={{ opacity: 0.4 }} />
        )}
      </span>
    </th>
  );
}
