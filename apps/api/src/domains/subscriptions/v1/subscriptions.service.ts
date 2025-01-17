import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/modules/prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { SortingQueryDto } from '../../../common/dto/sorting-query.dto';
import { PaginationHelper } from '../../../common/helpers/pagination.helper';
import { SubscriptionDto } from './dto/subscription.dto';
import { Prisma } from '@repo/database';
import { CreateGroupSubscriptionDto } from './dto/create-group-subscription.dto';
import { GroupSubscriptionDto } from './dto/group-subscription.dto';

@Injectable()
export class SubscriptionsV1Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, { gameIds }: CreateSubscriptionDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptions: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    if (user.subscriptions.length + gameIds.length > user.maxSubscriptions) {
      throw new ForbiddenException(
        `User cannot have more than ${user.maxSubscriptions} subscriptions`,
      );
    }

    const subscriptions = await Promise.all(
      gameIds.map((gameId) =>
        this.prisma.userSubscription.create({
          data: {
            userId,
            gameId,
          },
          include: {
            game: {
              include: {
                provider: true,
              },
            },
          },
        }),
      ),
    );

    return subscriptions;
  }

  async findUserSubscriptions(
    userId: string,
    { page, limit }: PaginationQueryDto,
    { sort }: SortingQueryDto<SubscriptionDto>,
  ) {
    const orderBy: Prisma.UserSubscriptionOrderByWithRelationInput[] =
      sort?.map(({ field, order }) => ({
        [field]: order.toLowerCase(),
      })) || [];

    const [total, items] = await Promise.all([
      this.prisma.userSubscription.count({
        where: { userId },
      }),
      this.prisma.userSubscription.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          game: {
            include: {
              provider: true,
            },
          },
        },
      }),
    ]);

    return PaginationHelper.paginate(items, {
      page,
      limit,
      total,
      sort,
    });
  }

  async remove(userId: string, id: string) {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { id },
      include: { game: true },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID "${id}" not found`);
    }

    if (subscription.userId !== userId) {
      throw new ForbiddenException(
        'Cannot delete subscription of another user',
      );
    }

    return this.prisma.userSubscription.delete({
      where: { id },
      include: {
        game: {
          include: {
            provider: true,
          },
        },
      },
    });
  }

  async removeAdmin(id: string) {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { id },
      include: { game: true },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID "${id}" not found`);
    }

    return this.prisma.userSubscription.delete({
      where: { id },
      include: {
        game: {
          include: {
            provider: true,
          },
        },
      },
    });
  }

  async createGroupSubscription(
    userId: string,
    groupId: string,
    { gameIds }: CreateGroupSubscriptionDto,
  ) {
    const group = await this.prisma.telegramGroup.findUnique({
      where: { id: groupId },
      include: {
        subscriptions: true,
        admins: true,
      },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID "${groupId}" not found`);
    }

    // Check if user is admin of the group
    if (!group.admins.some((admin) => admin.id === userId)) {
      throw new ForbiddenException(
        'Only group admins can manage subscriptions',
      );
    }

    if (group.subscriptions.length + gameIds.length > group.maxSubscriptions) {
      throw new ForbiddenException(
        `Group cannot have more than ${group.maxSubscriptions} subscriptions`,
      );
    }

    const subscriptions = await Promise.all(
      gameIds.map((gameId) =>
        this.prisma.groupSubscription.create({
          data: {
            groupId,
            gameId,
          },
          include: {
            game: {
              include: {
                provider: true,
              },
            },
          },
        }),
      ),
    );

    return subscriptions;
  }

  async findGroupSubscriptions(
    userId: string,
    groupId: string,
    { page, limit }: PaginationQueryDto,
    { sort }: SortingQueryDto<GroupSubscriptionDto>,
  ) {
    const group = await this.prisma.telegramGroup.findUnique({
      where: { id: groupId },
      include: { members: true },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID "${groupId}" not found`);
    }

    // Check if user is member of the group
    if (!group.members.some((member) => member.id === userId)) {
      throw new ForbiddenException('Only group members can view subscriptions');
    }

    const orderBy: Prisma.GroupSubscriptionOrderByWithRelationInput[] =
      sort?.map(({ field, order }) => ({
        [field]: order.toLowerCase(),
      })) || [];

    const [total, items] = await Promise.all([
      this.prisma.groupSubscription.count({
        where: { groupId },
      }),
      this.prisma.groupSubscription.findMany({
        where: { groupId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          game: {
            include: {
              provider: true,
            },
          },
        },
      }),
    ]);

    return PaginationHelper.paginate(items, {
      page,
      limit,
      total,
      sort,
    });
  }

  async removeGroupSubscription(userId: string, groupId: string, id: string) {
    const group = await this.prisma.telegramGroup.findUnique({
      where: { id: groupId },
      include: { admins: true },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID "${groupId}" not found`);
    }

    // Check if user is admin of the group
    if (!group.admins.some((admin) => admin.id === userId)) {
      throw new ForbiddenException(
        'Only group admins can manage subscriptions',
      );
    }

    const subscription = await this.prisma.groupSubscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID "${id}" not found`);
    }

    if (subscription.groupId !== groupId) {
      throw new ForbiddenException(
        'Subscription does not belong to this group',
      );
    }

    return this.prisma.groupSubscription.delete({
      where: { id },
      include: {
        game: {
          include: {
            provider: true,
          },
        },
      },
    });
  }

  async findUserSubscriptionsAdmin(
    userId: string,
    { page, limit }: PaginationQueryDto,
    { sort }: SortingQueryDto<SubscriptionDto>,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const orderBy: Prisma.UserSubscriptionOrderByWithRelationInput[] =
      sort?.map(({ field, order }) => ({
        [field]: order.toLowerCase(),
      })) || [];

    const [total, items] = await Promise.all([
      this.prisma.userSubscription.count({
        where: { userId },
      }),
      this.prisma.userSubscription.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          game: {
            include: {
              provider: true,
            },
          },
        },
      }),
    ]);

    return PaginationHelper.paginate(items, {
      page,
      limit,
      total,
      sort,
    });
  }

  async createUserSubscriptionsAdmin(
    userId: string,
    { gameIds }: CreateSubscriptionDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptions: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    if (user.subscriptions.length + gameIds.length > user.maxSubscriptions) {
      throw new ForbiddenException(
        `User cannot have more than ${user.maxSubscriptions} subscriptions`,
      );
    }

    const subscriptions = await Promise.all(
      gameIds.map((gameId) =>
        this.prisma.userSubscription.create({
          data: {
            userId,
            gameId,
          },
          include: {
            game: {
              include: {
                provider: true,
              },
            },
          },
        }),
      ),
    );

    return subscriptions;
  }

  async removeSubscriptionAdmin(id: string) {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID "${id}" not found`);
    }

    return this.prisma.userSubscription.delete({
      where: { id },
      include: {
        game: {
          include: {
            provider: true,
          },
        },
      },
    });
  }
}
