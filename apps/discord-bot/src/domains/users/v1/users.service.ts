import { Injectable } from '@nestjs/common';
import { User } from '@repo/database';
import { PrismaService } from '../../../common/modules/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTelegramId(telegramId: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { telegramId },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByApiKey(apiKey: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { apiKey },
    });
  }
}
