import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/modules/prisma/prisma.service';
import { Game, UserSubscription } from '@repo/database';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribeToGame(userId: string, gameName: string) {
    // Find game by name (case-insensitive)
    const game = await this.prisma.game.findFirst({
      where: {
        name: {
          contains: gameName,
          mode: 'insensitive',
        },
      },
    });

    if (!game) {
      throw new Error(`Game "${gameName}" not found`);
    }

    // Check if subscription already exists
    const existingSubscription = await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        gameId: game.id,
      },
    });

    if (existingSubscription) {
      throw new Error(`You are already subscribed to ${game.name}`);
    }

    // Create new subscription
    return this.prisma.userSubscription.create({
      data: {
        userId,
        gameId: game.id,
      },
      include: {
        game: true,
      },
    });
  }

  async unsubscribeFromGame(userId: string, gameName: string): Promise<void> {
    // Find game by name
    const game = await this.prisma.game.findFirst({
      where: {
        name: {
          contains: gameName,
          mode: 'insensitive',
        },
      },
    });

    if (!game) {
      throw new Error(`Game "${gameName}" not found`);
    }

    // Delete subscription if exists
    await this.prisma.userSubscription.deleteMany({
      where: {
        userId,
        gameId: game.id,
      },
    });
  }

  async listSubscriptions(
    userId: string,
  ): Promise<(UserSubscription & { game: Game })[]> {
    return this.prisma.userSubscription.findMany({
      where: { userId },
      include: {
        game: true,
      },
    });
  }

  async searchGames(query: string): Promise<Game[]> {
    return this.prisma.game.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 10, // Limit results
    });
  }
}
