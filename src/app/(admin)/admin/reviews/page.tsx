'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Trash2 } from 'lucide-react';
import {
  getAdminReviews,
  updateReviewStatus,
  deleteAdminReview,
} from '@/lib/api/admin';
import { StarRating } from '@/components/shop/StarRating';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils/formatters';
import { useToastStore } from '@/stores/toast-store';
import type { Review, ReviewStatus } from '@/types';

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

const statusBadgeStyles: Record<ReviewStatus, { bg: string; color: string }> = {
  PENDING: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
  APPROVED: { bg: 'rgba(34,197,94,0.12)', color: '#4ade80' },
  REJECTED: { bg: 'rgba(239,68,68,0.12)', color: '#f87171' },
};

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', statusFilter, page],
    queryFn: () =>
      getAdminReviews({
        page,
        limit: 20,
        status: statusFilter || undefined,
      }),
  });

  const reviews = (data?.data ?? []) as Review[];

  const { mutate: doUpdateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateReviewStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      addToast({ type: 'success', message: 'Review status updated' });
    },
    onError: () => addToast({ type: 'error', message: 'Failed to update status' }),
  });

  const { mutate: doDelete } = useMutation({
    mutationFn: deleteAdminReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      addToast({ type: 'success', message: 'Review deleted' });
    },
    onError: () => addToast({ type: 'error', message: 'Failed to delete review' }),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="font-[family-name:var(--font-outfit)] text-2xl font-bold"
          style={{ color: 'var(--white)' }}
        >
          Reviews
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
          Manage customer product reviews
        </p>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setStatusFilter(f.value);
              setPage(1);
            }}
            className="rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all"
            style={{
              borderColor: statusFilter === f.value ? 'var(--gold)' : 'var(--border)',
              color: statusFilter === f.value ? 'var(--gold)' : 'var(--muted)',
              background:
                statusFilter === f.value ? 'rgba(245,158,11,0.08)' : 'transparent',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto rounded-xl border"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <table className="w-full text-left">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Customer', 'Product', 'Rating', 'Title', 'Status', 'Date', 'Actions'].map(
                (h) => (
                  <th key={h} className="px-5 py-3">
                    <span
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--muted)' }}
                    >
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
                <td
                  colSpan={7}
                  className="py-12 text-center text-sm"
                  style={{ color: 'var(--muted)' }}
                >
                  Loading...
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-sm"
                  style={{ color: 'var(--muted)' }}
                >
                  No reviews found
                </td>
              </tr>
            ) : (
              reviews.map((review) => {
                const badge = statusBadgeStyles[review.status];
                return (
                  <tr
                    key={review.id}
                    className="transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium" style={{ color: 'var(--white)' }}>
                        {review.customer.firstName} {review.customer.lastName}
                      </span>
                    </td>
                    <td className="max-w-[120px] truncate px-5 py-4 text-sm" style={{ color: 'var(--muted)' }}>
                      {review.productId.slice(0, 8)}...
                    </td>
                    <td className="px-5 py-4">
                      <StarRating rating={review.rating} size={14} />
                    </td>
                    <td className="max-w-[200px] truncate px-5 py-4 text-sm" style={{ color: 'var(--white)' }}>
                      {review.title ?? '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        style={{ background: badge.bg, color: badge.color }}
                      >
                        {review.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: 'var(--muted)' }}>
                      {formatDate(review.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        {review.status !== 'APPROVED' && (
                          <button
                            onClick={() =>
                              doUpdateStatus({ id: review.id, status: 'APPROVED' })
                            }
                            className="rounded p-1.5 transition-colors hover:bg-green-500/10"
                            title="Approve"
                          >
                            <Check size={15} className="text-green-400" />
                          </button>
                        )}
                        {review.status !== 'REJECTED' && (
                          <button
                            onClick={() =>
                              doUpdateStatus({ id: review.id, status: 'REJECTED' })
                            }
                            className="rounded p-1.5 transition-colors hover:bg-orange-500/10"
                            title="Reject"
                          >
                            <X size={15} className="text-orange-400" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Delete this review permanently?')) {
                              doDelete(review.id);
                            }
                          }}
                          className="rounded p-1.5 text-red-400 transition-colors hover:bg-red-500/10"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {reviews.length > 0 && (
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            Page {page}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={reviews.length < 20}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
