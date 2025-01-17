import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { validate } from './config/config.validation';
import appConfig from './config/app.config';

import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { MetadataInterceptor } from './common/interceptors/metadata.interceptor';
import { ExceptionInterceptor } from './common/interceptors/exception.interceptor';
import { VersionInterceptor } from './common/interceptors/version.interceptor';

import helmet from 'helmet';

import { AuthModule } from './domains/auth/auth.module';
import { ApiKeyGuard } from './domains/auth/v1/guards/api-key.guard';
import { PrismaModule } from './common/modules/prisma/prisma.module';
import { HealthCheckModule } from './domains/health-check/health-check.module';
import { DiscordModule } from './common/modules/discord/discord.module';
import { GameUpdatesModule } from './domains/game-updates/game-updates.module';
import { UpdateModule } from './domains/updates/update.module';
import { CommandsModule } from './domains/commands/commands.module';
import { MetricsModule } from './infrastructure/monitoring/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      load: [appConfig],
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    HealthCheckModule,
    DiscordModule,
    GameUpdatesModule,
    UpdateModule,
    CommandsModule,
    MetricsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
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
    consumer.apply(LoggerMiddleware, helmet()).forRoutes('*');
  }
}
