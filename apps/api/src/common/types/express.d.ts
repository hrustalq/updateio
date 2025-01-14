import { User } from '@repo/database';
import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      version?: string;
      user?: Omit<User, 'createdAt' | 'updatedAt'>;
      cookies: Record<string, any>;
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    file?: Multer.File;
    files?: Multer.File[];
  }
}

export {};
