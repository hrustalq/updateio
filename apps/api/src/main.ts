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
import { readFileSync } from 'fs';
import { join } from 'path';
import { existsSync } from 'fs';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const isDev = process.env.NODE_ENV === 'development';

  // SSL configuration for local development only
  // In production, SSL should be handled by Nginx
  let httpsOptions = null;
  if (isDev) {
    const keyPath = join(__dirname, '../ssl/key.pem');
    const certPath = join(__dirname, '../ssl/cert.pem');

    if (existsSync(keyPath) && existsSync(certPath)) {
      httpsOptions = {
        key: readFileSync(keyPath),
        cert: readFileSync(certPath),
      };
      Logger.debug(
        'SSL certificates found, HTTPS will be enabled for development',
      );
    } else {
      Logger.warn('SSL certificates not found, HTTPS will not be enabled');
      Logger.warn(
        'Cookie-based auth features may not work properly without HTTPS',
      );
    }
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    ...(httpsOptions && { httpsOptions }),
  });

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
  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerOptions,
  );
  SwaggerModule.setup('docs', app, document);

  /** Initializing app config using environment variables & nestjs/config */
  const port = parseInt(configService.get<string>('PORT'), 10);
  const host = configService.get<string>('HOST');

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: configService.get('app.kafka.clientId'),
        brokers: configService.get('app.kafka.brokers'),
      },
      consumer: {
        groupId: configService.get('app.kafka.consumerGroupId'),
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(port, host, () => {
    Logger.debug(
      `App is running on ${isDev ? 'https' : 'http'}://${host}:${port}`,
    );
    Logger.debug(
      `Swagger JSON available at ${isDev ? 'https' : 'http'}://${host}:${port}/swagger.json`,
    );
  });
}
bootstrap();
