import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Logger } from '../../services/logger.service';
import { PrismaClient } from '@repo/database';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger('PrismaService');

  async onModuleInit() {
    await this.$connect().catch((error) => {
      this.logger.error('Failed to connect to database', error);
      throw error;
    });
  }

  async onModuleDestroy() {
    await this.$disconnect().catch((error) => {
      this.logger.error('Failed to disconnect from database', error);
      throw error;
    });
  }
}
