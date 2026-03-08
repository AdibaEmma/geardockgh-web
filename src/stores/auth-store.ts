import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/types';
import { apiClient } from '@/lib/api/client';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isHydrated: boolean;
}

interface AuthActions {
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  hydrate: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isHydrated: false,

      setTokens: (accessToken, refreshToken) => {
        apiClient.setTokens(accessToken, refreshToken);
        set({ accessToken, refreshToken });
      },

      setUser: (user) => {
        set({ user });
      },

      logout: () => {
        apiClient.setTokens(null, null);
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
        });
      },

      hydrate: () => {
        const { accessToken, refreshToken } = get();
        if (accessToken && refreshToken) {
          apiClient.setTokens(accessToken, refreshToken);
        }

        apiClient.onTokenRefreshed = (newAccessToken, newRefreshToken) => {
          get().setTokens(newAccessToken, newRefreshToken);
        };

        apiClient.onAuthFailure = () => {
          get().logout();
        };

        set({ isHydrated: true });
      },
    }),
    {
      name: 'geardockgh-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
);
