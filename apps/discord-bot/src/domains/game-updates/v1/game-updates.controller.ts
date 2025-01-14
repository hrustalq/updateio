import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { GameUpdatesService } from './game-updates.service';
import { Public } from '../../../common/decorators/public.decorator';
import { ApiResponse } from '../../../common/decorators/api-response.decorator';
import { ApiTags } from '@nestjs/swagger';
import { GameUpdateDto } from './dto/game-update.dto';

@ApiTags('Game Updates')
@Controller({ path: 'game-updates', version: '1' })
export class GameUpdatesController {
  constructor(private readonly gameUpdatesService: GameUpdatesService) {}

  @Get('fetch-recent')
  @Public()
  @ApiResponse({
    type: GameUpdateDto,
    isArray: true,
    description: 'Fetch recent game updates from a Discord channel',
  })
  async fetchRecentUpdates(
    @Query('channelId') channelId: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<GameUpdateDto[]> {
    return this.gameUpdatesService.fetchRecentUpdates(channelId, limit);
  }
}
