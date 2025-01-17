import { Module } from '@nestjs/common';
import { GroupCommand } from './commands/group.command';
import { GroupAdminService } from './services/group-admin.service';
import { GroupController } from './controllers/group.controller';
import { GroupHandler } from './handlers/group.handler';
import { PrismaModule } from '../../common/modules/prisma/prisma.module';
import { GroupService } from '../../services/group.service';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [PrismaModule, ServicesModule],
  controllers: [GroupController],
  providers: [GroupCommand, GroupAdminService, GroupHandler, GroupService],
  exports: [GroupService],
})
export class GroupModule {}
