import { auth as authApi } from '@repo/api-client';
import { useAuthStore } from '@repo/auth-store';

export { useAuthStore };

// Re-export the auth store hooks with additional functionality
export const useAuth = () => {
  const store = useAuthStore();

  return {
    ...store,
    login: async (email: string, password: string) => {
      try {
        store.setAuthState({ loading: true, error: null });
        
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

        // Update state
        store.setAuthState({
          user,
          accessToken: access_token,
          expiresIn: expires_in,
          issuedAt: issued_at,
          loading: false
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Login failed');
        store.setAuthState({ error, loading: false });
        throw error;
      }
    },

    logout: async () => {
      try {
        store.setAuthState({ loading: true, error: null });
        const { accessToken } = store;
        
        if (accessToken) {
          await authApi.logout();
        }

        store.clearAuth();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Logout failed');
        store.setAuthState({ error, loading: false });
        throw error;
      }
    },

    refreshToken: async () => {
      try {
        store.setAuthState({ loading: true, error: null });
        
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

        // Update state
        store.setAuthState({
          user,
          accessToken: access_token,
          expiresIn: expires_in,
          issuedAt: issued_at,
          loading: false
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Token refresh failed');
        store.setAuthState({ error, loading: false });
        throw error;
      }
    },

    initialize: async () => {
      const { accessToken } = store;
      if (!accessToken) return;

      try {
        store.setAuthState({ loading: true });
        const userResponse = await authApi.getCurrentUser();
        const { data: user } = userResponse;
        if (user) {
          store.setAuthState({
            user,
            loading: false,
          });
        }
      } catch (err) {
        store.clearAuth();
      }
    },
  };
}; 