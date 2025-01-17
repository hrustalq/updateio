import { Context } from 'telegraf';
import { Injectable } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { SubscriptionService } from '../services/subscription.service';

@Injectable()
export class ListCommand {
  constructor(
    private readonly userService: UserService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async handle(ctx: Context) {
    if (!ctx.from) {
      return ctx.reply(
        'Произошла ошибка: Не удалось идентифицировать пользователя',
      );
    }

    try {
      const user = await this.userService.findOrCreateUser(
        ctx.from.id.toString(),
      );
      const subscriptions = await this.subscriptionService.listSubscriptions(
        user.id,
      );

      if (subscriptions.length === 0) {
        return ctx.reply(
          '📝 У вас нет активных подписок.\n\nИспользуйте /subscribe <игра> для подписки на обновления.',
        );
      }

      const message = [
        '📋 Ваши активные подписки:\n',
        ...subscriptions.map((sub, index) => `${index + 1}. ${sub.game.name}`),
        '\nДля отписки используйте /unsubscribe <название игры>',
        'Для настройки уведомлений используйте /settings',
      ].join('\n');

      return ctx.reply(message);
    } catch (error) {
      return ctx.reply(
        '❌ Произошла ошибка при получении списка подписок. Пожалуйста, попробуйте позже.',
      );
    }
  }
}
