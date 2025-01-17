import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/modules/prisma/prisma.service';
import { GroupService } from '../../../services/group.service';
import { GroupInfo, GroupSettings, GroupMember } from '../dtos/group.dto';

@Injectable()
export class GroupAdminService {
  private readonly logger = new Logger(GroupAdminService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly groupService: GroupService,
  ) {}

  async getGroupInfo(groupId: string): Promise<GroupInfo | null> {
    const group = await this.prisma.telegramGroup.findUnique({
      where: { id: groupId },
      include: {
        members: true,
        admins: true,
        _count: {
          select: { subscriptions: true },
        },
      },
    });

    if (!group) return null;

    const members = [...group.members, ...group.admins].map(
      (user) =>
        ({
          userId: user.id,
          role:
            user.id === group.ownerId
              ? 'OWNER'
              : group.admins.some((a) => a.id === user.id)
                ? 'ADMIN'
                : 'MEMBER',
          canManageSubscriptions:
            user.id === group.ownerId ||
            group.admins.some((a) => a.id === user.id),
          canManageMembers:
            user.id === group.ownerId ||
            group.admins.some((a) => a.id === user.id),
          canManageSettings: user.id === group.ownerId,
        }) as GroupMember,
    );

    return {
      id: group.id,
      telegramId: group.telegramId,
      title: group.title,
      type: group.type,
      isActive: group.isActive,
      settings: {
        maxSubscriptions: group.maxSubscriptions,
        notificationsEnabled: true,
        allowMemberSubscribe: true,
        allowMemberUnsubscribe: true,
        timezone: 'UTC',
      },
      members,
      subscriptionCount: group._count.subscriptions,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    } as GroupInfo;
  }

  async updateGroupSettings(
    groupId: string,
    settings: Partial<GroupSettings>,
  ): Promise<GroupInfo> {
    const group = await this.prisma.telegramGroup.update({
      where: { id: groupId },
      data: {
        maxSubscriptions: settings.maxSubscriptions,
      },
      include: {
        members: true,
        admins: true,
        _count: {
          select: { subscriptions: true },
        },
      },
    });

    const members = [...group.members, ...group.admins].map(
      (user) =>
        ({
          userId: user.id,
          role:
            user.id === group.ownerId
              ? 'OWNER'
              : group.admins.some((a) => a.id === user.id)
                ? 'ADMIN'
                : 'MEMBER',
          canManageSubscriptions:
            user.id === group.ownerId ||
            group.admins.some((a) => a.id === user.id),
          canManageMembers:
            user.id === group.ownerId ||
            group.admins.some((a) => a.id === user.id),
          canManageSettings: user.id === group.ownerId,
        }) as GroupMember,
    );

    return {
      id: group.id,
      telegramId: group.telegramId,
      title: group.title,
      type: group.type,
      isActive: group.isActive,
      settings: {
        maxSubscriptions: group.maxSubscriptions,
        notificationsEnabled: true,
        allowMemberSubscribe: true,
        allowMemberUnsubscribe: true,
        timezone: 'UTC',
      },
      members,
      subscriptionCount: group._count.subscriptions,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    } as GroupInfo;
  }

  async updateMemberRole(
    groupId: string,
    userId: string,
    role: 'ADMIN' | 'MEMBER',
  ): Promise<void> {
    if (role === 'ADMIN') {
      await this.groupService.addAdmin(groupId, userId);
    } else {
      await this.groupService.removeAdmin(groupId, userId);
    }
  }

  async kickMember(groupId: string, userId: string): Promise<void> {
    const group = await this.prisma.telegramGroup.findUnique({
      where: { id: groupId },
      select: { ownerId: true },
    });

    if (!group || group.ownerId === userId) {
      throw new Error('Cannot kick group owner');
    }

    await this.groupService.removeMember(groupId, userId);
    await this.groupService.removeAdmin(groupId, userId);
  }

  async getGroupStats(groupId: string) {
    const group = await this.prisma.telegramGroup.findUnique({
      where: { id: groupId },
      include: {
        _count: {
          select: {
            members: true,
            admins: true,
            subscriptions: true,
          },
        },
        subscriptions: {
          include: {
            game: true,
          },
        },
      },
    });

    if (!group) return null;

    return {
      memberCount: group._count.members,
      adminCount: group._count.admins,
      subscriptionCount: group._count.subscriptions,
      games: group.subscriptions.map((sub) => ({
        id: sub.game.id,
        name: sub.game.name,
        provider: sub.game.providerId,
      })),
    };
  }
}
