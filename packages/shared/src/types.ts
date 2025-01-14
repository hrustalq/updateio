export interface AuthUser {
  id: string;
  email?: string;
  role: 'ADMIN' | 'MODERATOR' | 'USER' | 'CLIENT';
  telegramId?: string;
}

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
}

export interface AuthState {
  user: AuthUser | null;
  telegramUser: TelegramUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
} 