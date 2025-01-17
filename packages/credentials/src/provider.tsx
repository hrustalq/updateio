import React, { useEffect } from 'react';
import { useAuthStore } from './store';

interface AuthProviderProps {
  children: React.ReactNode;
  onAuthStateChange?: (isAuthenticated: boolean) => void;
}

export function AuthProvider({ children, onAuthStateChange }: AuthProviderProps) {
  const { isAuthenticated, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    onAuthStateChange?.(isAuthenticated);
  }, [isAuthenticated, onAuthStateChange]);

  return <>{children}</>;
} 