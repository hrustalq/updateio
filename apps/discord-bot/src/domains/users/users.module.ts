import { Module } from '@nestjs/common';
import { UsersService } from './v1/users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
