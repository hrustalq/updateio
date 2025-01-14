import { createHash, createHmac } from 'crypto';

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
}

export interface TelegramAuthData extends TelegramUser {
  hash: string;
}

// Type definitions for Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        initData: string;
      };
    };
  }
}

export class TelegramAuth {
  private static buildDataCheckString(data: Omit<TelegramAuthData, 'hash'>): string {
    const checkArr = Object.entries(data)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`);

    return checkArr.join('\n');
  }

  static validateAuthData(authData: TelegramAuthData, botToken: string): boolean {
    const { hash, ...data } = authData;
    const dataCheckString = this.buildDataCheckString(data);
    const secretKey = createHash('sha256').update(botToken).digest();
    const calculatedHash = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return calculatedHash === hash;
  }

  static isAuthExpired(authDate: number, maxAge: number = 86400): boolean {
    const now = Math.floor(Date.now() / 1000);
    return now - authDate > maxAge;
  }

  static async initTelegramWebApp(): Promise<void> {
    if (!window.Telegram?.WebApp) {
      throw new Error('Telegram WebApp is not available');
    }

    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }

  static getTelegramAuthData(): TelegramAuthData | null {
    if (!window.Telegram?.WebApp?.initData) {
      return null;
    }

    try {
      const searchParams = new URLSearchParams(window.Telegram.WebApp.initData);
      const user = JSON.parse(searchParams.get('user') || '');
      const authDate = parseInt(searchParams.get('auth_date') || '');
      const hash = searchParams.get('hash') || '';

      return {
        ...user,
        auth_date: authDate,
        hash,
      };
    } catch (error) {
      console.error('Failed to parse Telegram auth data:', error);
      return null;
    }
  }
} 