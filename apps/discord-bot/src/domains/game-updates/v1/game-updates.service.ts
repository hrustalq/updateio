import { Injectable, Logger } from '@nestjs/common';
import { DiscordService } from '../../../common/modules/discord/discord.service';
import { GameUpdateDto } from './dto/game-update.dto';

@Injectable()
export class GameUpdatesService {
  private readonly logger = new Logger(GameUpdatesService.name);

  constructor(private readonly discordService: DiscordService) {}

  async fetchRecentUpdates(
    channelId: string,
    limit: number,
  ): Promise<GameUpdateDto[]> {
    this.logger.log(
      `Fetching ${limit} recent updates from channel ${channelId}`,
    );
    return this.discordService.fetchRecentMessages(channelId, limit);
  }
}
