import { Telegraf, session } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import { setupCommands } from './commands';
import { setupHandlers } from './handlers';
import { StartCommand } from './commands/start';
import { SubscribeCommand } from './commands/subscribe';
import { UnsubscribeCommand } from './commands/unsubscribe';
import { ListCommand } from './commands/list';
import { SettingsCommand } from './commands/settings';
import { GroupHandler } from './domains/groups/handlers/group.handler';
import { setupSwagger } from './swagger/swagger.config';

async function bootstrap() {
  // Create NestJS app for dependency injection and configuration
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors();

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Set global prefix
  app.setGlobalPrefix('api');

  const startCommand = app.get(StartCommand);
  const subscribeCommand = app.get(SubscribeCommand);
  const unsubscribeCommand = app.get(UnsubscribeCommand);
  const listCommand = app.get(ListCommand);
  const settingsCommand = app.get(SettingsCommand);
  const groupHandler = app.get(GroupHandler);

  // Initialize bot with token from environment variables
  const bot = new Telegraf(configService.get<string>('TELEGRAM_BOT_TOKEN'));

  // Enable session middleware
  bot.use(session());

  // Setup commands and handlers
  setupCommands(
    bot,
    startCommand,
    subscribeCommand,
    unsubscribeCommand,
    listCommand,
    settingsCommand,
  );
  setupHandlers(bot, groupHandler);

  // Error handling
  bot.catch((err, ctx) => {
    Logger.error(`Error for ${ctx.updateType}`, err);
    ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
  });

  // Start bot
  await bot.launch();
  Logger.log('Telegram bot started successfully');

  // Setup Swagger documentation
  setupSwagger(app);

  // Start HTTP server for API
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  Logger.log(`Application is running on: http://localhost:${port}`);
  Logger.log(
    `Swagger documentation is available at: http://localhost:${port}/docs`,
  );

  // Enable graceful stop
  process.once('SIGINT', () => {
    bot.stop('SIGINT');
    app.close();
  });
  process.once('SIGTERM', () => {
    bot.stop('SIGTERM');
    app.close();
  });
}

bootstrap();
