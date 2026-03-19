'use client';

import type { ReactNode } from 'react';
import { QueryProvider } from './query-provider';
import { AuthProvider } from './auth-provider';
import { ThemeProvider } from './theme-provider';
import { ToastContainer } from '@/components/ui/ToastContainer';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider>
          {children}
          <ToastContainer />
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
