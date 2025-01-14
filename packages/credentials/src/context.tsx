import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from './store';

interface AuthContextValue {
  user: {
    id: string;
    email?: string;
    role: 'ADMIN' | 'USER' | 'MODERATOR' | 'CLIENT';
  } | null;
  accessToken: string | null;
  expiresIn: number | null;
  issuedAt: number | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  onAuthStateChange?: (isAuthenticated: boolean) => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  onAuthStateChange,
}) => {
  const {
    user,
    accessToken,
    expiresIn,
    issuedAt,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    refreshToken,
  } = useAuthStore();

  useEffect(() => {
    onAuthStateChange?.(isAuthenticated);
  }, [isAuthenticated, onAuthStateChange]);

  const value: AuthContextValue = {
    user,
    accessToken,
    expiresIn,
    issuedAt,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 