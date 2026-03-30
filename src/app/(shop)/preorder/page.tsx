'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/use-products';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ProductFilters } from '@/components/shop/ProductFilters';
import { PreorderHero } from '@/components/shop/PreorderHero';
import { PreorderSteps } from '@/components/shop/PreorderSteps';
import { Shield, MessageCircle, RefreshCw } from 'lucide-react';
import type { Product } from '@/types';

const FAQ_ITEMS = [
  {
    icon: Shield,
    question: 'Is my deposit refundable?',
    answer: 'Yes, 100%. If we can\'t fulfill your pre-order for any reason, your full deposit is refunded to your MoMo within 24 hours.',
  },
  {
    icon: MessageCircle,
    question: 'How do I know when my gear arrives?',
    answer: 'You\'ll get WhatsApp updates at every stage — when it ships from the supplier, clears customs, and is out for delivery.',
  },
  {
    icon: RefreshCw,
    question: 'Can I change or cancel my pre-order?',
    answer: 'Yes, you can modify or cancel anytime before the item ships. Your deposit is fully refundable.',
  },
];

export default function PreorderPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategory, setSubcategory] = useState<string | null>(null);

  const { data, isLoading } = useProducts({
    search: search || undefined,
    category: categories.length > 0 ? categories.join(',') : undefined,
    subcategory: subcategory ?? undefined,
    isPreorder: true,
    page,
    limit: 20,
  });

  const products = (data?.data ?? []) as Product[];
  const meta = data?.meta;

  return (
    <div className="animate-[fadeUp_400ms_ease-out]">
      <PreorderHero />
      <PreorderSteps />

      {/* Pre-Order Products */}
      <section className="mt-12" id="preorder-products">
        <div className="mb-6 flex items-center justify-between">
          <h2
            className="font-[family-name:var(--font-outfit)] text-xl font-bold sm:text-2xl"
            style={{ color: 'var(--white)' }}
          >
            Available for Pre-Order
          </h2>
          <span
            className="font-[family-name:var(--font-space-mono)] text-xs"
            style={{ color: 'var(--muted)' }}
          >
            {meta?.total ?? 0} items
          </span>
        </div>

        <div className="mb-6">
          <ProductFilters
            search={search}
            onSearchChange={(val) => { setSearch(val); setPage(1); }}
            selectedCategories={categories}
            onCategoriesChange={(cats) => { setCategories(cats); setSubcategory(null); setPage(1); }}
            selectedSubcategory={subcategory}
            onSubcategoryChange={(sub) => { setSubcategory(sub); setPage(1); }}
          />
        </div>

        <ProductGrid products={products} isLoading={isLoading} />

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:opacity-40"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              Previous
            </button>
            <span
              className="min-w-[4rem] text-center font-[family-name:var(--font-space-mono)] text-sm"
              style={{ color: 'var(--muted)' }}
            >
              {page} / {meta.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:opacity-40"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* FAQ / Trust */}
      <section className="mt-16 mb-8">
        <h2
          className="mb-6 text-center font-[family-name:var(--font-outfit)] text-xl font-bold sm:text-2xl"
          style={{ color: 'var(--white)' }}
        >
          Pre-Order FAQ
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FAQ_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.question}
                className="rounded-xl border p-5"
                style={{
                  background: 'var(--card)',
                  borderColor: 'var(--border)',
                }}
              >
                <div className="mb-3 flex items-center gap-2">
                  <Icon size={16} style={{ color: 'var(--teal)' }} />
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: 'var(--white)' }}
                  >
                    {item.question}
                  </h3>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  {item.answer}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
