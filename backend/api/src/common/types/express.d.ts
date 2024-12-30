import { User } from '../../domains/users/interfaces/user.interface';

declare module 'express' {
  interface Request {
    version?: string;
    user?: Omit<User, 'password'>;
    cookies: Record<string, any>;
  }
}
