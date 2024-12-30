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

import { ExampleController } from './example/example.controller';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CacheModule } from './common/modules/cache/cache.module';

import { AuthModule } from './domains/auth/auth.module';
import { GlobalAuthGuard } from './common/guards/global-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      load: [appConfig, redisConfig, authConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    CacheModule,
    AuthModule,
  ],
  controllers: [ExampleController],
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
    consumer.apply(LoggerMiddleware, helmet()).forRoutes('*');
  }
}
