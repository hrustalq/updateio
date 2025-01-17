import { Injectable } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GameUpdatesService } from './game-updates.service';
import { CreateGameUpdateDto } from './dto/create-game-update.dto';

@Injectable()
export class GameUpdatesConsumer {
  constructor(private readonly gameUpdatesService: GameUpdatesService) {}

  @MessagePattern('game.updates')
  async handleGameUpdate(@Payload() updateData: CreateGameUpdateDto) {
    return this.gameUpdatesService.handleDiscordUpdate(updateData);
  }
}
