import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/modules/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationType } from '@repo/database';

@Injectable()
export class NotificationsV1Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: createNotificationDto,
      include: {
        user: true,
        gameUpdate: {
          include: {
            game: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.notification.findMany({
      include: {
        user: true,
        gameUpdate: {
          include: {
            game: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: {
        user: true,
        gameUpdate: {
          include: {
            game: true,
          },
        },
      },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID "${id}" not found`);
    }

    return notification;
  }

  async findByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      include: {
        user: true,
        gameUpdate: {
          include: {
            game: true,
          },
        },
      },
    });
  }

  async findByType(type: NotificationType) {
    return this.prisma.notification.findMany({
      where: { type },
      include: {
        user: true,
        gameUpdate: {
          include: {
            game: true,
          },
        },
      },
    });
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID "${id}" not found`);
    }

    return this.prisma.notification.update({
      where: { id },
      data: updateNotificationDto,
      include: {
        user: true,
        gameUpdate: {
          include: {
            game: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID "${id}" not found`);
    }

    return this.prisma.notification.delete({
      where: { id },
      include: {
        user: true,
        gameUpdate: {
          include: {
            game: true,
          },
        },
      },
    });
  }
}
