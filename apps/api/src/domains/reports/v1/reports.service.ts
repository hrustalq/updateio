import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/modules/prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsV1Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReportDto: CreateReportDto) {
    return this.prisma.report.create({
      data: createReportDto,
      include: {
        user: true,
      },
    });
  }

  async findAll() {
    return this.prisma.report.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID "${id}" not found`);
    }

    return report;
  }

  async findByUser(userId: string) {
    return this.prisma.report.findMany({
      where: { userId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, updateReportDto: UpdateReportDto) {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID "${id}" not found`);
    }

    return this.prisma.report.update({
      where: { id },
      data: updateReportDto,
      include: {
        user: true,
      },
    });
  }

  async remove(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID "${id}" not found`);
    }

    return this.prisma.report.delete({
      where: { id },
      include: {
        user: true,
      },
    });
  }
}
