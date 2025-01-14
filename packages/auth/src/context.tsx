import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore, AuthUser } from './store';
import { TelegramUser } from './telegram';
import { useTelegramAuth } from './hooks/use-telegram-auth';

interface AuthContextValue {
  user: AuthUser | null;
  telegramUser: TelegramUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  setUser: (user: AuthUser | null) => void;
  setTelegramUser: (user: TelegramUser | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  botToken: string;
  maxAge?: number;
  onAuthStateChange?: (isAuthenticated: boolean) => void;
  onTelegramAuthSuccess?: (authData: TelegramUser) => void;
  onTelegramAuthError?: (error: Error) => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  botToken,
  maxAge,
  onAuthStateChange,
  onTelegramAuthSuccess,
  onTelegramAuthError,
}) => {
  const {
    user,
    telegramUser,
    accessToken,
    isAuthenticated,
    setUser,
    setTelegramUser,
    setAccessToken,
    logout,
  } = useAuthStore();

  const { isLoading, error } = useTelegramAuth({
    botToken,
    maxAge,
    onSuccess: (authData) => {
      onTelegramAuthSuccess?.(authData);
    },
    onError: (error) => {
      onTelegramAuthError?.(error);
    },
  });

  useEffect(() => {
    onAuthStateChange?.(isAuthenticated);
  }, [isAuthenticated, onAuthStateChange]);

  const value: AuthContextValue = {
    user,
    telegramUser,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setTelegramUser,
    setAccessToken,
    logout,
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