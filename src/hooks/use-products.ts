'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts, getProduct } from '@/lib/api/products';

interface UseProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  search?: string;
  isPreorder?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export function useProducts(params?: UseProductsParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProduct(slug),
    enabled: !!slug,
  });
}
