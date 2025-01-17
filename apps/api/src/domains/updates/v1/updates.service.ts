import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/modules/prisma/prisma.service';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateUpdateDto } from './dto/update-update.dto';
import { SortingQueryDto } from 'src/common/dto/sorting-query.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { GetUpdatesPaginatedItemDto } from './dto/get-updates-paginated-item.dto';
import { Prisma } from '@repo/database';
import { PaginationHelper } from '../../../common/helpers/pagination.helper';

@Injectable()
export class UpdatesV1Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUpdateDto: CreateUpdateDto) {
    return this.prisma.gameUpdate.create({
      data: createUpdateDto,
      include: {
        game: true,
      },
    });
  }

  async findAll(
    { page = 1, limit = 10 }: PaginationQueryDto,
    { sort }: SortingQueryDto<GetUpdatesPaginatedItemDto>,
  ) {
    const orderBy: Prisma.GameOrderByWithRelationInput[] =
      sort?.map(({ field, order }) => ({
        [field]: order.toLowerCase(),
      })) || [];

    const [total, items] = await Promise.all([
      this.prisma.gameUpdate.count(),
      this.prisma.gameUpdate.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          game: true,
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
    const update = await this.prisma.gameUpdate.findUnique({
      where: { id },
      include: {
        game: true,
      },
    });

    if (!update) {
      throw new NotFoundException(`Update with ID "${id}" not found`);
    }

    return update;
  }

  async update(id: string, updateUpdateDto: UpdateUpdateDto) {
    const update = await this.prisma.gameUpdate.findUnique({
      where: { id },
    });

    if (!update) {
      throw new NotFoundException(`Update with ID "${id}" not found`);
    }

    return this.prisma.gameUpdate.update({
      where: { id },
      data: updateUpdateDto,
      include: {
        game: true,
      },
    });
  }

  async remove(id: string) {
    const update = await this.prisma.gameUpdate.findUnique({
      where: { id },
    });

    if (!update) {
      throw new NotFoundException(`Update with ID "${id}" not found`);
    }

    return this.prisma.gameUpdate.delete({
      where: { id },
      include: {
        game: true,
      },
    });
  }

  async findByGame(gameId: string) {
    return this.prisma.gameUpdate.findMany({
      where: { gameId },
      include: {
        game: true,
      },
    });
  }
}
