'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search, Package, Eye, Globe, GlobeLock, Star, Zap, X } from 'lucide-react';
import { SortableHeader, type SortState } from '@/components/admin/SortableHeader';
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  toggleAdminProductPublish,
  toggleAdminProductFeatured,
  toggleAdminProductFlashDeal,
} from '@/lib/api/admin';
import { Button } from '@/components/ui/Button';
import { ProductFormModal } from '@/components/admin/ProductFormModal';
import { formatPesewas } from '@/lib/utils/formatters';
import { CATEGORIES } from '@/lib/utils/constants';
import { useToastStore } from '@/stores/toast-store';
import type { Product } from '@/types';

type StatusFilter = '' | 'published' | 'draft';
type PreorderFilter = '' | 'preorder' | 'regular';
type SaleFilter = '' | 'sale' | 'regular';

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
  const [preorderFilter, setPreorderFilter] = useState<PreorderFilter>('');
  const [saleFilter, setSaleFilter] = useState<SaleFilter>('');
  const [sort, setSort] = useState<SortState | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // Fetch products
  const isPreorderParam =
    preorderFilter === 'preorder' ? true : preorderFilter === 'regular' ? false : undefined;
  const isOnSaleParam =
    saleFilter === 'sale' ? true : saleFilter === 'regular' ? false : undefined;

  const { data, isLoading } = useQuery({
    queryKey: [
      'admin-products',
      {
        page,
        search,
        category: categoryFilter,
        status: statusFilter,
        preorder: preorderFilter,
        sale: saleFilter,
        sort,
      },
    ],
    queryFn: () =>
      getAdminProducts({
        page,
        limit: 20,
        search: search || undefined,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
        isPreorder: isPreorderParam,
        isOnSale: isOnSaleParam,
        sortBy: sort?.field,
        sortOrder: sort?.order,
      }),
  });

  // Backend may not yet filter on isPreorder / isOnSale, so refine client-side as a safety net.
  const rawProducts = (data?.data ?? []) as Product[];
  const products = rawProducts.filter((p) => {
    if (preorderFilter === 'preorder' && !p.isPreorder) return false;
    if (preorderFilter === 'regular' && p.isPreorder) return false;
    if (saleFilter === 'sale') {
      if (!p.comparePricePesewas || p.comparePricePesewas <= p.pricePesewas) return false;
    }
    if (saleFilter === 'regular') {
      if (p.comparePricePesewas && p.comparePricePesewas > p.pricePesewas) return false;
    }
    return true;
  });
  const meta = data?.meta as { total: number; page: number; limit: number; totalPages: number } | undefined;

  // Auto-open edit modal from query param (e.g. ?edit=product-id)
  const editParam = searchParams.get('edit');
  useEffect(() => {
    if (editParam && rawProducts.length > 0 && !modalOpen) {
      const target = rawProducts.find((p) => p.id === editParam);
      if (target) {
        setEditingProduct(target);
        setModalOpen(true);
        router.replace('/admin/products', { scroll: false });
      }
    }
  }, [editParam, rawProducts, modalOpen, router]);

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

  const { mutate: doToggleFlashDeal } = useMutation({
    mutationFn: toggleAdminProductFlashDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      addToast({ type: 'success', message: 'Flash deal status updated' });
    },
    onError: () => addToast({ type: 'error', message: 'Failed to update flash deal status' }),
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

  const hasActiveFilters = Boolean(
    search || categoryFilter || statusFilter || preorderFilter || saleFilter || sort,
  );

  const resetFilters = () => {
    setSearchInput('');
    setSearch('');
    setCategoryFilter('');
    setStatusFilter('');
    setPreorderFilter('');
    setSaleFilter('');
    setSort(null);
    setPage(1);
  };

  const selectStyle: React.CSSProperties = {
    background: 'var(--card)',
    color: 'var(--white)',
    borderColor: 'var(--border)',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1
          className="font-[family-name:var(--font-outfit)] text-2xl font-bold"
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
      <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div
          className="flex flex-1 items-center gap-2 rounded-lg border px-3 py-2"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <Search size={16} style={{ color: 'var(--muted)' }} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or slug..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
            style={{ color: 'var(--white)' }}
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                setSearch('');
                setPage(1);
              }}
              className="rounded-md p-1 transition-colors hover:bg-white/10"
              aria-label="Clear search"
            >
              <X size={14} style={{ color: 'var(--muted)' }} />
            </button>
          )}
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
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {/* Category filter */}
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
              Category
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border px-3 py-2 text-xs outline-none"
              style={selectStyle}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </label>

          {/* Pre-order filter */}
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
              Pre-order
            </span>
            <select
              value={preorderFilter}
              onChange={(e) => {
                setPreorderFilter(e.target.value as PreorderFilter);
                setPage(1);
              }}
              className="w-full rounded-lg border px-3 py-2 text-xs outline-none"
              style={selectStyle}
            >
              <option value="">All Types</option>
              <option value="preorder">Pre-order only</option>
              <option value="regular">In-stock only</option>
            </select>
          </label>

          {/* Sale filter */}
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
              Sale
            </span>
            <select
              value={saleFilter}
              onChange={(e) => {
                setSaleFilter(e.target.value as SaleFilter);
                setPage(1);
              }}
              className="w-full rounded-lg border px-3 py-2 text-xs outline-none"
              style={selectStyle}
            >
              <option value="">All Prices</option>
              <option value="sale">On sale</option>
              <option value="regular">Regular price</option>
            </select>
          </label>

          {/* Sort control (mirrors sortable headers for mobile) */}
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
              Sort by
            </span>
            <select
              value={sort ? `${sort.field}:${sort.order}` : ''}
              onChange={(e) => {
                const v = e.target.value;
                if (!v) {
                  setSort(null);
                } else {
                  const [field, order] = v.split(':');
                  setSort({ field, order: order as 'asc' | 'desc' });
                }
                setPage(1);
              }}
              className="w-full rounded-lg border px-3 py-2 text-xs outline-none"
              style={selectStyle}
            >
              <option value="">Default</option>
              <option value="name:asc">Name (A–Z)</option>
              <option value="name:desc">Name (Z–A)</option>
              <option value="pricePesewas:asc">Price (low to high)</option>
              <option value="pricePesewas:desc">Price (high to low)</option>
              <option value="stockCount:asc">Stock (low to high)</option>
              <option value="stockCount:desc">Stock (high to low)</option>
              <option value="createdAt:desc">Newest first</option>
              <option value="createdAt:asc">Oldest first</option>
            </select>
          </label>
        </div>

        {/* Status pills + reset */}
        <div className="flex flex-wrap items-center gap-2">
          {statusFilters.map((sf) => (
            <button
              key={sf.value}
              onClick={() => {
                setStatusFilter(sf.value);
                setPage(1);
              }}
              className="whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors"
              style={{
                background: statusFilter === sf.value ? 'var(--gold)' : 'transparent',
                color: statusFilter === sf.value ? 'var(--deep)' : 'var(--muted)',
                borderColor: statusFilter === sf.value ? 'var(--gold)' : 'var(--border)',
              }}
            >
              {sf.label}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto inline-flex items-center gap-1 rounded-full border border-dashed px-3 py-1 text-xs font-medium transition-colors hover:bg-white/5"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              <X size={12} />
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Total count */}
      {meta && (
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {products.length === rawProducts.length ? (
            <>
              {meta.total} {meta.total === 1 ? 'product' : 'products'} total
            </>
          ) : (
            <>
              Showing {products.length} of {meta.total}{' '}
              {meta.total === 1 ? 'product' : 'products'}
            </>
          )}
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
            {hasActiveFilters
              ? 'No products match your filters'
              : 'No products yet. Add your first product.'}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-3 inline-flex items-center gap-1 rounded-full border border-dashed px-3 py-1 text-xs font-medium transition-colors hover:bg-white/5"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              <X size={12} />
              Reset filters
            </button>
          )}
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
                  <SortableHeader label="Name" field="name" currentSort={sort} onSort={(s) => { setSort(s); setPage(1); }} />
                  <SortableHeader label="Category" field="category" currentSort={sort} onSort={(s) => { setSort(s); setPage(1); }} className="hidden md:table-cell" />
                  <SortableHeader label="Price" field="pricePesewas" currentSort={sort} onSort={(s) => { setSort(s); setPage(1); }} />
                  <SortableHeader label="Stock" field="stockCount" currentSort={sort} onSort={(s) => { setSort(s); setPage(1); }} className="hidden sm:table-cell" />
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold sm:table-cell" style={{ color: 'var(--muted)' }}>Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--muted)' }}>Actions</th>
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
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="truncate text-sm font-medium" style={{ color: 'var(--white)' }}>
                              {product.name}
                            </p>
                            {product.isPreorder && (
                              <span
                                className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                                style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}
                              >
                                Pre-order
                              </span>
                            )}
                            {product.comparePricePesewas && product.comparePricePesewas > product.pricePesewas && (
                              <span
                                className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                                style={{ background: 'rgba(0,201,167,0.12)', color: 'var(--teal)' }}
                              >
                                Sale
                              </span>
                            )}
                          </div>
                          <p className="truncate text-xs" style={{ color: 'var(--muted)' }}>
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
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
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span
                        className="text-sm"
                        style={{
                          color: product.stockCount > 0 ? 'var(--teal)' : '#ef4444',
                        }}
                      >
                        {product.stockCount}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
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
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); doToggleFeatured(product.id); }}
                          className="rounded-md p-1.5 transition-colors hover:bg-white/10"
                          title={product.isFeatured ? 'Remove from featured' : 'Add to featured'}
                        >
                          <Star
                            size={14}
                            style={{ color: product.isFeatured ? 'var(--gold)' : 'var(--muted)' }}
                            fill={product.isFeatured ? 'var(--gold)' : 'none'}
                          />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); doToggleFlashDeal(product.id); }}
                          className="rounded-md p-1.5 transition-colors hover:bg-white/10"
                          title={product.isFlashDeal ? 'Remove flash deal' : 'Set as flash deal'}
                        >
                          <Zap
                            size={14}
                            style={{ color: product.isFlashDeal ? '#f59e0b' : 'var(--muted)' }}
                            fill={product.isFlashDeal ? '#f59e0b' : 'none'}
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
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
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
              className="mb-2 font-[family-name:var(--font-outfit)] text-lg font-bold"
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
