import { apiClient } from './client';
import type { Product } from '@/types';

interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  isPreorder?: boolean;
}

export async function getProducts(params?: GetProductsParams) {
  return apiClient.get<Product[]>('/products', { params });
}

export async function getProduct(slug: string) {
  return apiClient.get<Product>(`/products/${slug}`);
}

export async function getFeaturedProducts() {
  return apiClient.get<Product[]>('/products/featured');
}

export async function getNewArrivals() {
  return apiClient.get<Product[]>('/products/new-arrivals');
}

export async function getFlashDeal() {
  return apiClient.get<Product | null>('/products/flash-deal');
}
