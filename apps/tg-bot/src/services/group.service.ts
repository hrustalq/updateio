import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/modules/prisma/prisma.service';
import { TelegramGroup } from '@repo/database';

interface CreateGroupDto {
  telegramId: string;
  title: string;
  type: string;
  ownerId: string;
}

interface GroupChat {
  id: number | string;
  title?: string;
  type: string;
}

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateGroup(
    chat: GroupChat,
    ownerId: string,
  ): Promise<TelegramGroup> {
    const existingGroup = await this.prisma.telegramGroup.findUnique({
      where: { telegramId: chat.id.toString() },
    });

    if (existingGroup) {
      return this.updateGroup(existingGroup.id, {
        title: chat.title || existingGroup.title,
      });
    }

    return this.prisma.telegramGroup.create({
      data: {
        telegramId: chat.id.toString(),
        title: chat.title || 'Unnamed Group',
        type: chat.type,
        ownerId,
      },
    });
  }

  async updateGroup(
    groupId: string,
    data: Partial<CreateGroupDto>,
  ): Promise<TelegramGroup> {
    return this.prisma.telegramGroup.update({
      where: { id: groupId },
      data,
    });
  }

  async deactivateGroup(groupId: string): Promise<TelegramGroup> {
    return this.prisma.telegramGroup.update({
      where: { id: groupId },
      data: { isActive: false },
    });
  }

  async addMember(groupId: string, userId: string): Promise<void> {
    await this.prisma.telegramGroup.update({
      where: { id: groupId },
      data: {
        members: {
          connect: { id: userId },
        },
      },
    });
  }

  async removeMember(groupId: string, userId: string): Promise<void> {
    await this.prisma.telegramGroup.update({
      where: { id: groupId },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
    });
  }

  async addAdmin(groupId: string, userId: string): Promise<void> {
    await this.prisma.telegramGroup.update({
      where: { id: groupId },
      data: {
        admins: {
          connect: { id: userId },
        },
      },
    });
  }

  async removeAdmin(groupId: string, userId: string): Promise<void> {
    await this.prisma.telegramGroup.update({
      where: { id: groupId },
      data: {
        admins: {
          disconnect: { id: userId },
        },
      },
    });
  }

  async isGroupAdmin(groupId: string, userId: string): Promise<boolean> {
    const group = await this.prisma.telegramGroup.findFirst({
      where: {
        id: groupId,
        OR: [{ ownerId: userId }, { admins: { some: { id: userId } } }],
      },
    });

    return !!group;
  }

  async canAddSubscription(groupId: string): Promise<boolean> {
    const group = await this.prisma.telegramGroup.findUnique({
      where: { id: groupId },
      include: {
        _count: {
          select: { subscriptions: true },
        },
      },
    });

    if (!group) return false;

    return group._count.subscriptions < group.maxSubscriptions;
  }

  async getGroupsByUser(userId: string): Promise<TelegramGroup[]> {
    return this.prisma.telegramGroup.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { id: userId } } },
          { admins: { some: { id: userId } } },
        ],
        isActive: true,
      },
    });
  }
}
