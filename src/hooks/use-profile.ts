'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile } from '@/lib/api/auth';
import { apiClient } from '@/lib/api/client';
import { useToastStore } from '@/stores/toast-store';
import type { AuthUser } from '@/types';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
    }) => apiClient.patch<AuthUser>('/auth/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      addToast({ type: 'success', message: 'Profile updated' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to update profile' });
    },
  });
}
