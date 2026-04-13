import { apiClient } from './client';
import type { Review, RatingSummary, CanReviewResponse } from '@/types';

export async function getProductReviews(productId: string, page = 1, limit = 10) {
  return apiClient.get<Review[]>('/reviews', { params: { productId, page, limit } });
}

export async function getProductRatingSummary(productId: string) {
  return apiClient.get<RatingSummary>(`/reviews/product/${productId}/summary`);
}

export async function getTestimonials() {
  return apiClient.get<Review[]>('/reviews/testimonials');
}

export async function canReviewProduct(productId: string) {
  return apiClient.get<CanReviewResponse>(`/reviews/can-review/${productId}`);
}

export async function createReview(data: {
  productId: string;
  rating: number;
  title?: string;
  text?: string;
  imagesJson?: string;
}) {
  return apiClient.post<Review>('/reviews', data);
}
