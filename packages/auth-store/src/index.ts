import { create } from 'zustand';
import type { AuthState, AuthUser } from '@repo/shared';

const AUTH_KEY = 'auth_state';

interface StoredAuthState {
  accessToken: string | null;
  expiresIn: number | null;
  issuedAt: number | null;
}

export interface ExtendedAuthState extends AuthState {
  expiresIn: number | null;
  issuedAt: number | null;
  loading: boolean;
  error: Error | null;
  setUser: (user: AuthUser | null) => void;
  setAccessToken: (token: string | null) => void;
  setAuthState: (state: Partial<ExtendedAuthState>) => void;
  clearAuth: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  initialize: () => Promise<void>;
}

const storage = {
  get: (): StoredAuthState | null => {
    try {
      const item = localStorage.getItem(AUTH_KEY);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: (state: StoredAuthState) => {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save auth state:', error);
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (error) {
      console.error('Failed to clear auth state:', error);
    }
  },
};

// Load initial state from storage
const storedAuth = storage.get();

export const useAuthStore = create<ExtendedAuthState>((set, get) => ({
  user: null,
  telegramUser: null,
  accessToken: storedAuth?.accessToken ?? null,
  expiresIn: storedAuth?.expiresIn ?? null,
  issuedAt: storedAuth?.issuedAt ?? null,
  loading: false,
  error: null,
  isAuthenticated: !!storedAuth?.accessToken,

  setUser: (user: AuthUser | null) => set({ user, isAuthenticated: !!user }),
  
  setAccessToken: (token: string | null) => {
    set((state) => {
      if (token) {
        storage.set({
          accessToken: token,
          expiresIn: state.expiresIn,
          issuedAt: state.issuedAt,
        });
      } else {
        storage.clear();
      }
      return { ...state, accessToken: token, isAuthenticated: !!token };
    });
  },

  setAuthState: (state: Partial<ExtendedAuthState>) => {
    set((prev) => {
      const newState = {
        ...prev,
        ...state,
        isAuthenticated: state.accessToken !== undefined ? !!state.accessToken : prev.isAuthenticated,
      };

      if (state.accessToken) {
        storage.set({
          accessToken: state.accessToken,
          expiresIn: state.expiresIn ?? prev.expiresIn,
          issuedAt: state.issuedAt ?? prev.issuedAt,
        });
      }

      return newState;
    });
  },

  clearAuth: () => {
    storage.clear();
    set({
      user: null,
      telegramUser: null,
      accessToken: null,
      expiresIn: null,
      issuedAt: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    });
  },

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      // Note: actual API call will be handled by credentials package
      set({ loading: false });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      set({ error, loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      // Note: actual API call will be handled by credentials package
      storage.clear();
      set({
        user: null,
        telegramUser: null,
        accessToken: null,
        expiresIn: null,
        issuedAt: null,
        loading: false,
        isAuthenticated: false,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Logout failed');
      set({ error, loading: false });
      throw error;
    }
  },

  refreshToken: async () => {
    set({ loading: true, error: null });
    try {
      // Note: actual API call will be handled by credentials package
      set({ loading: false });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Token refresh failed');
      set({ error, loading: false });
      throw error;
    }
  },

  initialize: async () => {
    const { accessToken } = get();
    if (!accessToken) return;

    try {
      set({ loading: true });
      // Note: actual API call will be handled by credentials package
      set({ loading: false });
    } catch (err) {
      storage.clear();
      set({
        user: null,
        telegramUser: null,
        accessToken: null,
        expiresIn: null,
        issuedAt: null,
        loading: false,
        isAuthenticated: false,
      });
    }
  },
})); 