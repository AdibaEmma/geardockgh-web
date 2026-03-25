'use client';

import {
  Search, X,
  Smartphone, Laptop, Monitor, Headphones, Keyboard, Battery,
  Armchair, Camera, Gamepad2, Joystick, HardDrive, Lightbulb,
  Cable, Package,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CATEGORIES } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

const ICON_MAP: Record<string, LucideIcon> = {
  Smartphone, Laptop, Monitor, Headphones, Keyboard, Battery,
  Armchair, Camera, Gamepad2, Joystick, HardDrive, Lightbulb,
  Cable, Package,
};

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function ProductFilters({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: ProductFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--muted)' }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
          style={{
            background: 'var(--deep)',
            color: 'var(--white)',
            borderColor: 'var(--border)',
          }}
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--muted)' }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={cn(
            'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
            !selectedCategory
              ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]'
              : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--gold)]/40 hover:text-[var(--white)]',
          )}
        >
          All
        </button>
        {CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.icon];
          return (
            <button
              key={cat.value}
              onClick={() =>
                onCategoryChange(selectedCategory === cat.value ? null : cat.value)
              }
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                selectedCategory === cat.value
                  ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--gold)]/40 hover:text-[var(--white)]',
              )}
            >
              {Icon && <Icon size={14} />}
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
