'use client';

import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import type { ProductOption, ProductOptionValue } from '@/types';

interface OptionsEditorProps {
  options: ProductOption[];
  onChange: (options: ProductOption[]) => void;
}

function pesewasToGhs(pesewas?: number): string {
  if (pesewas == null || pesewas <= 0) return '';
  return (pesewas / 100).toString();
}

export function OptionsEditor({ options, onChange }: OptionsEditorProps) {
  // Track raw string values for price inputs so typing isn't interrupted
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});

  const getPriceKey = (gi: number, vi: number) => `${gi}-${vi}`;

  const getPriceDisplay = (gi: number, vi: number, val: ProductOptionValue): string => {
    const key = getPriceKey(gi, vi);
    if (key in priceInputs) return priceInputs[key];
    return pesewasToGhs(val.priceDelta);
  };

  const addGroup = () => {
    onChange([
      ...options,
      { name: '', type: 'text', values: [{ label: '' }] },
    ]);
  };

  const removeGroup = (groupIndex: number) => {
    onChange(options.filter((_: ProductOption, i: number) => i !== groupIndex));
  };

  const updateGroup = (groupIndex: number, updates: Partial<ProductOption>) => {
    onChange(
      options.map((g, i) => (i === groupIndex ? { ...g, ...updates } : g)),
    );
  };

  const addValue = (groupIndex: number) => {
    const group = options[groupIndex];
    const newValue: ProductOptionValue =
      group.type === 'color' ? { label: '', hex: '#000000' } : { label: '' };
    updateGroup(groupIndex, {
      values: [...group.values, newValue],
    });
  };

  const removeValue = (groupIndex: number, valueIndex: number) => {
    const group = options[groupIndex];
    updateGroup(groupIndex, {
      values: group.values.filter((_: ProductOptionValue, i: number) => i !== valueIndex),
    });
  };

  const updateValue = (
    groupIndex: number,
    valueIndex: number,
    updates: Partial<ProductOptionValue>,
  ) => {
    const group = options[groupIndex];
    updateGroup(groupIndex, {
      values: group.values.map((v, i) =>
        i === valueIndex ? { ...v, ...updates } : v,
      ),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label
          className="text-sm font-medium"
          style={{ color: 'var(--white)' }}
        >
          Product Options
        </label>
        <button
          type="button"
          onClick={addGroup}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/5"
          style={{ color: 'var(--gold)' }}
        >
          <Plus size={14} />
          Add Option Group
        </button>
      </div>

      {options.map((group, gi) => (
        <div
          key={gi}
          className="rounded-lg border p-4 space-y-3"
          style={{
            borderColor: 'rgba(245, 158, 11, 0.3)',
            background: 'rgba(245, 158, 11, 0.03)',
          }}
        >
          {/* Group header */}
          <div className="flex items-start gap-3">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <Input
                label="Option Name"
                value={group.name}
                onChange={(e) => updateGroup(gi, { name: e.target.value })}
                placeholder="e.g. Color, Size"
              />
              <div className="w-full">
                <label
                  className="mb-1.5 block text-sm font-medium"
                  style={{ color: 'var(--white)' }}
                >
                  Type
                </label>
                <select
                  value={group.type}
                  onChange={(e) => {
                    const newType = e.target.value as 'color' | 'text';
                    const updatedValues = group.values.map((v: ProductOptionValue) =>
                      newType === 'color'
                        ? { ...v, hex: v.hex ?? '#000000' }
                        : { label: v.label, priceDelta: v.priceDelta },
                    );
                    updateGroup(gi, { type: newType, values: updatedValues });
                  }}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                  style={{
                    background: 'var(--deep)',
                    color: 'var(--white)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <option value="text">Text (pills)</option>
                  <option value="color">Color (swatches)</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeGroup(gi)}
              className="mt-7 rounded p-1.5 text-red-400 transition-colors hover:bg-red-500/10"
              title="Remove option group"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Values */}
          <div className="space-y-2">
            <label
              className="text-xs font-medium"
              style={{ color: 'var(--muted)' }}
            >
              Values
            </label>
            {group.values.map((val: ProductOptionValue, vi: number) => (
              <div key={vi} className="flex items-center gap-2">
                {group.type === 'color' && (
                  <input
                    type="color"
                    value={val.hex ?? '#000000'}
                    onChange={(e) =>
                      updateValue(gi, vi, { hex: e.target.value })
                    }
                    className="h-9 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
                    title="Pick color"
                  />
                )}
                <input
                  value={val.label}
                  onChange={(e) =>
                    updateValue(gi, vi, { label: e.target.value })
                  }
                  placeholder="Label"
                  className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                  style={{
                    background: 'var(--deep)',
                    color: 'var(--white)',
                    borderColor: 'var(--border)',
                  }}
                />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={getPriceDisplay(gi, vi, val)}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setPriceInputs((prev) => ({ ...prev, [getPriceKey(gi, vi)]: raw }));
                    updateValue(gi, vi, {
                      priceDelta: raw ? Math.round(Number(raw) * 100) : undefined,
                    });
                  }}
                  onBlur={() => {
                    // Clear tracked raw input so it falls back to derived value
                    setPriceInputs((prev) => {
                      const next = { ...prev };
                      delete next[getPriceKey(gi, vi)];
                      return next;
                    });
                  }}
                  placeholder="+GHS"
                  className="w-20 rounded-lg border px-2 py-2 text-sm outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                  style={{
                    background: 'var(--deep)',
                    color: 'var(--white)',
                    borderColor: 'var(--border)',
                  }}
                  title="Price add-on in GHS"
                />
                <button
                  type="button"
                  onClick={() => removeValue(gi, vi)}
                  className="rounded p-1 transition-colors hover:bg-white/5"
                  style={{ color: 'var(--muted)' }}
                  title="Remove value"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addValue(gi)}
              className="flex items-center gap-1 text-xs transition-colors hover:underline"
              style={{ color: 'var(--gold)' }}
            >
              <Plus size={12} />
              Add value
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
