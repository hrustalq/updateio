import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/modules/prisma/prisma.service';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateUpdateDto } from './dto/update-update.dto';

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

  async findAll() {
    return this.prisma.gameUpdate.findMany({
      include: {
        game: true,
      },
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
