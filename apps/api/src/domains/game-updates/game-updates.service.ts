import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/modules/prisma/prisma.service';
import { NotificationsV1Service } from '../notifications/v1/notifications.service';
import { CreateGameUpdateDto } from './dto/create-game-update.dto';
import { GameUpdate, Game, NotificationType } from '@repo/database';

@Injectable()
export class GameUpdatesService {
  private readonly logger = new Logger(GameUpdatesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsV1Service,
  ) {}

  async handleDiscordUpdate(
    updateDto: CreateGameUpdateDto,
  ): Promise<GameUpdate> {
    this.logger.log(`Processing game update: ${JSON.stringify(updateDto)}`);

    // Find game by name or external ID
    const game = await this.resolveGame(updateDto.gameName);
    if (!game) {
      this.logger.warn(`Game not found: ${updateDto.gameName}`);
      throw new Error(`Game not found: ${updateDto.gameName}`);
    }

    // Create update record
    const update = await this.prisma.gameUpdate.create({
      data: {
        gameId: game.id,
        version: updateDto.version,
        content: updateDto.content,
      },
      include: {
        game: true,
      },
    });

    // Notify subscribers
    await this.notifySubscribers(update);

    return update;
  }

  private async resolveGame(gameName: string): Promise<Game | null> {
    return this.prisma.game.findFirst({
      where: {
        OR: [{ name: gameName }, { aliases: { has: gameName } }],
      },
    });
  }

  private async notifySubscribers(update: GameUpdate & { game: Game }) {
    const subscribers = await this.prisma.userSubscription.findMany({
      where: {
        gameId: update.gameId,
      },
      include: {
        user: true,
      },
    });

    for (const subscription of subscribers) {
      await this.notificationsService.create({
        userId: subscription.userId,
        gameUpdateId: update.id,
        type: NotificationType.UPDATE,
        content:
          update.content ||
          `Доступна новая версия игры ${update.game.name}: ${update.version && `v${update.version}`}`,
      });
    }
  }
}
