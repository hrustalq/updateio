import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

import { Logger, VersioningType } from '@nestjs/common';
import { Logger as CustomLogger } from './common/services/logger.service';

import { ConfigService } from '@nestjs/config';

import { SwaggerModule } from '@nestjs/swagger';

import compression from 'compression';
import cookieParser from 'cookie-parser';

import { swaggerConfig, swaggerOptions } from './swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(compression());
  app.use(cookieParser());

  /** Initializing custom logger */
  app.useLogger(new CustomLogger('AppInstance'));

  /** Versioning */
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  /** Swagger */
  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerOptions,
  );
  SwaggerModule.setup('docs', app, document);

  /** Initializing app config using environment variables & nestjs/config */
  const configService = app.get(ConfigService);
  const port = parseInt(configService.get<string>('PORT'), 10);
  const host = configService.get<string>('HOST');

  await app.listen(port, host, () => {
    Logger.debug(`App is running on ${host}:${port}`);
    Logger.debug(
      `Swagger JSON available at http://${host}:${port}/swagger.json`,
    );
  });
}
bootstrap();
