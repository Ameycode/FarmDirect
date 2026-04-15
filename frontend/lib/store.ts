'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Cart } from './types';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User, access: string, refresh: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

interface CartStore {
  cart: Cart | null;
  setCart: (cart: Cart) => void;
  clearCart: () => void;
  itemCount: () => number;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        set({ user, accessToken, refreshToken });
      },
      clearAuth: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, accessToken: null, refreshToken: null });
      },
      updateUser: (updates) =>
        set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),
    }),
    { name: 'farmdirect-auth', partialize: (s) => ({ user: s.user }) }
  )
);

export const useCartStore = create<CartStore>()((set, get) => ({
  cart: null,
  setCart: (cart) => set({ cart }),
  clearCart: () => set({ cart: null }),
  itemCount: () => get().cart?.items.length ?? 0,
}));
