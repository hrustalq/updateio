import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UpdateService } from './update.service';
import { UpdateHandler } from './update.handler';
import { MetricsModule } from 'src/infrastructure/monitoring/metrics.module';

@Module({
  imports: [ConfigModule, MetricsModule],
  providers: [UpdateService, UpdateHandler],
  exports: [UpdateService, UpdateHandler],
})
export class UpdateModule {}
