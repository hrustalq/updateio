import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

import { Logger, VersioningType } from '@nestjs/common';
import { Logger as CustomLogger } from './common/services/logger.service';

import { ConfigService } from '@nestjs/config';

import { SwaggerModule } from '@nestjs/swagger';

import compression from 'compression';

import { swaggerConfig, swaggerOptions } from './swagger/swagger.config';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { UpdateHandler } from './domains/updates/update.handler';
import { CommandsService } from './domains/commands/commands.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new CustomLogger('DiscordBot');
  const configService = app.get(ConfigService);

  app.use(compression());

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  const updateHandler = app.get(UpdateHandler);
  const commandsService = app.get(CommandsService);

  /** Cors */
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

  /** Initialize Discord client */
  client.once(Events.ClientReady, async () => {
    logger.log('Discord bot is ready!');
    await commandsService.registerCommands(client);
  });

  client.on(Events.MessageCreate, async (message) => {
    await updateHandler.handleMessage(message);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    await commandsService.handleCommand(interaction);
  });

  const discordToken = configService.get<string>('DISCORD_BOT_TOKEN');
  if (!discordToken) {
    throw new Error(
      'DISCORD_BOT_TOKEN is not defined in environment variables',
    );
  }

  await client.login(discordToken);
  logger.log('Logging into Discord...');

  /** Start HTTP server */
  const port = parseInt(configService.get<string>('PORT'), 10);
  const host = configService.get<string>('HOST');

  await app.listen(port, host, () => {
    Logger.debug(`App is running on ${host}:${port}`);
    Logger.debug(`API documentation available at http://${host}:${port}/docs`);
  });
}

bootstrap();
