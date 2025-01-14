import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/modules/prisma/prisma.service';
import { HealthCheckDto } from './dto/health-check.dto';

@Injectable()
export class HealthCheckService {
  constructor(private readonly prisma: PrismaService) {}

  async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  getStatus(): HealthCheckDto {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'telegram-bot',
    };
  }
}
