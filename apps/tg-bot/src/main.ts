import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

import { Logger, VersioningType } from '@nestjs/common';
import { Logger as CustomLogger } from './common/services/logger.service';

import { ConfigService } from '@nestjs/config';

import compression from 'compression';
import cookieParser from 'cookie-parser';

import { setupSwagger } from './swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(compression());
  app.use(cookieParser());

  /** Initializing custom logger */
  app.useLogger(new CustomLogger('AppInstance'));

  /** Cors */
  const configService = app.get(ConfigService);
  const allowedOrigins = configService.get<string>('CORS_ORIGIN');

  app.enableCors({
    origin: (requestOrigin, callback) => {
      callback(null, allowedOrigins.includes(requestOrigin));
    },
    credentials: true,
  });

  /** Versioning */
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.setGlobalPrefix('api');

  /** Swagger */
  setupSwagger(app);

  /** Initializing app config using environment variables & nestjs/config */
  const port = parseInt(configService.get<string>('PORT'), 10);
  const host = configService.get<string>('HOST');

  await app.listen(port, host, () => {
    Logger.debug(`App is running on ${host}:${port}`);
    Logger.debug(`Swagger docs available at http://${host}:${port}/docs`);
  });
}
bootstrap();
