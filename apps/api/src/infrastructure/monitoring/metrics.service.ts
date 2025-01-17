import { Injectable } from '@nestjs/common';
import { Counter, Gauge, Histogram } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('http_request_duration_seconds')
    private readonly httpRequestDuration: Histogram,
    @InjectMetric('http_requests_total')
    private readonly httpRequestsTotal: Counter,
    @InjectMetric('game_updates_processed_total')
    private readonly gameUpdatesProcessed: Counter,
    @InjectMetric('notifications_sent_total')
    private readonly notificationsSent: Counter,
    @InjectMetric('active_users_gauge')
    private readonly activeUsers: Gauge,
  ) {}

  recordHttpRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
  ) {
    this.httpRequestDuration.observe(
      { method, path, status: statusCode },
      duration,
    );
    this.httpRequestsTotal.inc({ method, path, status: statusCode });
  }

  recordGameUpdate() {
    this.gameUpdatesProcessed.inc();
  }

  recordNotificationSent() {
    this.notificationsSent.inc();
  }

  setActiveUsers(count: number) {
    this.activeUsers.set(count);
  }
}
