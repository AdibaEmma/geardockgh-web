'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  checkStockNotification,
  subscribeStockNotification,
  unsubscribeStockNotification,
} from '@/lib/api/stock-notifications';
import { useToastStore } from '@/stores/toast-store';
import { useAuthStore } from '@/stores/auth-store';

export function useStockNotification(productId: string) {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['stock-notification', productId],
    queryFn: () => checkStockNotification(productId),
    enabled: !!user && !!productId,
  });
}

export function useSubscribeStock() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (productId: string) => subscribeStockNotification(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({
        queryKey: ['stock-notification', productId],
      });
      addToast({
        type: 'success',
        message: "We'll notify you when this is back in stock",
      });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to subscribe' });
    },
  });
}

export function useUnsubscribeStock() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (productId: string) => unsubscribeStockNotification(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({
        queryKey: ['stock-notification', productId],
      });
      addToast({ type: 'info', message: 'Notification removed' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to unsubscribe' });
    },
  });
}
