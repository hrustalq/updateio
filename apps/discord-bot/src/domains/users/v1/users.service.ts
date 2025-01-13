import { Injectable } from '@nestjs/common';
import { User, UserRole } from '@repo/database';

@Injectable()
export class UsersService {
  // Temporary in-memory storage, replace with actual database
  private readonly users: User[] = [
    {
      id: '1',
      telegramId: 'user@example.com',
      password: 'password123',
      role: UserRole.ADMIN,
      createdAt: undefined,
      updatedAt: undefined,
    },
  ];

  async findByTelegramId(telegramId: string): Promise<User | null> {
    return this.users.find((user) => user.telegramId === telegramId) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }
}
