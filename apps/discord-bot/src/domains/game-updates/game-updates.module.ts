import { Module } from '@nestjs/common';
import { GameUpdatesController } from './v1/game-updates.controller';
import { GameUpdatesService } from './v1/game-updates.service';
import { DiscordModule } from '../../common/modules/discord/discord.module';

@Module({
  imports: [DiscordModule],
  controllers: [GameUpdatesController],
  providers: [GameUpdatesService],
})
export class GameUpdatesModule {}
