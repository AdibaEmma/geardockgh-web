'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StarRating } from '@/components/shop/StarRating';
import { ReviewCard } from '@/components/shop/ReviewCard';
import { ReviewForm } from '@/components/shop/ReviewForm';
import { useProductReviews, useRatingSummary, useCanReview } from '@/hooks/use-reviews';
import { useAuthStore } from '@/stores/auth-store';
import type { Review, RatingSummary } from '@/types';

interface ReviewSectionProps {
  productId: string;
}

function RatingSummaryDisplay({ summary }: { summary: RatingSummary }) {
  const maxCount = Math.max(...Object.values(summary.distribution), 1);

  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p
            className="font-[family-name:var(--font-outfit)] text-4xl font-bold"
            style={{ color: 'var(--white)' }}
          >
            {summary.averageRating.toFixed(1)}
          </p>
          <StarRating rating={Math.round(summary.averageRating)} size={16} />
          <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
            {summary.totalReviews} review{summary.totalReviews !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.distribution[star] ?? 0;
            const width = maxCount > 0 ? (count / maxCount) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-3 text-right text-xs font-medium" style={{ color: 'var(--muted)' }}>
                  {star}
                </span>
                <div
                  className="h-2 flex-1 overflow-hidden rounded-full"
                  style={{ background: 'var(--border)' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${width}%`, background: 'var(--gold)' }}
                  />
                </div>
                <span className="w-5 text-right text-xs" style={{ color: 'var(--muted)' }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const [page, setPage] = useState(1);
  const [formVisible, setFormVisible] = useState(false);

  const user = useAuthStore((s) => s.user);
  const { data: summaryData } = useRatingSummary(productId);
  const { data: reviewsData, isLoading: reviewsLoading } = useProductReviews(productId, page);
  const { data: canReviewData } = useCanReview(productId);

  const summary = summaryData?.data as RatingSummary | undefined;
  const reviews = (reviewsData?.data ?? []) as Review[];
  const canReview = canReviewData?.data as { canReview: boolean; hasExisting: boolean; hasDeliveredOrder: boolean } | undefined;

  return (
    <div className="mt-12">
      <h2
        className="mb-6 font-[family-name:var(--font-outfit)] text-xl font-bold"
        style={{ color: 'var(--white)' }}
      >
        Customer Reviews
      </h2>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Left: Summary + Write Review */}
        <div className="space-y-4">
          {summary && summary.totalReviews > 0 && (
            <RatingSummaryDisplay summary={summary} />
          )}

          {/* Review CTA */}
          {!user ? (
            <div
              className="rounded-xl border p-4 text-center"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                Have this product?
              </p>
              <Link
                href="/login"
                className="mt-1 inline-block text-sm font-medium hover:underline"
                style={{ color: 'var(--gold)' }}
              >
                Sign in to leave a review
              </Link>
            </div>
          ) : canReview?.hasExisting ? (
            <div
              className="rounded-xl border p-4 text-center"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                You have already reviewed this product.
              </p>
            </div>
          ) : canReview && !canReview.hasDeliveredOrder ? (
            <div
              className="rounded-xl border p-4 text-center"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                Purchase and receive this product to leave a review.
              </p>
            </div>
          ) : canReview?.canReview ? (
            <div
              className="rounded-xl border p-4"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              {formVisible ? (
                <ReviewForm
                  productId={productId}
                  onSubmitted={() => setFormVisible(false)}
                />
              ) : (
                <button
                  onClick={() => setFormVisible(true)}
                  className="w-full rounded-lg py-2.5 text-sm font-medium transition-colors hover:opacity-90"
                  style={{ background: 'var(--gold)', color: 'var(--deep)' }}
                >
                  Write a Review
                </button>
              )}
            </div>
          ) : null}
        </div>

        {/* Right: Review List */}
        <div className="space-y-3">
          {reviewsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-xl"
                  style={{ background: 'var(--card)' }}
                />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div
              className="rounded-xl border py-12 text-center"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          ) : (
            <>
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}

              {/* Simple pagination */}
              {reviews.length >= 10 && (
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-lg border px-3 py-1.5 text-sm transition-colors disabled:opacity-40"
                    style={{ borderColor: 'var(--border)', color: 'var(--white)' }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-lg border px-3 py-1.5 text-sm transition-colors"
                    style={{ borderColor: 'var(--border)', color: 'var(--white)' }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
