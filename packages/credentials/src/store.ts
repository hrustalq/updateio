import { create } from 'zustand';
import { auth as authApi, components } from '@repo/api-client';

export type User = components['schemas']['UserResponseDto'];

interface CredentialsState {
  user: User | null;
  accessToken: string | null;
  expiresIn: number | null;
  issuedAt: number | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<CredentialsState>((set, get) => ({
  user: null,
  accessToken: null,
  expiresIn: null,
  issuedAt: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAccessToken: (token) => set({ accessToken: token }),

  login: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      
      const response = await authApi.login({ email, password });
      const { data } = response;
      if (!data) {
        throw new Error('No data returned from login endpoint');
      }

      const { access_token, expires_in, issued_at } = data;

      // Get user info
      const userResponse = await authApi.getCurrentUser();
      const { data: user } = userResponse;
      if (!user) {
        throw new Error('No user data returned');
      }

      set({
        user,
        accessToken: access_token,
        expiresIn: expires_in,
        issuedAt: issued_at,
        isAuthenticated: true,
        loading: false
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      set({ error, loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      const { accessToken } = get();
      
      if (accessToken) {
        await authApi.logout();
      }

      set({
        user: null,
        accessToken: null,
        expiresIn: null,
        issuedAt: null,
        isAuthenticated: false,
        loading: false
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Logout failed');
      set({ error, loading: false });
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      set({ loading: true, error: null });
      
      const response = await authApi.refreshToken();
      const { data } = response;
      if (!data) {
        throw new Error('No data returned from refresh endpoint');
      }

      const { access_token, expires_in, issued_at } = data;

      // Get user info
      const userResponse = await authApi.getCurrentUser();
      const { data: user } = userResponse;
      if (!user) {
        throw new Error('No user data returned');
      }

      set({
        user,
        accessToken: access_token,
        expiresIn: expires_in,
        issuedAt: issued_at,
        isAuthenticated: true,
        loading: false
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Token refresh failed');
      set({ error, loading: false });
      throw error;
    }
  }
})); 