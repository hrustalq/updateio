import { Module } from '@nestjs/common';
import { GameProvidersController } from './v1/game-providers.controller';
import { GameProvidersService } from './v1/game-providers.service';
import { MinioModule } from '../../common/modules/minio/minio.module';

@Module({
  imports: [MinioModule],
  controllers: [GameProvidersController],
  providers: [GameProvidersService],
})
export class GameProvidersModule {}
