import { UserRole } from '@repo/database';

export interface User {
  id: string;
  email: string;
  password?: string;
  telegramId?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
