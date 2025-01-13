import { User } from '@repo/database';

declare module 'express' {
  export interface Request {
    version?: string;
    user?: Omit<User, 'createdAt' | 'updatedAt'>;
    cookies: Record<string, any>;
  }
}

export {};
