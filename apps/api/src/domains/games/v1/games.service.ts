import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/modules/prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GamesV1Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGameDto: CreateGameDto) {
    return this.prisma.game.create({
      data: createGameDto,
      include: {
        provider: true,
      },
    });
  }

  async findAll() {
    return this.prisma.game.findMany({
      include: {
        provider: true,
      },
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

  async update(id: string, updateGameDto: UpdateGameDto) {
    const game = await this.prisma.game.findUnique({
      where: { id },
    });

    if (!game) {
      throw new NotFoundException(`Game with ID "${id}" not found`);
    }

    return this.prisma.game.update({
      where: { id },
      data: updateGameDto,
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
