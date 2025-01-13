import { Module } from '@nestjs/common';
import { GameProvidersController } from './v1/game-providers.controller';
import { GameProvidersService } from './v1/game-providers.service';
import { PrismaModule } from '../../common/modules/prisma/prisma.module';
import { CacheModule } from '../../common/modules/cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule],
  controllers: [GameProvidersController],
  providers: [GameProvidersService],
  exports: [GameProvidersService],
})
export class GameProvidersModule {}
