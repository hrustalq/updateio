import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import {
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';

const metricProviders = [
  makeCounterProvider({
    name: 'discord_bot_commands_total',
    help: 'Total number of commands executed',
    labelNames: ['command'],
  }),
  makeCounterProvider({
    name: 'discord_bot_command_errors_total',
    help: 'Total number of command errors',
    labelNames: ['command', 'error_type'],
  }),
  makeCounterProvider({
    name: 'discord_bot_updates_processed_total',
    help: 'Total number of game updates processed',
    labelNames: ['game'],
  }),
  makeCounterProvider({
    name: 'discord_bot_update_errors_total',
    help: 'Total number of update processing errors',
    labelNames: ['game', 'error_type'],
  }),
  makeHistogramProvider({
    name: 'discord_bot_command_duration_seconds',
    help: 'Command execution duration',
    labelNames: ['command'],
    buckets: [0.1, 0.5, 1, 2, 5],
  }),
  makeHistogramProvider({
    name: 'discord_bot_update_duration_seconds',
    help: 'Update processing duration',
    labelNames: ['game'],
    buckets: [0.1, 0.5, 1, 2, 5],
  }),
];

@Module({
  imports: [
    PrometheusModule.register({
      defaultLabels: {
        app: 'discord_bot',
      },
      path: '/metrics',
    }),
  ],
  providers: [MetricsService, ...metricProviders],
  controllers: [MetricsController],
  exports: [MetricsService],
})
export class MetricsModule {}
