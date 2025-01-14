import React from 'react';
import { useAuth } from '../context';
import { TelegramUser } from '../telegram';

interface TelegramLoginButtonProps {
  onSuccess?: (user: TelegramUser) => void;
  onError?: (error: Error) => void;
  className?: string;
  children?: React.ReactNode;
}

export const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({
  onSuccess,
  onError,
  className = '',
  children,
}) => {
  const { isLoading, error } = useAuth();

  const handleTelegramLogin = async () => {
    try {
      // Telegram login is handled by the Telegram Web App
      // The auth context will handle the authentication flow
      // and call onSuccess/onError callbacks
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Telegram login failed');
      onError?.(error);
    }
  };

  return (
    <div>
      <button
        onClick={handleTelegramLogin}
        disabled={isLoading}
        className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0088cc] hover:bg-[#0077b3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0088cc] disabled:opacity-50 ${className}`}
      >
        {isLoading ? (
          'Connecting...'
        ) : (
          <>
            {children || (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.241-1.865-.44-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.892-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.119.098.152.228.166.331.016.122.033.391.019.603z" />
                </svg>
                Login with Telegram
              </>
            )}
          </>
        )}
      </button>
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error.message}
        </div>
      )}
    </div>
  );
}; 