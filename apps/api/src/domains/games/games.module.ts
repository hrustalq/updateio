import { Module } from '@nestjs/common';
import { GamesV1Controller } from './v1/games.controller';
import { GamesV1Service } from './v1/games.service';

@Module({
  controllers: [GamesV1Controller],
  providers: [GamesV1Service],
  exports: [GamesV1Service],
})
export class GamesModule {}
