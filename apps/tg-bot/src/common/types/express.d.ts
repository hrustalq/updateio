import { User } from '@repo/database';

declare module 'express' {
  export interface Request {
    version?: string;
    user?: User;
    cookies: Record<string, any>;
  }
}

export {};
