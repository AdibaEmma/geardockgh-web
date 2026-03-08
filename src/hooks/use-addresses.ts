'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from '@/lib/api/addresses';
import { useToastStore } from '@/stores/toast-store';

export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => getAddresses(),
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (data: {
      label?: string;
      street: string;
      city: string;
      region: string;
      isDefault?: boolean;
    }) => createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      addToast({ type: 'success', message: 'Address added' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to add address' });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        label?: string;
        street?: string;
        city?: string;
        region?: string;
        isDefault?: boolean;
      };
    }) => updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      addToast({ type: 'success', message: 'Address updated' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to update address' });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      addToast({ type: 'success', message: 'Address removed' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to remove address' });
    },
  });
}
