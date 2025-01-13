import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/modules/prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsV1Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    return this.prisma.userSubscription.create({
      data: createSubscriptionDto,
      include: {
        user: true,
        game: true,
      },
    });
  }

  async findAll() {
    return this.prisma.userSubscription.findMany({
      include: {
        user: true,
        game: true,
      },
    });
  }

  async findOne(id: string) {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { id },
      include: {
        user: true,
        game: true,
      },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID "${id}" not found`);
    }

    return subscription;
  }

  async findByUser(userId: string) {
    return this.prisma.userSubscription.findMany({
      where: { userId },
      include: {
        user: true,
        game: true,
      },
    });
  }

  async findByGame(gameId: string) {
    return this.prisma.userSubscription.findMany({
      where: { gameId },
      include: {
        user: true,
        game: true,
      },
    });
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID "${id}" not found`);
    }

    return this.prisma.userSubscription.update({
      where: { id },
      data: updateSubscriptionDto,
      include: {
        user: true,
        game: true,
      },
    });
  }

  async remove(id: string) {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID "${id}" not found`);
    }

    return this.prisma.userSubscription.delete({
      where: { id },
      include: {
        user: true,
        game: true,
      },
    });
  }
}
