import { Telegraf } from 'telegraf';
import { StartCommand } from './start';
import { SubscribeCommand } from './subscribe';
import { UnsubscribeCommand } from './unsubscribe';
import { ListCommand } from './list';
import { SettingsCommand } from './settings';
import { helpCommand } from './help';

export const setupCommands = (
  bot: Telegraf,
  startCommand: StartCommand,
  subscribeCommand: SubscribeCommand,
  unsubscribeCommand: UnsubscribeCommand,
  listCommand: ListCommand,
  settingsCommand: SettingsCommand,
) => {
  // Register commands
  bot.command('start', (ctx) => startCommand.handle(ctx));
  bot.command('subscribe', (ctx) => subscribeCommand.handle(ctx));
  bot.command('unsubscribe', (ctx) => unsubscribeCommand.handle(ctx));
  bot.command('list', (ctx) => listCommand.handle(ctx));
  bot.command('settings', (ctx) => settingsCommand.handle(ctx));
  bot.command('help', helpCommand);

  // Set commands list in Telegram menu
  bot.telegram.setMyCommands([
    { command: 'start', description: 'Начать работу с ботом' },
    { command: 'subscribe', description: 'Подписаться на обновления игры' },
    { command: 'unsubscribe', description: 'Отписаться от обновлений игры' },
    { command: 'list', description: 'Показать активные подписки' },
    { command: 'settings', description: 'Настройки уведомлений' },
    { command: 'help', description: 'Показать справку' },
  ]);
};
