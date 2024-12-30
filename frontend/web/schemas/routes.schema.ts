export const publicRoutes: Record<string, boolean> = {
  '/public': true,
};

export const authRoutes: Record<string, boolean> = {
  '/auth/login': true,
  '/auth/register': true,
};

export const adminRoutes: Record<string, boolean> = {
  '/users': true,
  '/wallets': true,
};

export const apiAuthPrefix = '/api/auth';

export const DEFAULT_LOGIN_REDIRECT = '/';
