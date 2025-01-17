import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import {
  activeUsersMetric,
  gameUpdatesProcessedMetric,
  httpRequestDurationMetric,
  httpRequestsTotalMetric,
  notificationsSentMetric,
} from './metrics.decorators';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
      path: '/metrics',
    }),
  ],
  controllers: [MetricsController],
  providers: [
    MetricsService,
    httpRequestDurationMetric,
    httpRequestsTotalMetric,
    gameUpdatesProcessedMetric,
    notificationsSentMetric,
    activeUsersMetric,
  ],
  exports: [MetricsService],
})
export class MonitoringModule {}
