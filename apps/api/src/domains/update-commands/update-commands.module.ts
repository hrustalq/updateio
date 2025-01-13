import { Module } from '@nestjs/common';
import { UpdateCommandsV1Controller } from './v1/update-commands.controller';
import { UpdateCommandsV1Service } from './v1/update-commands.service';

@Module({
  controllers: [UpdateCommandsV1Controller],
  providers: [UpdateCommandsV1Service],
  exports: [UpdateCommandsV1Service],
})
export class UpdateCommandsModule {}
