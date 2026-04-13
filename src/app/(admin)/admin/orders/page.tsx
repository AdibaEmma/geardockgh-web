'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ChevronRight, Search, Plus, X, Trash2 } from 'lucide-react';
import { SortableHeader, type SortState } from '@/components/admin/SortableHeader';
import {
  getAdminOrders,
  getAdminProducts,
  updateOrderStatus,
  bulkUpdateOrderStatus,
  createAdminOrder,
  type CreateAdminOrderPayload,
} from '@/lib/api/admin';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { Button } from '@/components/ui/Button';
import { formatPesewas, formatDate } from '@/lib/utils/formatters';
import { useToastStore } from '@/stores/toast-store';
import type { Order, OrderStatus, Product, ProductOption, ProductOptionValue } from '@/types';

const allStatuses: OrderStatus[] = [
  'PENDING_PAYMENT',
  'PAYMENT_CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
];

const nextStatusMap: Record<string, OrderStatus> = {
  PENDING_PAYMENT: 'PAYMENT_CONFIRMED',
  PAYMENT_CONFIRMED: 'PROCESSING',
  PROCESSING: 'SHIPPED',
  SHIPPED: 'DELIVERED',
};

// ── Manual Order Form ──
interface SelectedOptionEntry {
  name: string;
  value: string;
  priceDelta: number;
}

interface OrderItemRow {
  productId: string;
  quantity: number;
  unitPricePesewas: number;
  options: ProductOption[];
  selectedOptions: SelectedOptionEntry[];
}

function ManualOrderForm({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const addToast = useToastStore((s) => s.addToast);
  const [products, setProducts] = useState<Product[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MOMO' | 'BANK_TRANSFER'>('CASH');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('PAYMENT_CONFIRMED');
  const [discountType, setDiscountType] = useState<'none' | 'fixed' | 'percentage'>('none');
  const [discountValue, setDiscountValue] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<OrderItemRow[]>([
    { productId: '', quantity: 1, unitPricePesewas: 0, options: [], selectedOptions: [] },
  ]);

  useEffect(() => {
    if (open) {
      getAdminProducts({ limit: 100 })
        .then((res) => {
          const data = res.data as any;
          setProducts(Array.isArray(data) ? data : data?.data ?? []);
        })
        .catch(() => {});
    }
  }, [open]);

  const parseOptions = (product: Product): ProductOption[] => {
    if (!product.optionsJson) return [];
    try {
      return JSON.parse(product.optionsJson) as ProductOption[];
    } catch {
      return [];
    }
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    const options = product ? parseOptions(product) : [];
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              productId,
              unitPricePesewas: product?.pricePesewas ?? 0,
              options,
              selectedOptions: [],
            }
          : item,
      ),
    );
  };

  const handleOptionSelect = (itemIndex: number, optionName: string, val: ProductOptionValue) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== itemIndex) return item;
        const updated = item.selectedOptions.filter((s) => s.name !== optionName);
        updated.push({ name: optionName, value: val.label, priceDelta: val.priceDelta ?? 0 });
        return { ...item, selectedOptions: updated };
      }),
    );
  };

  const getItemTotal = (item: OrderItemRow) => {
    const optionsDelta = item.selectedOptions.reduce((sum, o) => sum + o.priceDelta, 0);
    return (item.unitPricePesewas + optionsDelta) * item.quantity;
  };

  const addItem = () => {
    setItems((prev) => [...prev, { productId: '', quantity: 1, unitPricePesewas: 0, options: [], selectedOptions: [] }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + getItemTotal(item), 0);

  const computedDiscountPesewas = (() => {
    if (discountType === 'none' || !discountValue) return 0;
    const val = Number(discountValue);
    if (discountType === 'fixed') return Math.round(val * 100);
    if (discountType === 'percentage') return Math.round((subtotal * val) / 100);
    return 0;
  })();
  const finalTotal = Math.max(0, subtotal - computedDiscountPesewas);

  const resetForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setPaymentMethod('CASH');
    setOrderStatus('PAYMENT_CONFIRMED');
    setDiscountType('none');
    setDiscountValue('');
    setOrderDate('');
    setNotes('');
    setItems([{ productId: '', quantity: 1, unitPricePesewas: 0, options: [], selectedOptions: [] }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      addToast({ type: 'error', message: 'Customer name is required' });
      return;
    }

    const validItems = items.filter((i) => i.productId);
    if (validItems.length === 0) {
      addToast({ type: 'error', message: 'Add at least one product' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateAdminOrderPayload = {
        items: validItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          selectedOptions: i.selectedOptions.length > 0
            ? JSON.stringify(i.selectedOptions.map((s) => ({ name: s.name, value: s.value, priceDelta: s.priceDelta })))
            : undefined,
        })),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || undefined,
        customerEmail: customerEmail.trim() || undefined,
        paymentMethod,
        status: orderStatus,
        discountPesewas: computedDiscountPesewas > 0 ? computedDiscountPesewas : undefined,
        orderDate: orderDate ? new Date(orderDate).toISOString() : undefined,
        notes: notes.trim() || undefined,
      };

      await createAdminOrder(payload);
      addToast({ type: 'success', message: 'Manual order created' });
      resetForm();
      onClose();
      onCreated();
    } catch {
      addToast({ type: 'error', message: 'Failed to create order' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative z-10 flex h-full w-full max-w-lg flex-col border-l"
        style={{ background: 'var(--deep)', borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2 className="text-lg font-bold" style={{ color: 'var(--white)' }}>
            Create Manual Order
          </h2>
          <button onClick={onClose} className="rounded p-1 transition-colors hover:bg-white/5">
            <X size={18} style={{ color: 'var(--muted)' }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Customer */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Customer
            </h3>
            <div className="grid gap-3">
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer name *"
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--gold)]"
                style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--white)' }}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Phone (optional)"
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--gold)]"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--white)' }}
                />
                <input
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Email (optional)"
                  type="email"
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--gold)]"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--white)' }}
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                Products
              </h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-xs font-medium transition-colors hover:underline"
                style={{ color: 'var(--gold)' }}
              >
                <Plus size={12} /> Add Item
              </button>
            </div>
            <div className="space-y-3">
              {items.map((item, index) => {
                const product = products.find((p) => p.id === item.productId);
                return (
                  <div
                    key={index}
                    className="flex items-start gap-2 rounded-lg border p-3"
                    style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
                  >
                    <div className="flex-1 grid gap-2">
                      <select
                        value={item.productId}
                        onChange={(e) => handleProductChange(index, e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                        style={{ background: 'var(--deep)', borderColor: 'var(--border)', color: 'var(--white)' }}
                      >
                        <option value="">Select product...</option>
                        {products
                          .filter((p) => p.isPublished)
                          .map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} — {formatPesewas(p.pricePesewas)} (Stock: {p.stockCount})
                            </option>
                          ))}
                      </select>

                      {/* Option Groups */}
                      {item.options.length > 0 && (
                        <div className="space-y-2">
                          {item.options.map((option) => {
                            const selected = item.selectedOptions.find((s) => s.name === option.name);
                            return (
                              <div key={option.name}>
                                <label className="mb-1 block text-[10px] font-medium" style={{ color: 'var(--muted)' }}>
                                  {option.name}
                                  {selected && (
                                    <span style={{ color: 'var(--gold)' }}> — {selected.value}</span>
                                  )}
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                  {option.type === 'color' ? (
                                    option.values.map((val) => (
                                      <button
                                        key={val.label}
                                        type="button"
                                        onClick={() => handleOptionSelect(index, option.name, val)}
                                        className="h-7 w-7 rounded-full transition-all"
                                        style={{
                                          background: val.hex ?? '#888',
                                          boxShadow: selected?.value === val.label
                                            ? '0 0 0 2px var(--deep), 0 0 0 4px var(--gold)'
                                            : '0 0 0 1px var(--border)',
                                        }}
                                        title={val.priceDelta ? `${val.label} (+${formatPesewas(val.priceDelta)})` : val.label}
                                      />
                                    ))
                                  ) : (
                                    option.values.map((val) => (
                                      <button
                                        key={val.label}
                                        type="button"
                                        onClick={() => handleOptionSelect(index, option.name, val)}
                                        className="rounded-md border px-2.5 py-1 text-xs transition-all"
                                        style={{
                                          borderColor: selected?.value === val.label ? 'var(--gold)' : 'var(--border)',
                                          color: selected?.value === val.label ? 'var(--gold)' : 'var(--white)',
                                          background: selected?.value === val.label ? 'rgba(245,158,11,0.08)' : 'transparent',
                                        }}
                                      >
                                        {val.label}
                                        {val.priceDelta ? (
                                          <span className="ml-1 text-[10px]" style={{ color: 'var(--muted)' }}>
                                            +{formatPesewas(val.priceDelta)}
                                          </span>
                                        ) : null}
                                      </button>
                                    ))
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <label className="mb-1 block text-[10px]" style={{ color: 'var(--muted)' }}>
                            Qty
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={product?.stockCount ?? 999}
                            value={item.quantity}
                            onChange={(e) =>
                              setItems((prev) =>
                                prev.map((it, i) =>
                                  i === index ? { ...it, quantity: Math.max(1, Number(e.target.value)) } : it,
                                ),
                              )
                            }
                            className="w-full rounded-lg border px-3 py-1.5 text-sm outline-none"
                            style={{ background: 'var(--deep)', borderColor: 'var(--border)', color: 'var(--white)' }}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="mb-1 block text-[10px]" style={{ color: 'var(--muted)' }}>
                            Unit Price
                          </label>
                          <p className="px-1 py-1.5 text-sm font-medium" style={{ color: 'var(--gold)' }}>
                            {item.unitPricePesewas > 0
                              ? formatPesewas(
                                  item.unitPricePesewas +
                                  item.selectedOptions.reduce((s, o) => s + o.priceDelta, 0),
                                )
                              : '—'}
                          </p>
                        </div>
                        <div className="flex-1">
                          <label className="mb-1 block text-[10px]" style={{ color: 'var(--muted)' }}>
                            Subtotal
                          </label>
                          <p className="px-1 py-1.5 text-sm font-medium" style={{ color: 'var(--white)' }}>
                            {item.unitPricePesewas > 0 ? formatPesewas(getItemTotal(item)) : '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="mt-2 rounded p-1 text-red-400 transition-colors hover:bg-red-500/10"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Payment Method
            </h3>
            <div className="flex gap-2">
              {(['CASH', 'MOMO', 'BANK_TRANSFER'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className="flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                  style={{
                    borderColor: paymentMethod === method ? 'var(--gold)' : 'var(--border)',
                    color: paymentMethod === method ? 'var(--gold)' : 'var(--white)',
                    background: paymentMethod === method ? 'rgba(245, 158, 11, 0.08)' : 'var(--card)',
                  }}
                >
                  {method === 'BANK_TRANSFER' ? 'Bank' : method === 'MOMO' ? 'MoMo' : 'Cash'}
                </button>
              ))}
            </div>
          </div>

          {/* Order Status */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Order Status
            </h3>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--gold)]"
              style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--white)' }}
            >
              <option value="PENDING_PAYMENT">Pending Payment</option>
              <option value="PAYMENT_CONFIRMED">Payment Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>

          {/* Order Date */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Order Date
            </h3>
            <input
              type="datetime-local"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--gold)]"
              style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--white)' }}
            />
            <p className="mt-1 text-[10px]" style={{ color: 'var(--muted)' }}>
              Leave empty to use current date/time
            </p>
          </div>

          {/* Discount */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Discount
            </h3>
            <div className="flex gap-2 mb-3">
              {([['none', 'None'], ['fixed', 'Fixed (GHS)'], ['percentage', '% Off']] as const).map(
                ([t, label]) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setDiscountType(t); setDiscountValue(''); }}
                    className="flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                    style={{
                      borderColor: discountType === t ? 'var(--gold)' : 'var(--border)',
                      color: discountType === t ? 'var(--gold)' : 'var(--white)',
                      background: discountType === t ? 'rgba(245,158,11,0.08)' : 'var(--card)',
                    }}
                  >
                    {label}
                  </button>
                ),
              )}
            </div>
            {discountType !== 'none' && (
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step={discountType === 'percentage' ? '1' : '0.01'}
                  min="0"
                  max={discountType === 'percentage' ? '100' : undefined}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === 'percentage' ? 'e.g. 10' : 'e.g. 20.00'}
                  className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-[var(--gold)]"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--white)' }}
                />
                {computedDiscountPesewas > 0 && (
                  <span className="text-sm font-medium" style={{ color: '#ef4444' }}>
                    -{formatPesewas(computedDiscountPesewas)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes about this sale..."
              rows={2}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors resize-none focus:border-[var(--gold)]"
              style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--white)' }}
            />
          </div>

          {/* Totals */}
          <div
            className="rounded-lg border p-4 space-y-2"
            style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--muted)' }}>Subtotal</span>
              <span className="text-sm" style={{ color: 'var(--white)' }}>
                {formatPesewas(subtotal)}
              </span>
            </div>
            {computedDiscountPesewas > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#ef4444' }}>Discount</span>
                <span className="text-sm" style={{ color: '#ef4444' }}>
                  -{formatPesewas(computedDiscountPesewas)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between border-t pt-2" style={{ borderColor: 'var(--border)' }}>
              <span className="text-sm font-medium" style={{ color: 'var(--white)' }}>Total</span>
              <span className="text-lg font-bold" style={{ color: 'var(--gold)' }}>
                {formatPesewas(finalTotal)}
              </span>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 border-t px-6 py-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <Button variant="ghost" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} size="sm">
            {isSubmitting ? 'Creating...' : 'Create Order'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>('PROCESSING');
  const [sort, setSort] = useState<SortState | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
    setSelectedIds(new Set());
  };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', { page, status: statusFilter, search, sort }],
    queryFn: () =>
      getAdminOrders({
        page,
        limit: 20,
        status: statusFilter || undefined,
        search: search || undefined,
        sortBy: sort?.field,
        sortOrder: sort?.order,
      }),
  });

  const { mutate: changeStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateOrderStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      addToast({ type: 'success', message: 'Order status updated' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to update status' });
    },
  });

  const { mutate: bulkChange, isPending: isBulkUpdating } = useMutation({
    mutationFn: (payload: { orderIds: string[]; status: string }) =>
      bulkUpdateOrderStatus(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      const count = (res?.data as any)?.updatedCount ?? 0;
      addToast({ type: 'success', message: `${count} order${count !== 1 ? 's' : ''} updated` });
      setSelectedIds(new Set());
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to update orders' });
    },
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const orders = (data?.data ?? []) as (Order & {
    customer?: { firstName: string; lastName: string; email: string };
  })[];
  const meta = data?.meta;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1
          className="font-[family-name:var(--font-outfit)] text-2xl font-bold"
          style={{ color: 'var(--white)' }}
        >
          Orders
        </h1>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus size={14} className="mr-1.5" />
          Create Order
        </Button>
      </div>

      <ManualOrderForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => queryClient.invalidateQueries({ queryKey: ['admin-orders'] })}
      />

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4 flex items-center gap-3">
        <div
          className="flex flex-1 items-center gap-2 rounded-lg border px-3 py-2"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <Search size={16} style={{ color: 'var(--muted)' }} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by order number or customer name..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
            style={{ color: 'var(--white)' }}
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          style={{ background: 'var(--gold)', color: 'var(--black)' }}
        >
          Search
        </button>
      </form>

      {/* Filter */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => {
            setStatusFilter('');
            setPage(1);
            setSelectedIds(new Set());
            setBulkStatus('PROCESSING');
          }}
          className="whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium"
          style={{
            background: !statusFilter ? 'var(--gold)' : 'transparent',
            color: !statusFilter ? 'var(--deep)' : 'var(--muted)',
            borderColor: !statusFilter ? 'var(--gold)' : 'var(--border)',
          }}
        >
          All
        </button>
        {allStatuses.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
              setSelectedIds(new Set());
              setBulkStatus(nextStatusMap[s] ?? 'PROCESSING');
            }}
            className="whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium"
            style={{
              background: statusFilter === s ? 'var(--gold)' : 'transparent',
              color: statusFilter === s ? 'var(--deep)' : 'var(--muted)',
              borderColor: statusFilter === s ? 'var(--gold)' : 'var(--border)',
            }}
          >
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {selectedIds.size > 0 && (
        <div
          className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border px-4 py-3 sm:gap-3"
          style={{ background: 'var(--card)', borderColor: 'var(--gold)' }}
        >
          <span className="text-sm font-medium" style={{ color: 'var(--white)' }}>
            {selectedIds.size} order{selectedIds.size > 1 ? 's' : ''} selected
          </span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value as OrderStatus)}
            className="rounded border px-2 py-1 text-xs"
            style={{ background: 'var(--deep)', color: 'var(--white)', borderColor: 'var(--border)' }}
          >
            {allStatuses.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          <button
            onClick={() => bulkChange({ orderIds: Array.from(selectedIds), status: bulkStatus })}
            disabled={isBulkUpdating}
            className="rounded-lg px-4 py-1.5 text-sm font-medium transition-colors"
            style={{ background: 'var(--gold)', color: 'var(--black)' }}
          >
            {isBulkUpdating ? 'Updating...' : 'Update'}
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-xs"
            style={{ color: 'var(--muted)' }}
          >
            Clear
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <span
            className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"
            style={{ color: 'var(--gold)' }}
          />
        </div>
      ) : (
        <div
          className="overflow-hidden rounded-xl border"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--card)' }}>
                  <th className="hidden w-10 px-4 py-3 sm:table-cell">
                    <input
                      type="checkbox"
                      checked={orders.length > 0 && selectedIds.size === orders.length}
                      onChange={() => {
                        if (selectedIds.size === orders.length) {
                          setSelectedIds(new Set());
                        } else {
                          setSelectedIds(new Set(orders.map((o) => o.id)));
                        }
                      }}
                      className="accent-[var(--gold)]"
                    />
                  </th>
                  <SortableHeader label="Order" field="orderNumber" currentSort={sort} onSort={(s) => { setSort(s); setPage(1); }} />
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold md:table-cell" style={{ color: 'var(--muted)' }}>Customer</th>
                  <SortableHeader label="Status" field="status" currentSort={sort} onSort={(s) => { setSort(s); setPage(1); }} />
                  <SortableHeader label="Total" field="totalPesewas" currentSort={sort} onSort={(s) => { setSort(s); setPage(1); }} />
                  <SortableHeader label="Date" field="createdAt" currentSort={sort} onSort={(s) => { setSort(s); setPage(1); }} className="hidden lg:table-cell" />
                  <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        className="accent-[var(--gold)]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="font-[family-name:var(--font-space-mono)] text-sm font-bold"
                        style={{ color: 'var(--white)' }}
                      >
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <p className="text-sm" style={{ color: 'var(--white)' }}>
                        {order.customer
                          ? `${order.customer.firstName} ${order.customer.lastName}`
                          : '--'}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>
                        {order.customer?.email}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          changeStatus({
                            id: order.id,
                            status: e.target.value,
                          })
                        }
                        className="rounded border px-2 py-1 text-xs"
                        style={{
                          background: 'var(--deep)',
                          color: 'var(--white)',
                          borderColor: 'var(--border)',
                        }}
                      >
                        {allStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: 'var(--gold)' }}
                      >
                        {formatPesewas(order.totalPesewas)}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs font-medium transition-colors hover:text-[var(--gold)]"
                        style={{ color: 'var(--muted)' }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => { setPage((p) => p - 1); setSelectedIds(new Set()); }}
          >
            Previous
          </Button>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            Page {page} of {meta.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= meta.totalPages}
            onClick={() => { setPage((p) => p + 1); setSelectedIds(new Set()); }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
