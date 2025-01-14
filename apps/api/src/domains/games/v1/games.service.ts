import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/modules/prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { SortingQueryDto } from '../../../common/dto/sorting-query.dto';
import { Game } from '@repo/database';
import { PaginationHelper } from '../../../common/helpers/pagination.helper';
import { Prisma } from '@repo/database';

@Injectable()
export class GamesV1Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGameDto: CreateGameDto & { imageUrl?: string }) {
    const { gameProviderId, ...rest } = createGameDto;
    return this.prisma.game.create({
      data: {
        ...rest,
        providerId: gameProviderId,
      },
      include: {
        provider: true,
      },
    });
  }

  async findAll(
    { page = 1, limit = 10 }: PaginationQueryDto,
    { sort }: SortingQueryDto<Game>,
  ) {
    const orderBy: Prisma.GameOrderByWithRelationInput[] =
      sort?.map(({ field, order }) => ({
        [field]: order.toLowerCase(),
      })) || [];

    const [total, items] = await Promise.all([
      this.prisma.game.count(),
      this.prisma.game.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          provider: true,
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

  async findOne(id: string) {
    const game = await this.prisma.game.findUnique({
      where: { id },
      include: {
        provider: true,
      },
    });

    if (!game) {
      throw new NotFoundException(`Game with ID "${id}" not found`);
    }

    return game;
  }

  async update(
    id: string,
    updateGameDto: UpdateGameDto & { imageUrl?: string },
  ) {
    const { gameProviderId, ...rest } = updateGameDto;
    const game = await this.prisma.game.findUnique({
      where: { id },
    });

    if (!game) {
      throw new NotFoundException(`Game with ID "${id}" not found`);
    }

    return this.prisma.game.update({
      where: { id },
      data: {
        ...rest,
        ...(gameProviderId && { providerId: gameProviderId }),
      },
      include: {
        provider: true,
      },
    });
  }

  async remove(id: string) {
    const game = await this.prisma.game.findUnique({
      where: { id },
    });

    if (!game) {
      throw new NotFoundException(`Game with ID "${id}" not found`);
    }

    return this.prisma.game.delete({
      where: { id },
      include: {
        provider: true,
      },
    });
  }

  async findByProvider(providerId: string) {
    return this.prisma.game.findMany({
      where: { providerId },
      include: {
        provider: true,
      },
    });
  }
}
