import { Module } from '@nestjs/common';
import { GamesV1Controller } from './v1/games.controller';
import { GamesV1Service } from './v1/games.service';
import { MinioModule } from '../../common/modules/minio/minio.module';

@Module({
  imports: [MinioModule],
  controllers: [GamesV1Controller],
  providers: [GamesV1Service],
})
export class GamesModule {}
