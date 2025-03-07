import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { validate } from './config/config.validation';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import redisConfig from './config/redis.config';

import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { MetadataInterceptor } from './common/interceptors/metadata.interceptor';
import { ExceptionInterceptor } from './common/interceptors/exception.interceptor';
import { VersionInterceptor } from './common/interceptors/version.interceptor';

import helmet from 'helmet';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CacheModule } from './common/modules/cache/cache.module';

import { AuthModule } from './domains/auth/auth.module';
import { GlobalAuthGuard } from './common/guards/global-auth.guard';
import { PrismaModule } from './common/modules/prisma/prisma.module';
import { GameProvidersModule } from './domains/game-providers/game-providers.module';
import { GamesModule } from './domains/games/games.module';
import { UpdatesModule } from './domains/updates/updates.module';
import { SubscriptionsModule } from './domains/subscriptions/subscriptions.module';
import { NotificationsModule } from './domains/notifications/notifications.module';
import { ReportsModule } from './domains/reports/reports.module';
import { UpdateCommandsModule } from './domains/update-commands/update-commands.module';
import { MonitoringModule } from './infrastructure/monitoring/prometheus.module';
import { MetricsMiddleware } from './infrastructure/monitoring/metrics.middleware';
import { GameUpdatesModule } from './domains/game-updates/game-updates.module';
import { KafkaModule } from './infrastructure/kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      load: [appConfig, redisConfig, authConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    PrismaModule,
    CacheModule,
    GameProvidersModule,
    AuthModule,
    GamesModule,
    UpdatesModule,
    SubscriptionsModule,
    NotificationsModule,
    ReportsModule,
    UpdateCommandsModule,
    GameUpdatesModule,
    MonitoringModule,
    KafkaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
        validateCustomDecorators: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MetadataInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: VersionInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, helmet(), MetricsMiddleware)
      .forRoutes('*');
  }
}
