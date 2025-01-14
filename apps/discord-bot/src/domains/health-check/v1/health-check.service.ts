import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/modules/prisma/prisma.service';
import { DiscordService } from '../../../common/modules/discord/discord.service';
import { HealthCheckDto } from './dto/health-check.dto';

@Injectable()
export class HealthCheckService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly discord: DiscordService,
  ) {}

  async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  async checkDiscord(): Promise<boolean> {
    try {
      return this.discord.client.isReady();
    } catch {
      return false;
    }
  }

  getStatus(): HealthCheckDto {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'discord-bot',
    };
  }
}
