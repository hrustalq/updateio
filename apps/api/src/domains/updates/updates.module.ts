import { Module } from '@nestjs/common';
import { UpdatesV1Controller } from './v1/updates.controller';
import { UpdatesV1Service } from './v1/updates.service';

@Module({
  controllers: [UpdatesV1Controller],
  providers: [UpdatesV1Service],
  exports: [UpdatesV1Service],
})
export class UpdatesModule {}
