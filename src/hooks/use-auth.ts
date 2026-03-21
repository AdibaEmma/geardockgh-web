'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login, register, logout as logoutApi } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';
import { useToastStore } from '@/stores/toast-store';
import type { LoginRequest, RegisterRequest } from '@/types';

function safeRedirect(path?: string): string {
  if (!path) return '/products';
  if (path.startsWith('//') || path.includes('://')) return '/products';
  if (!path.startsWith('/')) return '/products';
  return path;
}

export function useLogin(redirectTo?: string) {
  const router = useRouter();
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (response) => {
      const { accessToken, refreshToken, ...user } = response.data as any;
      setTokens(accessToken, refreshToken);
      setUser(user.user ?? user);
      addToast({ type: 'success', message: 'Welcome back!' });
      router.push(safeRedirect(redirectTo));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error?.message ?? 'Login failed. Please try again.';
      addToast({ type: 'error', message });
    },
  });
}

export function useRegister(redirectTo?: string) {
  const router = useRouter();
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: (response) => {
      const { accessToken, refreshToken, ...user } = response.data as any;
      setTokens(accessToken, refreshToken);
      setUser(user.user ?? user);
      addToast({ type: 'success', message: 'Account created successfully!' });
      router.push(safeRedirect(redirectTo));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error?.message ?? 'Registration failed. Please try again.';
      addToast({ type: 'error', message });
    },
  });
}

export function useLogout() {
  const authLogout = useAuthStore((s) => s.logout);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const router = useRouter();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: () => logoutApi(refreshToken ?? ''),
    onSettled: () => {
      authLogout();
      addToast({ type: 'success', message: 'Logged out successfully' });
      router.push('/');
    },
  });
}
