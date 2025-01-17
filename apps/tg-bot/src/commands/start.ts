import { Context } from 'telegraf';
import { UserService } from '../services/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StartCommand {
  constructor(private readonly userService: UserService) {}

  async handle(ctx: Context) {
    if (!ctx.from) {
      return ctx.reply(
        'Произошла ошибка: Не удалось идентифицировать пользователя',
      );
    }

    // Register or get existing user
    await this.userService.findOrCreateUser(ctx.from.id.toString());

    const message = `
🎮 *UpdateIO Bot*

Автоматическое отслеживание и установка обновлений для ваших любимых игр\\.

*Возможности:*
• Мгновенные уведомления об обновлениях
• Автоматическая установка обновлений
• Подписки на несколько игр
• Гибкая настройка уведомлений
• Подробная информация об обновлениях

*Команды:*
/subscribe \\<игра\\> \\- Подписаться на обновления
/unsubscribe \\<игра\\> \\- Отписаться от обновлений
/list \\- Показать активные подписки
/settings \\- Настройки уведомлений
/help \\- Справка

🌐 Веб\\-сайт: [updateio\\.dev](https://updateio\\.dev)

Чтобы начать, используйте команду /subscribe с названием игры\\.
`;

    await ctx.replyWithMarkdownV2(message);
  }
}
