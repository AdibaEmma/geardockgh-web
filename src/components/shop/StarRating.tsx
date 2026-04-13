'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({ rating, size = 16, interactive = false, onChange }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
        >
          <Star
            size={size}
            fill={star <= rating ? 'var(--gold)' : 'transparent'}
            stroke={star <= rating ? 'var(--gold)' : 'var(--border)'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}
