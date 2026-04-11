'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Tag, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';
import {
  getAdminDiscounts,
  createAdminDiscount,
  toggleDiscountActive,
  deleteAdminDiscount,
  type DiscountCode,
  type CreateDiscountPayload,
} from '@/lib/api/admin';
import { Button } from '@/components/ui/Button';
import { formatPesewas, formatDate } from '@/lib/utils/formatters';
import { useToastStore } from '@/stores/toast-store';

function formatDiscountValue(dc: DiscountCode): string {
  if (dc.type === 'percentage') {
    return `${(dc.value / 100).toFixed(0)}%`;
  }
  return formatPesewas(dc.value);
}

export default function AdminDiscountsPage() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);
  const [createOpen, setCreateOpen] = useState(false);

  // Form state
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-discounts'],
    queryFn: () => getAdminDiscounts({ limit: 50 }),
  });

  const discounts = (data?.data ?? []) as DiscountCode[];

  const { mutate: doCreate, isPending: isCreating } = useMutation({
    mutationFn: createAdminDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-discounts'] });
      addToast({ type: 'success', message: 'Discount code created' });
      resetForm();
      setCreateOpen(false);
    },
    onError: () => addToast({ type: 'error', message: 'Failed to create discount' }),
  });

  const { mutate: doToggle } = useMutation({
    mutationFn: toggleDiscountActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-discounts'] });
      addToast({ type: 'success', message: 'Discount status updated' });
    },
  });

  const { mutate: doDelete } = useMutation({
    mutationFn: deleteAdminDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-discounts'] });
      addToast({ type: 'success', message: 'Discount deleted' });
    },
  });

  const resetForm = () => {
    setCode('');
    setType('percentage');
    setValue('');
    setMinOrder('');
    setMaxUses('');
    setExpiresAt('');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !value) return;

    const payload: CreateDiscountPayload = {
      code: code.trim().toUpperCase(),
      type,
      value: type === 'percentage' ? Math.round(Number(value) * 100) : Math.round(Number(value) * 100),
      minOrderPesewas: minOrder ? Math.round(Number(minOrder) * 100) : undefined,
      maxUses: maxUses ? Number(maxUses) : undefined,
      expiresAt: expiresAt || undefined,
    };

    doCreate(payload);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-[family-name:var(--font-outfit)] text-2xl font-bold"
            style={{ color: 'var(--white)' }}
          >
            Discount Codes
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Create and manage promo codes for your store
          </p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus size={14} className="mr-1.5" />
          Create Code
        </Button>
      </div>

      {/* Create Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setCreateOpen(false)} />
          <div
            className="relative z-10 w-full max-w-md rounded-xl border p-6"
            style={{ background: 'var(--deep)', borderColor: 'var(--border)' }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: 'var(--white)' }}>
                Create Discount Code
              </h2>
              <button onClick={() => setCreateOpen(false)}>
                <X size={18} style={{ color: 'var(--muted)' }} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--white)' }}>
                  Code *
                </label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER20"
                  className="w-full rounded-lg border px-3 py-2 text-sm uppercase outline-none focus:border-[var(--gold)]"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--white)' }}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--white)' }}>
                    Type *
                  </label>
                  <div className="flex gap-2">
                    {(['percentage', 'fixed'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className="flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                        style={{
                          borderColor: type === t ? 'var(--gold)' : 'var(--border)',
                          color: type === t ? 'var(--gold)' : 'var(--white)',
                          background: type === t ? 'rgba(245,158,11,0.08)' : 'var(--card)',
                        }}
                      >
                        {t === 'percentage' ? '%' : 'GH₵'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--white)' }}>
                    Value * {type === 'percentage' ? '(%)' : '(GHS)'}
                  </label>
                  <input
                    type="number"
                    step={type === 'percentage' ? '1' : '0.01'}
                    min="0"
                    max={type === 'percentage' ? '100' : undefined}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={type === 'percentage' ? 'e.g. 10' : 'e.g. 20.00'}
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[var(--gold)]"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--white)' }}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--white)' }}>
                    Min Order (GHS)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    placeholder="Optional"
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[var(--gold)]"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--white)' }}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--white)' }}>
                    Max Uses
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    placeholder="Unlimited"
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[var(--gold)]"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--white)' }}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--white)' }}>
                  Expires At
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[var(--gold)]"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--white)' }}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)} size="sm">
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating} size="sm">
                  {isCreating ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div
        className="overflow-x-auto rounded-xl border"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <table className="w-full text-left">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Code', 'Type', 'Value', 'Min Order', 'Uses', 'Status', 'Expires', 'Actions'].map(
                (h) => (
                  <th key={h} className="px-5 py-3">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                      {h}
                    </span>
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm" style={{ color: 'var(--muted)' }}>
                  Loading...
                </td>
              </tr>
            ) : discounts.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm" style={{ color: 'var(--muted)' }}>
                  No discount codes yet
                </td>
              </tr>
            ) : (
              discounts.map((dc) => (
                <tr
                  key={dc.id}
                  className="transition-colors hover:bg-white/[0.02]"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Tag size={14} style={{ color: 'var(--gold)' }} />
                      <span className="font-mono text-sm font-bold" style={{ color: 'var(--gold)' }}>
                        {dc.code}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm" style={{ color: 'var(--white)' }}>
                    {dc.type === 'percentage' ? 'Percentage' : 'Fixed'}
                  </td>
                  <td className="px-5 py-4 text-sm font-medium" style={{ color: 'var(--white)' }}>
                    {formatDiscountValue(dc)}
                  </td>
                  <td className="px-5 py-4 text-sm" style={{ color: 'var(--muted)' }}>
                    {dc.minOrderPesewas ? formatPesewas(dc.minOrderPesewas) : '—'}
                  </td>
                  <td className="px-5 py-4 text-sm" style={{ color: 'var(--muted)' }}>
                    {dc.usedCount}{dc.maxUses ? ` / ${dc.maxUses}` : ''}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      style={{
                        background: dc.isActive ? 'rgba(34,197,94,0.12)' : 'rgba(107,114,128,0.12)',
                        color: dc.isActive ? '#4ade80' : '#9ca3af',
                      }}
                    >
                      {dc.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm" style={{ color: 'var(--muted)' }}>
                    {dc.expiresAt ? formatDate(dc.expiresAt) : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => doToggle(dc.id)}
                        className="rounded p-1.5 transition-colors hover:bg-white/5"
                        title={dc.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {dc.isActive ? (
                          <ToggleRight size={16} style={{ color: '#4ade80' }} />
                        ) : (
                          <ToggleLeft size={16} style={{ color: 'var(--muted)' }} />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this discount code?')) doDelete(dc.id);
                        }}
                        className="rounded p-1.5 text-red-400 transition-colors hover:bg-red-500/10"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
