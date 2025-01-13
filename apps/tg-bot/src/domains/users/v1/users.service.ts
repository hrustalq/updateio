import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UserRole } from '@repo/database';

@Injectable()
export class UsersService {
  // Temporary in-memory storage, replace with actual database
  private readonly users: User[] = [
    {
      id: '1',
      email: 'user@example.com',
      password: 'password123',
      role: UserRole.ADMIN,
      createdAt: undefined,
      updatedAt: undefined,
    },
  ];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }
}
