'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, getOrder, createOrder } from '@/lib/api/orders';
import { apiClient } from '@/lib/api/client';
import { useToastStore } from '@/stores/toast-store';
import type { Order } from '@/types';

interface UseOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
}

export function useOrders(params?: UseOrdersParams) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getOrders(params),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const addToast = useToastStore((s) => s.addToast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      items: { productId: string; variantId?: string; quantity: number }[];
      shippingAddressId?: string;
      notes?: string;
    }) => createOrder(data),
    onSuccess: (response) => {
      const order = response.data as Order;
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      return order;
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error?.message ??
        'Failed to place order. Please try again.';
      addToast({ type: 'error', message });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post<Order>(`/orders/${id}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      addToast({ type: 'success', message: 'Order cancelled' });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error?.message ?? 'Failed to cancel order';
      addToast({ type: 'error', message });
    },
  });
}
