import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TelegramUser } from './telegram';
import { auth as authApi, type components } from '@repo/api-client';

export type AuthUser = components['schemas']['UserResponseDto'];

interface AuthState {
  user: AuthUser | null;
  telegramUser: TelegramUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  setTelegramUser: (user: TelegramUser | null) => void;
  setAccessToken: (token: string | null) => void;
  getCurrentUser: () => Promise<void>;
  telegramLogin: (data: components['schemas']['TelegramAuthDto']) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      telegramUser: null,
      accessToken: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTelegramUser: (telegramUser) => set({ telegramUser }),
      setAccessToken: (accessToken) => set({ accessToken }),

      getCurrentUser: async () => {
        try {
          const response = await authApi.getCurrentUser();
          const { data: user } = response;
          if (user) {
            set({ user, isAuthenticated: true });
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false });
          throw error;
        }
      },

      telegramLogin: async (data) => {
        try {
          const response = await authApi.telegramLogin(data);
          const { data: authData } = response;
          if (authData) {
            set({ accessToken: authData.access_token });
            await get().getCurrentUser();
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
          set({ 
            user: null, 
            telegramUser: null, 
            accessToken: null, 
            isAuthenticated: false 
          });
        } catch (error) {
          // Still clear state even if API call fails
          set({ 
            user: null, 
            telegramUser: null, 
            accessToken: null, 
            isAuthenticated: false 
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        accessToken: state.accessToken,
        telegramUser: state.telegramUser,
      }),
    },
  ),
); 