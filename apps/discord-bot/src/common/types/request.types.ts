import { Request } from 'express';
import { User } from '@repo/database';

export type CustomRequest = Request & {
  version?: string;
  user?: Omit<User, 'password'>;
  cookies: Record<string, any>;
};
