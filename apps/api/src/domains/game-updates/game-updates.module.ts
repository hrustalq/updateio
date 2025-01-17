import { Module } from '@nestjs/common';
import { GameUpdatesService } from './game-updates.service';
import { GameUpdatesController } from './game-updates.controller';
import { PrismaModule } from '../../common/modules/prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { GameUpdatesConsumer } from './game-updates.consumer';

@Module({
  imports: [PrismaModule, NotificationsModule],
  providers: [GameUpdatesService, GameUpdatesConsumer],
  controllers: [GameUpdatesController],
  exports: [GameUpdatesService],
})
export class GameUpdatesModule {}
