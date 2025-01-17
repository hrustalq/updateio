import { Module } from '@nestjs/common';
import { PrismaModule } from '../common/modules/prisma/prisma.module';
import { UserService } from './user.service';
import { SubscriptionService } from './subscription.service';
import { GroupService } from './group.service';

@Module({
  imports: [PrismaModule],
  providers: [UserService, SubscriptionService, GroupService],
  exports: [UserService, SubscriptionService, GroupService],
})
export class ServicesModule {}
