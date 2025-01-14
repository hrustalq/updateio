import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/v1/users.service';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../../common/modules/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  async validateApiKey(apiKey: string) {
    return this.usersService.findByApiKey(apiKey);
  }

  async generateApiKey(userId: string) {
    const apiKey = this.generateRandomApiKey();

    await this.prisma.user.update({
      where: { id: userId },
      data: { apiKey },
    });

    return { apiKey };
  }

  async revokeApiKey(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { apiKey: null },
    });
  }

  private generateRandomApiKey(): string {
    return `discord_${randomBytes(32).toString('hex')}`;
  }
}
