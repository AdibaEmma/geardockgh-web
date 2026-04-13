'use client';

import { CheckCircle } from 'lucide-react';
import { StarRating } from '@/components/shop/StarRating';
import type { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
}

function getRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const images: string[] = review.imagesJson ? JSON.parse(review.imagesJson) : [];
  const customerName = `${review.customer.firstName} ${review.customer.lastName[0]}.`;

  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{ background: 'rgba(240,165,0,0.15)', color: 'var(--gold)' }}
          >
            {review.customer.firstName[0]}{review.customer.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium" style={{ color: 'var(--white)' }}>
                {customerName}
              </span>
              {review.isVerified && (
                <CheckCircle size={14} className="text-green-400" fill="rgba(74,222,128,0.2)" />
              )}
            </div>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {getRelativeDate(review.createdAt)}
            </span>
          </div>
        </div>
        <StarRating rating={review.rating} size={14} />
      </div>

      {/* Title */}
      {review.title && (
        <p className="mt-3 text-sm font-semibold" style={{ color: 'var(--white)' }}>
          {review.title}
        </p>
      )}

      {/* Text */}
      {review.text && (
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          {review.text}
        </p>
      )}

      {/* Images */}
      {images.length > 0 && (
        <div className="mt-3 flex gap-2">
          {images.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-16 w-16 overflow-hidden rounded-lg border transition-transform hover:scale-105"
              style={{ borderColor: 'var(--border)' }}
            >
              <img
                src={url}
                alt={`Review image ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
