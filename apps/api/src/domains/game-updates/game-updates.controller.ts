import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GameUpdatesService } from './game-updates.service';
import { CreateGameUpdateDto } from './dto/create-game-update.dto';
import { Auth, AuthType } from '../../common/decorators/auth.decorator';
import { ApiResponse } from '../../common/decorators/api-response.decorator';
import { GameUpdateDto } from './dto/game-update.dto';

@ApiTags('Game Updates')
@Controller({
  path: 'game-updates',
  version: '1',
})
export class GameUpdatesController {
  constructor(private readonly gameUpdatesService: GameUpdatesService) {}

  @Post('discord')
  @Auth({ type: AuthType.Bearer })
  @ApiOperation({ summary: 'Handle game update from Discord' })
  @ApiResponse({
    description: 'Game update processed successfully',
    type: GameUpdateDto,
  })
  async handleDiscordUpdate(@Body() updateDto: CreateGameUpdateDto) {
    return this.gameUpdatesService.handleDiscordUpdate(updateDto);
  }
}
