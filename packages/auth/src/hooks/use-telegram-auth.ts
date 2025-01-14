import { useEffect, useState } from 'react';
import { useAuthStore, TelegramAuth, TelegramAuthData } from '../index';

interface UseTelegramAuthOptions {
  botToken: string;
  maxAge?: number;
  onSuccess?: (authData: TelegramAuthData) => void;
  onError?: (error: Error) => void;
}

export function useTelegramAuth({
  botToken,
  maxAge = 86400,
  onSuccess,
  onError,
}: UseTelegramAuthOptions) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { setTelegramUser } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        await TelegramAuth.initTelegramWebApp();
        const authData = TelegramAuth.getTelegramAuthData();

        if (!authData) {
          throw new Error('No Telegram auth data available');
        }

        if (TelegramAuth.isAuthExpired(authData.auth_date, maxAge)) {
          throw new Error('Telegram auth data has expired');
        }

        const isValid = TelegramAuth.validateAuthData(authData, botToken);
        if (!isValid) {
          throw new Error('Invalid Telegram auth data');
        }

        setTelegramUser(authData);
        onSuccess?.(authData);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Authentication failed');
        setError(error);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [botToken, maxAge, onSuccess, onError, setTelegramUser]);

  return {
    isLoading,
    error,
  };
} 