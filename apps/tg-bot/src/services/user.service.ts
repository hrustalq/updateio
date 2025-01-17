import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/modules/prisma/prisma.service';
import { User } from '@repo/database';
import { User as TelegramUser } from 'telegraf/types';

interface UpdateUserProfileDto {
  username?: string;
  firstName?: string;
  lastName?: string;
  languageCode?: string;
  isPremium?: boolean;
  isBot?: boolean;
  photoUrl?: string;
  smallPhotoUrl?: string;
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateUser(
    telegramId: string,
    telegramUser?: TelegramUser,
  ): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { telegramId },
    });

    if (existingUser) {
      // Update user profile if Telegram data is provided
      if (telegramUser) {
        return this.updateUserProfile(
          existingUser.id,
          this.mapTelegramUserToDto(telegramUser),
        );
      }
      return existingUser;
    }

    // Create new user with Telegram data if provided
    const userData = telegramUser
      ? this.mapTelegramUserToDto(telegramUser)
      : {};

    return this.prisma.user.create({
      data: {
        telegramId,
        role: 'USER',
        lastActivity: new Date(),
        ...userData,
      },
    });
  }

  async getUser(telegramId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { telegramId },
    });
  }

  async updateUserProfile(
    userId: string,
    data: UpdateUserProfileDto,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        lastActivity: new Date(),
      },
    });
  }

  async updateLastActivity(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastActivity: new Date() },
    });
  }

  async updateNotificationSettings(
    userId: string,
    enabled: boolean,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { notificationsEnabled: enabled },
    });
  }

  async canJoinGroup(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            ownedGroups: true,
            memberGroups: true,
            adminGroups: true,
          },
        },
      },
    });

    if (!user) return false;

    const totalGroups =
      user._count.ownedGroups +
      user._count.memberGroups +
      user._count.adminGroups;

    return totalGroups < user.maxGroups;
  }

  async canAddSubscription(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: { subscriptions: true },
        },
      },
    });

    if (!user) return false;

    return user._count.subscriptions < user.maxSubscriptions;
  }

  private mapTelegramUserToDto(user: TelegramUser): UpdateUserProfileDto {
    return {
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      languageCode: user.language_code,
      isPremium: user.is_premium || false,
      isBot: user.is_bot,
    };
  }
}
