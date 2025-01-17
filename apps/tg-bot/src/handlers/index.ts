import { Telegraf } from 'telegraf';
import { TextMessageContext } from '../types';
import { GroupHandler } from '../domains/groups/handlers/group.handler';

export const setupHandlers = (bot: Telegraf, groupHandler: GroupHandler) => {
  // Handle text messages
  bot.on('text', async (ctx: TextMessageContext) => {
    const text = ctx.message.text.toLowerCase();

    // If message starts with /, it's a command and should be handled by command handlers
    if (text.startsWith('/')) {
      return;
    }

    // Handle regular messages
    await ctx.reply(
      'Используйте команды для взаимодействия с ботом. Отправьте /help для получения списка команд.',
    );
  });

  // Handle other message types
  bot.on('message', async (ctx) => {
    if ('text' in ctx.message) return; // Text messages are handled above
    await ctx.reply(
      'Я понимаю только текстовые сообщения. Отправьте /help для получения списка команд.',
    );
  });

  // Group events
  bot.on('new_chat_members', (ctx) => {
    const newMembers = ctx.message.new_chat_members;
    const botWasAdded = newMembers.some(
      (member) => member.id === ctx.botInfo.id,
    );

    if (botWasAdded) {
      return groupHandler.onBotAdded(ctx);
    }
    return groupHandler.onNewMember(ctx);
  });

  bot.on('left_chat_member', (ctx) => {
    if (ctx.message.left_chat_member.id === ctx.botInfo.id) {
      return groupHandler.onBotRemoved(ctx);
    }
    return groupHandler.onMemberLeft(ctx);
  });
};
