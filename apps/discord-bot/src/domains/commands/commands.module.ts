import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommandsService } from './commands.service';
import { UpdateModule } from '../updates/update.module';
import { MetricsModule } from '../../infrastructure/monitoring/metrics.module';

@Module({
  imports: [ConfigModule, UpdateModule, MetricsModule],
  providers: [CommandsService],
  exports: [CommandsService],
})
export class CommandsModule {}
