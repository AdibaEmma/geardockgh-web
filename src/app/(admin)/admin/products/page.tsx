'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search, Package, Eye, Globe, GlobeLock, Star } from 'lucide-react';
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  toggleAdminProductPublish,
  toggleAdminProductFeatured,
} from '@/lib/api/admin';
import { Button } from '@/components/ui/Button';
import { ProductFormModal } from '@/components/admin/ProductFormModal';
import { formatPesewas } from '@/lib/utils/formatters';
import { CATEGORIES } from '@/lib/utils/constants';
import { useToastStore } from '@/stores/toast-store';
import type { Product } from '@/types';

type StatusFilter = '' | 'published' | 'draft';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // Fetch products
  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', { page, search, category: categoryFilter, status: statusFilter }],
    queryFn: () =>
      getAdminProducts({
        page,
        limit: 20,
        search: search || undefined,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
      }),
  });

  const products = (data?.data ?? []) as Product[];
  const meta = data?.meta as { total: number; page: number; limit: number; totalPages: number } | undefined;

  // Auto-open edit modal from query param (e.g. ?edit=product-id)
  const editParam = searchParams.get('edit');
  useEffect(() => {
    if (editParam && products.length > 0 && !modalOpen) {
      const target = products.find((p) => p.id === editParam);
      if (target) {
        setEditingProduct(target);
        setModalOpen(true);
        router.replace('/admin/products', { scroll: false });
      }
    }
  }, [editParam, products, modalOpen, router]);

  // Mutations
  const { mutate: doCreate, isPending: isCreating } = useMutation({
    mutationFn: createAdminProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      addToast({ type: 'success', message: 'Product created' });
      closeModal();
    },
    onError: () => addToast({ type: 'error', message: 'Failed to create product' }),
  });

  const { mutate: doUpdate, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateAdminProduct>[1] }) =>
      updateAdminProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      addToast({ type: 'success', message: 'Product updated' });
      closeModal();
    },
    onError: () => addToast({ type: 'error', message: 'Failed to update product' }),
  });

  const { mutate: doDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      addToast({ type: 'success', message: 'Product deleted' });
      setDeleteTarget(null);
    },
    onError: () => addToast({ type: 'error', message: 'Failed to delete product' }),
  });

  const { mutate: doTogglePublish } = useMutation({
    mutationFn: toggleAdminProductPublish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      addToast({ type: 'success', message: 'Product status updated' });
    },
    onError: () => addToast({ type: 'error', message: 'Failed to update product' }),
  });

  const { mutate: doToggleFeatured } = useMutation({
    mutationFn: toggleAdminProductFeatured,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      addToast({ type: 'success', message: 'Featured status updated' });
    },
    onError: () => addToast({ type: 'error', message: 'Failed to update featured status' }),
  });

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (formData: Parameters<typeof createAdminProduct>[0]) => {
    if (editingProduct) {
      doUpdate({ id: editingProduct.id, data: formData });
    } else {
      doCreate(formData);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const statusFilters: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: '' },
    { label: 'Published', value: 'published' },
    { label: 'Draft', value: 'draft' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1
          className="font-[family-name:var(--font-syne)] text-2xl font-bold"
          style={{ color: 'var(--white)' }}
        >
          Products
        </h1>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setEditingProduct(null);
            setModalOpen(true);
          }}
        >
          <Plus size={16} className="mr-1.5" />
          Add Product
        </Button>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-3">
        <div
          className="flex flex-1 items-center gap-2 rounded-lg border px-3 py-2"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <Search size={16} style={{ color: 'var(--muted)' }} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products by name..."
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

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border px-3 py-1.5 text-xs outline-none"
          style={{
            background: 'var(--card)',
            color: 'var(--white)',
            borderColor: 'var(--border)',
          }}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        {/* Status pills */}
        <div className="flex gap-2">
          {statusFilters.map((sf) => (
            <button
              key={sf.value}
              onClick={() => {
                setStatusFilter(sf.value);
                setPage(1);
              }}
              className="whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium"
              style={{
                background: statusFilter === sf.value ? 'var(--gold)' : 'transparent',
                color: statusFilter === sf.value ? 'var(--deep)' : 'var(--muted)',
                borderColor: statusFilter === sf.value ? 'var(--gold)' : 'var(--border)',
              }}
            >
              {sf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Total count */}
      {meta && (
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {meta.total} {meta.total === 1 ? 'product' : 'products'} total
        </p>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <span
            className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"
            style={{ color: 'var(--gold)' }}
          />
        </div>
      ) : products.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-xl border py-20"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <Package size={40} style={{ color: 'var(--border)' }} />
          <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>
            {search || categoryFilter || statusFilter
              ? 'No products match your filters'
              : 'No products yet. Add your first product.'}
          </p>
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
                  {['Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold"
                      style={{ color: 'var(--muted)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t transition-colors hover:bg-white/[0.02]"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {(() => {
                          let thumb: string | null = null;
                          if (product.imagesJson) {
                            try {
                              const imgs = JSON.parse(product.imagesJson);
                              if (Array.isArray(imgs) && imgs.length > 0) thumb = imgs[0];
                            } catch { /* ignore */ }
                          }
                          return thumb ? (
                            <img
                              src={thumb}
                              alt={product.name}
                              className="h-10 w-10 shrink-0 rounded-lg object-cover"
                              style={{ border: '1px solid var(--border)' }}
                            />
                          ) : (
                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                              style={{ background: 'var(--card)' }}
                            >
                              <Package size={16} style={{ color: 'var(--border)' }} />
                            </div>
                          );
                        })()}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium" style={{ color: 'var(--white)' }}>
                            {product.name}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--muted)' }}>
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2 py-0.5 text-xs"
                        style={{
                          background: 'var(--card)',
                          color: 'var(--muted)',
                        }}
                      >
                        {product.category
                          ? CATEGORIES.find((c) => c.value === product.category)?.label ??
                            product.category
                          : '--'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: 'var(--gold)' }}
                      >
                        {formatPesewas(product.pricePesewas)}
                      </span>
                      {product.comparePricePesewas ? (
                        <span
                          className="ml-2 text-xs line-through"
                          style={{ color: 'var(--muted)' }}
                        >
                          {formatPesewas(product.comparePricePesewas)}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-sm"
                        style={{
                          color: product.stockCount > 0 ? 'var(--teal)' : '#ef4444',
                        }}
                      >
                        {product.stockCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => doTogglePublish(product.id)}
                        className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium transition-opacity hover:opacity-80"
                        style={{
                          background: product.isPublished
                            ? 'rgba(0,201,167,0.1)'
                            : 'rgba(239,68,68,0.1)',
                          color: product.isPublished ? 'var(--teal)' : '#ef4444',
                        }}
                        title={product.isPublished ? 'Click to unpublish' : 'Click to publish'}
                      >
                        {product.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); doToggleFeatured(product.id); }}
                          className="rounded-md p-1.5 transition-colors hover:bg-white/10"
                          title={product.isFeatured ? 'Remove from featured' : 'Add to featured'}
                        >
                          <Star
                            size={14}
                            style={{ color: product.isFeatured ? '#F59E0B' : 'var(--muted)' }}
                            fill={product.isFeatured ? '#F59E0B' : 'none'}
                          />
                        </button>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="rounded-md p-1.5 transition-colors hover:bg-white/10"
                          title="View"
                        >
                          <Eye size={14} style={{ color: 'var(--gold)' }} />
                        </Link>
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setModalOpen(true);
                          }}
                          className="rounded-md p-1.5 transition-colors hover:bg-white/10"
                          title="Edit"
                        >
                          <Pencil size={14} style={{ color: 'var(--muted)' }} />
                        </button>
                        <button
                          onClick={() => doTogglePublish(product.id)}
                          className="rounded-md p-1.5 transition-colors hover:bg-white/10"
                          title={product.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          {product.isPublished ? (
                            <GlobeLock size={14} style={{ color: '#ef4444' }} />
                          ) : (
                            <Globe size={14} style={{ color: 'var(--teal)' }} />
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="rounded-md p-1.5 transition-colors hover:bg-red-500/10"
                          title="Delete"
                        >
                          <Trash2 size={14} style={{ color: '#ef4444' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Page {meta.page} of {meta.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40"
              style={{ borderColor: 'var(--border)', color: 'var(--white)' }}
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= meta.totalPages}
              className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40"
              style={{ borderColor: 'var(--border)', color: 'var(--white)' }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Product form modal */}
      <ProductFormModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        product={editingProduct}
        isSubmitting={isCreating || isUpdating}
      />

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteTarget(null)} />
          <div
            className="relative w-full max-w-sm rounded-xl border p-6"
            style={{
              background: 'var(--deep)',
              borderColor: 'var(--border)',
            }}
          >
            <h3
              className="mb-2 font-[family-name:var(--font-syne)] text-lg font-bold"
              style={{ color: 'var(--white)' }}
            >
              Delete Product
            </h3>
            <p className="mb-6 text-sm" style={{ color: 'var(--muted)' }}>
              Are you sure you want to delete <strong style={{ color: 'var(--white)' }}>{deleteTarget.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>
              <button
                onClick={() => doDelete(deleteTarget.id)}
                disabled={isDeleting}
                className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
                style={{ background: '#ef4444', color: '#fff' }}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
