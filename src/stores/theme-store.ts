import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
}

interface ThemeActions {
  setTheme: (theme: Theme) => void;
}

type ThemeStore = ThemeState & ThemeActions;

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'system') {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'dark';
  }
  return theme;
}

function applyTheme(resolved: ResolvedTheme) {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    requestAnimationFrame(() => {
      setTimeout(() => root.classList.remove('theme-transitioning'), 300);
    });
  }
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      resolvedTheme: 'dark',

      setTheme: (theme) => {
        const resolved = resolveTheme(theme);
        applyTheme(resolved);
        set({ theme, resolvedTheme: resolved });
      },
    }),
    {
      name: 'geardock-theme',
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolved = resolveTheme(state.theme);
          applyTheme(resolved);
          state.resolvedTheme = resolved;
        }
      },
    },
  ),
);
