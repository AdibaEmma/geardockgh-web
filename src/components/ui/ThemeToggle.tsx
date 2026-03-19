'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '@/stores/theme-store';

const cycleOrder = ['light', 'dark', 'system'] as const;

const themeConfig = {
  light: { Icon: Sun, label: 'Light mode' },
  dark: { Icon: Moon, label: 'Dark mode' },
  system: { Icon: Monitor, label: 'System theme' },
} as const;

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const handleCycle = () => {
    const currentIndex = cycleOrder.indexOf(theme);
    const next = cycleOrder[(currentIndex + 1) % cycleOrder.length];
    setTheme(next);
  };

  const { Icon, label } = themeConfig[theme];

  return (
    <button
      onClick={handleCycle}
      className="theme-toggle-btn"
      aria-label={label}
      title={label}
    >
      <Icon size={16} />
    </button>
  );
}
