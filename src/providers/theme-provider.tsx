'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  useEffect(() => {
    if (theme !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setTheme('system');

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, setTheme]);

  return <>{children}</>;
}
