'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Shield } from 'lucide-react';
import { login } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';
import { useToastStore } from '@/stores/toast-store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { LoginRequest } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);
  const authLogout = useAuthStore((s) => s.logout);
  const addToast = useToastStore((s) => s.addToast);

  // If already logged in as admin, redirect to dashboard
  useEffect(() => {
    if (isHydrated && user?.role === 'ADMIN') {
      router.push('/admin');
    }
  }, [isHydrated, user, router]);

  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (response) => {
      const { accessToken, refreshToken, ...rest } = response.data as any;
      const userData = rest.user ?? rest;

      if (userData.role !== 'ADMIN') {
        // Not an admin — don't persist tokens
        addToast({ type: 'error', message: 'Access denied. Admin credentials required.' });
        return;
      }

      setTokens(accessToken, refreshToken);
      setUser(userData);
      addToast({ type: 'success', message: 'Welcome, Admin!' });
      router.push('/admin');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error?.message ?? 'Login failed. Please try again.';
      addToast({ type: 'error', message });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    // If a non-admin customer is currently logged in, log them out first
    if (user && user.role !== 'ADMIN') {
      authLogout();
    }
    handleLogin(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div
        className="w-full max-w-sm rounded-2xl border p-8"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="mb-6 text-center">
          <div
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: 'rgba(240,165,0,0.1)' }}
          >
            <Shield size={24} style={{ color: 'var(--gold)' }} />
          </div>
          <h1
            className="font-[family-name:var(--font-outfit)] text-xl font-bold"
            style={{ color: 'var(--gold)' }}
          >
            Admin Panel
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Sign in with your admin credentials
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="admin@geardockgh.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isPending}
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
