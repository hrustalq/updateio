import { Context } from 'telegraf';
import { Injectable } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { SubscriptionService } from '../services/subscription.service';

@Injectable()
export class UnsubscribeCommand {
  constructor(
    private readonly userService: UserService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async handle(ctx: Context) {
    if (!ctx.from) {
      return ctx.reply('Error: Could not identify user');
    }

    const message = ctx.message;
    if (!('text' in message)) {
      return ctx.reply('Error: Invalid message format');
    }

    // Extract game name from command (e.g., "/unsubscribe CS:GO" -> "CS:GO")
    const gameName = message.text.split(' ').slice(1).join(' ').trim();

    if (!gameName) {
      return ctx.reply(
        'Пожалуйста, укажите название игры.\nПример: /unsubscribe CS:GO',
      );
    }

    try {
      // Get or create user
      const user = await this.userService.findOrCreateUser(
        ctx.from.id.toString(),
      );

      // Try to find and unsubscribe from the game
      await this.subscriptionService.unsubscribeFromGame(user.id, gameName);

      return ctx.reply(
        `✅ Вы успешно отписались от обновлений игры ${gameName}`,
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
      }

      return ctx.reply(
        '❌ Произошла ошибка при отписке. Пожалуйста, попробуйте позже.',
      );
    }
  }
}
