import { useCallback } from 'react';
import { useAuthStore } from '../store';

interface UseCredentialsAuthProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useCredentialsAuth = ({ onSuccess, onError }: UseCredentialsAuthProps = {}) => {
  const { 
    login: storeLogin, 
    logout: storeLogout, 
    refreshToken: storeRefreshToken,
    loading,
    error,
    accessToken,
    expiresIn,
    issuedAt
  } = useAuthStore();

  const login = useCallback(async (email: string, password: string) => {
    try {
      await storeLogin(email, password);
      onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Authentication failed');
      onError?.(error);
      throw error;
    }
  }, [storeLogin, onSuccess, onError]);

  const logout = useCallback(async () => {
    try {
      await storeLogout();
      onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Logout failed');
      onError?.(error);
      throw error;
    }
  }, [storeLogout, onSuccess, onError]);

  const refreshToken = useCallback(async () => {
    try {
      await storeRefreshToken();
      onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Token refresh failed');
      onError?.(error);
      throw error;
    }
  }, [storeRefreshToken, onSuccess, onError]);

  return {
    login,
    logout,
    refreshToken,
    loading,
    error,
    accessToken,
    expiresIn,
    issuedAt,
    isAuthenticated: !!accessToken
  };
}; 