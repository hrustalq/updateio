import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/modules/prisma/prisma.service';
import { CreateGameProviderDto } from './dto/create-game-provider.dto';
import { UpdateGameProviderDto } from './dto/update-game-provider.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { SortingQueryDto } from '../../../common/dto/sorting-query.dto';
import { PaginationHelper } from '../../../common/helpers/pagination.helper';
import { GameProvider } from '@repo/database';

@Injectable()
export class GameProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createGameProviderDto: CreateGameProviderDto,
  ): Promise<GameProvider> {
    return this.prisma.gameProvider.create({
      data: createGameProviderDto,
    });
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
    sortingQuery: SortingQueryDto<GameProvider>,
  ) {
    const { page, limit } = paginationQuery;
    const { sort } = sortingQuery;

    const total = await this.prisma.gameProvider.count();
    const { start } = PaginationHelper.getPageOffsets(page, limit);

    const items = await this.prisma.gameProvider.findMany({
      skip: start,
      take: limit,
      orderBy: sort?.map(({ field, order }) => ({ [field]: order })),
      include: {
        _count: {
          select: { games: true },
        },
      },
    });

    return PaginationHelper.paginate(items, { page, limit, total, sort });
  }

  async findOne(id: string): Promise<GameProvider> {
    const gameProvider = await this.prisma.gameProvider.findUnique({
      where: { id },
      include: {
        _count: {
          select: { games: true },
        },
      },
    });

    if (!gameProvider) {
      throw new NotFoundException(`Game provider with ID "${id}" not found`);
    }

    return gameProvider;
  }

  async update(
    id: string,
    updateGameProviderDto: UpdateGameProviderDto,
  ): Promise<GameProvider> {
    await this.findOne(id);

    return this.prisma.gameProvider.update({
      where: { id },
      data: updateGameProviderDto,
    });
  }

  async remove(id: string): Promise<GameProvider> {
    await this.findOne(id);

    return this.prisma.gameProvider.delete({
      where: { id },
    });
  }
}
