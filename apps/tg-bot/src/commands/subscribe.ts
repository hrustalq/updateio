import { Context } from 'telegraf';
import { Injectable } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { SubscriptionService } from '../services/subscription.service';

@Injectable()
export class SubscribeCommand {
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

    const message = ctx.message;
    if (!('text' in message)) {
      return ctx.reply('Произошла ошибка: Некорректный формат сообщения');
    }

    // Extract game name from command (e.g., "/subscribe CS:GO" -> "CS:GO")
    const gameName = message.text.split(' ').slice(1).join(' ').trim();

    if (!gameName) {
      return ctx.reply(
        'Пожалуйста, укажите название игры.\nПример: /subscribe CS:GO',
      );
    }

    try {
      // Get or create user
      const user = await this.userService.findOrCreateUser(
        ctx.from.id.toString(),
      );

      // Try to find and subscribe to the game
      const subscription = await this.subscriptionService.subscribeToGame(
        user.id,
        gameName,
      );

      return ctx.reply(
        `✅ Вы успешно подписались на обновления игры ${subscription.game.name}`,
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          // Search for similar games
          const similarGames =
            await this.subscriptionService.searchGames(gameName);

          if (similarGames.length > 0) {
            const gamesList = similarGames
              .map((game) => `• ${game.name}`)
              .join('\n');

            return ctx.reply(
              `❌ Игра "${gameName}" не найдена.\n\nВозможно, вы имели в виду:\n${gamesList}\n\nПопробуйте еще раз с точным названием игры.`,
            );
          }

          return ctx.reply(
            `❌ Игра "${gameName}" не найдена. Пожалуйста, проверьте название и попробуйте снова.`,
          );
        }

        if (error.message.includes('already subscribed')) {
          return ctx.reply('❌ Вы уже подписаны на обновления этой игры.');
        }
      }

      return ctx.reply(
        '❌ Произошла ошибка при подписке. Пожалуйста, попробуйте позже.',
      );
    }
  }
}
