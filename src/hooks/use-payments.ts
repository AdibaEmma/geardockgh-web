'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { initializePayment, verifyPayment } from '@/lib/api/payments';
import { useToastStore } from '@/stores/toast-store';

export function useInitializePayment() {
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (data: {
      orderId: string;
      provider: 'PAYSTACK' | 'MOMO' | 'BANK_TRANSFER';
      callbackUrl?: string;
    }) => initializePayment(data),
    onError: (error: any) => {
      const message =
        error?.response?.data?.error?.message ?? 'Failed to initialize payment';
      addToast({ type: 'error', message });
    },
  });
}

export function useVerifyPayment(reference: string | null) {
  return useQuery({
    queryKey: ['payment-verify', reference],
    queryFn: () => verifyPayment(reference!),
    enabled: !!reference,
    retry: 2,
  });
}
