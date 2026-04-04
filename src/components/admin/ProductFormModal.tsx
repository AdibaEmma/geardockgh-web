'use client';

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { OptionsEditor } from '@/components/admin/OptionsEditor';
import { CATEGORY_TREE } from '@/lib/utils/constants';
import type { Product, ProductOption } from '@/types';

interface ProductFormData {
  name: string;
  description: string;
  priceGhs: string;
  comparePriceGhs: string;
  costPriceGhs: string;
  stockCount: string;
  category: string;
  subcategory: string;
  isPublished: boolean;
  isPreorder: boolean;
  allowPreorderWhenOOS: boolean;
  preorderSlotTarget: string;
  shippingMethod: string;
  images: string[];
  options: ProductOption[];
}

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    pricePesewas: number;
    comparePricePesewas?: number;
    costPricePesewas?: number;
    stockCount?: number;
    isPreorder?: boolean;
    allowPreorderWhenOOS?: boolean;
    isPublished?: boolean;
    preorderSlotTarget?: number | null;
    shippingMethod?: string | null;
    category?: string;
    subcategory?: string;
    imagesJson?: string;
    optionsJson?: string;
  }) => void;
  product?: Product | null;
  isSubmitting?: boolean;
}

const emptyForm: ProductFormData = {
  name: '',
  description: '',
  priceGhs: '',
  comparePriceGhs: '',
  costPriceGhs: '',
  stockCount: '0',
  category: '',
  subcategory: '',
  isPublished: false,
  isPreorder: false,
  allowPreorderWhenOOS: false,
  preorderSlotTarget: '',
  shippingMethod: '',
  images: [],
  options: [],
};

export function ProductFormModal({ open, onClose, onSubmit, product, isSubmitting }: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  useEffect(() => {
    if (product) {
      let existingImages: string[] = [];
      if (product.imagesJson) {
        try {
          existingImages = JSON.parse(product.imagesJson);
        } catch { /* ignore parse errors */ }
      }
      let existingOptions: ProductOption[] = [];
      if (product.optionsJson) {
        try {
          existingOptions = JSON.parse(product.optionsJson);
        } catch { /* ignore parse errors */ }
      }
      setForm({
        name: product.name,
        description: product.description ?? '',
        priceGhs: (product.pricePesewas / 100).toFixed(2),
        comparePriceGhs: product.comparePricePesewas
          ? (product.comparePricePesewas / 100).toFixed(2)
          : '',
        costPriceGhs: product.costPricePesewas
          ? (product.costPricePesewas / 100).toFixed(2)
          : '',
        stockCount: String(product.stockCount),
        category: product.category ?? '',
        subcategory: product.subcategory ?? '',
        isPublished: product.isPublished,
        isPreorder: product.isPreorder,
        allowPreorderWhenOOS: product.allowPreorderWhenOOS,
        preorderSlotTarget: product.preorderSlotTarget != null ? String(product.preorderSlotTarget) : '',
        shippingMethod: product.shippingMethod ?? '',
        images: existingImages,
        options: existingOptions,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [product, open]);

  const handleChange = useCallback(
    (field: keyof ProductFormData, value: string | boolean) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [],
  );

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.priceGhs || isNaN(Number(form.priceGhs)) || Number(form.priceGhs) <= 0)
      newErrors.priceGhs = 'Valid price is required';
    if (form.comparePriceGhs && isNaN(Number(form.comparePriceGhs)))
      newErrors.comparePriceGhs = 'Must be a valid number';
    if (form.stockCount && isNaN(Number(form.stockCount)))
      newErrors.stockCount = 'Must be a valid number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      pricePesewas: Math.round(Number(form.priceGhs) * 100),
      comparePricePesewas: form.comparePriceGhs
        ? Math.round(Number(form.comparePriceGhs) * 100)
        : undefined,
      costPricePesewas: form.costPriceGhs
        ? Math.round(Number(form.costPriceGhs) * 100)
        : undefined,
      stockCount: form.stockCount ? Number(form.stockCount) : undefined,
      isPreorder: form.isPreorder,
      allowPreorderWhenOOS: form.allowPreorderWhenOOS,
      isPublished: form.isPublished,
      preorderSlotTarget: (form.isPreorder || form.allowPreorderWhenOOS) && form.preorderSlotTarget
        ? Number(form.preorderSlotTarget)
        : null,
      shippingMethod: (form.isPreorder || form.allowPreorderWhenOOS) && form.shippingMethod
        ? form.shippingMethod
        : null,
      category: form.category || undefined,
      subcategory: form.subcategory || undefined,
      imagesJson: form.images.length > 0 ? JSON.stringify(form.images) : undefined,
      optionsJson: form.options.length > 0 ? JSON.stringify(form.options) : undefined,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div
        className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto border-l"
        style={{
          background: 'var(--deep)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2
            className="font-[family-name:var(--font-outfit)] text-lg font-bold"
            style={{ color: 'var(--white)' }}
          >
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
          >
            <X size={18} style={{ color: 'var(--muted)' }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5 p-6">
          <Input
            label="Name *"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Product name"
            error={errors.name}
          />

          {/* Images */}
          <ImageUploader
            images={form.images}
            onChange={(imgs) => setForm((prev) => ({ ...prev, images: imgs }))}
          />

          {/* Description */}
          <div className="w-full">
            <label
              className="mb-1.5 block text-sm font-medium"
              style={{ color: 'var(--white)' }}
            >
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Product description..."
              rows={4}
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
              style={{
                background: 'var(--deep)',
                color: 'var(--white)',
                borderColor: 'var(--border)',
              }}
            />
          </div>

          {/* Price row */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={form.isPreorder ? 'Pre-Order Price (GHS) *' : 'Price (GHS) *'}
              type="number"
              step="0.01"
              min="0"
              value={form.priceGhs}
              onChange={(e) => handleChange('priceGhs', e.target.value)}
              placeholder="0.00"
              error={errors.priceGhs}
            />
            <Input
              label="Compare-at Price (GHS)"
              type="number"
              step="0.01"
              min="0"
              value={form.comparePriceGhs}
              onChange={(e) => handleChange('comparePriceGhs', e.target.value)}
              placeholder="0.00"
              error={errors.comparePriceGhs}
            />
          </div>

          {/* Cost Price */}
          <Input
            label="Cost Price (GHS)"
            type="number"
            step="0.01"
            min="0"
            value={form.costPriceGhs}
            onChange={(e) => handleChange('costPriceGhs', e.target.value)}
            placeholder="0.00 — enables Profit Calculator"
          />

          {/* Stock */}
          <Input
            label="Stock Count"
            type="number"
            min="0"
            value={form.stockCount}
            onChange={(e) => handleChange('stockCount', e.target.value)}
            placeholder="0"
            error={errors.stockCount}
          />

          {/* Category + Subcategory */}
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <label
                className="mb-1.5 block text-sm font-medium"
                style={{ color: 'var(--white)' }}
              >
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => {
                  handleChange('category', e.target.value);
                  setForm((prev) => ({ ...prev, subcategory: '' }));
                }}
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                style={{
                  background: 'var(--deep)',
                  color: 'var(--white)',
                  borderColor: 'var(--border)',
                }}
              >
                <option value="">No category</option>
                {CATEGORY_TREE.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {(() => {
              const selectedCat = CATEGORY_TREE.find(c => c.value === form.category);
              if (!selectedCat?.subcategories?.length) return null;
              return (
                <div className="w-full">
                  <label
                    className="mb-1.5 block text-sm font-medium"
                    style={{ color: 'var(--white)' }}
                  >
                    Subcategory
                  </label>
                  <select
                    value={form.subcategory}
                    onChange={(e) => handleChange('subcategory', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                    style={{
                      background: 'var(--deep)',
                      color: 'var(--white)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    <option value="">All {selectedCat.label}</option>
                    {selectedCat.subcategories.map((sub) => (
                      <option key={sub.value} value={sub.value}>
                        {sub.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })()}
          </div>

          {/* Product Options */}
          <OptionsEditor
            options={form.options}
            onChange={(options) => setForm((prev) => ({ ...prev, options }))}
          />

          {/* Toggles */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => handleChange('isPublished', e.target.checked)}
                className="h-4 w-4 rounded accent-[var(--gold)]"
              />
              <span className="text-sm" style={{ color: 'var(--white)' }}>
                Published
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPreorder}
                onChange={(e) => {
                  handleChange('isPreorder', e.target.checked);
                  if (e.target.checked) handleChange('allowPreorderWhenOOS', false);
                }}
                className="h-4 w-4 rounded accent-[var(--gold)]"
              />
              <span className="text-sm" style={{ color: 'var(--white)' }}>
                Pre-order (dedicated)
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.allowPreorderWhenOOS}
                onChange={(e) => handleChange('allowPreorderWhenOOS', e.target.checked)}
                className="h-4 w-4 rounded accent-[var(--gold)]"
                disabled={form.isPreorder}
              />
              <span
                className="text-sm"
                style={{ color: form.isPreorder ? 'var(--muted)' : 'var(--white)' }}
              >
                Allow pre-order when out of stock
              </span>
            </label>
          </div>

          {/* Slot Target — when pre-order or OOS pre-order is enabled */}
          {(form.isPreorder || form.allowPreorderWhenOOS) && (
            <div
              className="rounded-lg border p-4"
              style={{ borderColor: 'rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.03)' }}
            >
              <p className="mb-3 text-xs leading-relaxed" style={{ color: 'var(--gold)' }}>
                {form.allowPreorderWhenOOS && !form.isPreorder
                  ? 'When this product goes out of stock, customers can pre-order it. Configure deposit and shipping settings below.'
                  : 'Set the price as your product cost + profit margin. Shipping, customs, and clearing fees are excluded and will be communicated to the customer separately when goods arrive.'}
              </p>
              {/* Shipping Method */}
              <div className="mb-3">
                <label
                  className="mb-1.5 block text-sm font-medium"
                  style={{ color: 'var(--white)' }}
                >
                  Shipping Method
                </label>
                <div className="flex gap-2">
                  {[
                    { value: 'AIR', label: 'Air (1–3 weeks)', emoji: '✈️' },
                    { value: 'SEA', label: 'Sea (6–10 weeks)', emoji: '🚢' },
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => handleChange('shippingMethod', form.shippingMethod === method.value ? '' : method.value)}
                      className="flex-1 rounded-lg border px-3 py-2.5 text-xs font-medium transition-all"
                      style={{
                        borderColor: form.shippingMethod === method.value ? 'var(--gold)' : 'var(--border)',
                        color: form.shippingMethod === method.value ? 'var(--gold)' : 'var(--muted)',
                        background: form.shippingMethod === method.value ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                      }}
                    >
                      {method.emoji} {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Slot Target (order alert threshold)"
                type="number"
                min="1"
                value={form.preorderSlotTarget}
                onChange={(e) => handleChange('preorderSlotTarget', e.target.value)}
                placeholder="e.g. 20"
              />
              <p className="mt-1.5 text-xs" style={{ color: 'var(--muted)' }}>
                You'll get an alert when pre-order slots reach this number so you can place an order with your supplier.
              </p>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex gap-3 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={isSubmitting}
            >
              {product ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
