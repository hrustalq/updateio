import {
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';

export const httpRequestDurationMetric = makeHistogramProvider({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'path', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

export const httpRequestsTotalMetric = makeCounterProvider({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'],
});

export const gameUpdatesProcessedMetric = makeCounterProvider({
  name: 'game_updates_processed_total',
  help: 'Total number of game updates processed',
});

export const notificationsSentMetric = makeCounterProvider({
  name: 'notifications_sent_total',
  help: 'Total number of notifications sent',
});

export const activeUsersMetric = makeGaugeProvider({
  name: 'active_users_gauge',
  help: 'Current number of active users',
});
