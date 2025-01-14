import { ReactNode } from 'react';
import { useAuthStore } from './store';

interface AuthProviderProps {
  children: ReactNode;
  onAuthStateChange?: (isAuthenticated: boolean) => void;
}

export function AuthProvider({ children, onAuthStateChange }: AuthProviderProps) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  if (onAuthStateChange) {
    onAuthStateChange(isAuthenticated);
  }

  return <>{children}</>;
} 