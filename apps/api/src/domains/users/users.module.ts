import { Module } from '@nestjs/common';
import { UsersV1Controller } from './v1/users.controller';
import { UsersV1Service } from './v1/users.service';

@Module({
  controllers: [UsersV1Controller],
  providers: [UsersV1Service],
  exports: [UsersV1Service],
})
export class UsersModule {}
