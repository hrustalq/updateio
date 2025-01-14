import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/modules/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByApiKey(apiKey: string) {
    return this.prisma.user.findFirst({
      where: {
        apiKey,
      },
    });
  }
}
