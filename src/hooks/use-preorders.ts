'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPreorder,
  getPreorders,
  getPreorder,
  initializePreorderDeposit,
  initializeBalancePayment,
} from '@/lib/api/preorders';
import { useToastStore } from '@/stores/toast-store';

export function usePreorders(params?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['preorders', params],
    queryFn: () => getPreorders(params),
  });
}

export function usePreorder(id: string) {
  return useQuery({
    queryKey: ['preorder', id],
    queryFn: () => getPreorder(id),
    enabled: !!id,
  });
}

export function useCreatePreorder() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: createPreorder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preorders'] });
      addToast({ type: 'success', message: 'Pre-order created successfully' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to create pre-order' });
    },
  });
}

export function useInitializeDeposit() {
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({
      preorderId,
      provider,
      callbackUrl,
    }: {
      preorderId: string;
      provider: string;
      callbackUrl?: string;
    }) => initializePreorderDeposit(preorderId, provider, callbackUrl),
    onError: () => {
      addToast({ type: 'error', message: 'Failed to initialize deposit payment' });
    },
  });
}

export function useInitializeBalance() {
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({
      preorderId,
      provider,
      callbackUrl,
    }: {
      preorderId: string;
      provider: string;
      callbackUrl?: string;
    }) => initializeBalancePayment(preorderId, provider, callbackUrl),
    onError: () => {
      addToast({ type: 'error', message: 'Failed to initialize balance payment' });
    },
  });
}
