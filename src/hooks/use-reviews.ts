'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProductReviews,
  getProductRatingSummary,
  getTestimonials,
  canReviewProduct,
  createReview,
} from '@/lib/api/reviews';
import { useToastStore } from '@/stores/toast-store';

export function useProductReviews(productId: string, page = 1) {
  return useQuery({
    queryKey: ['reviews', productId, page],
    queryFn: () => getProductReviews(productId, page),
    enabled: !!productId,
  });
}

export function useRatingSummary(productId: string) {
  return useQuery({
    queryKey: ['rating-summary', productId],
    queryFn: () => getProductRatingSummary(productId),
    enabled: !!productId,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: getTestimonials,
  });
}

export function useCanReview(productId: string) {
  return useQuery({
    queryKey: ['can-review', productId],
    queryFn: () => canReviewProduct(productId),
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: createReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['rating-summary', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['can-review', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      addToast({ type: 'success', message: 'Review submitted!' });
    },
    onError: () => addToast({ type: 'error', message: 'Failed to submit review' }),
  });
}
