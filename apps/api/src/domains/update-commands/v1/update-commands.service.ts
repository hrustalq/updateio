import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/modules/prisma/prisma.service';
import { CreateUpdateCommandDto } from './dto/create-update-command.dto';
import { UpdateUpdateCommandDto } from './dto/update-update-command.dto';

@Injectable()
export class UpdateCommandsV1Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUpdateCommandDto: CreateUpdateCommandDto) {
    return this.prisma.updateCommand.create({
      data: createUpdateCommandDto,
      include: {
        game: true,
      },
    });
  }

  async findAll() {
    return this.prisma.updateCommand.findMany({
      include: {
        game: true,
      },
    });
  }

  async findOne(id: string) {
    const updateCommand = await this.prisma.updateCommand.findUnique({
      where: { id },
      include: {
        game: true,
      },
    });

    if (!updateCommand) {
      throw new NotFoundException(`Update command with ID "${id}" not found`);
    }

    return updateCommand;
  }

  async findByGame(gameId: string) {
    const updateCommand = await this.prisma.updateCommand.findUnique({
      where: { gameId },
      include: {
        game: true,
      },
    });

    if (!updateCommand) {
      throw new NotFoundException(
        `Update command for game "${gameId}" not found`,
      );
    }

    return updateCommand;
  }

  async update(id: string, updateUpdateCommandDto: UpdateUpdateCommandDto) {
    const updateCommand = await this.prisma.updateCommand.findUnique({
      where: { id },
    });

    if (!updateCommand) {
      throw new NotFoundException(`Update command with ID "${id}" not found`);
    }

    return this.prisma.updateCommand.update({
      where: { id },
      data: updateUpdateCommandDto,
      include: {
        game: true,
      },
    });
  }

  async remove(id: string) {
    const updateCommand = await this.prisma.updateCommand.findUnique({
      where: { id },
    });

    if (!updateCommand) {
      throw new NotFoundException(`Update command with ID "${id}" not found`);
    }

    return this.prisma.updateCommand.delete({
      where: { id },
      include: {
        game: true,
      },
    });
  }
}
