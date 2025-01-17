import { ApiProperty } from '@nestjs/swagger';
import { UpdateDto } from './update.dto';
import { GameDto } from 'src/domains/games/v1/dto/game.dto';

export class GetUpdatesPaginatedItemDto extends UpdateDto {
  @ApiProperty({
    description: 'Game',
    type: GameDto,
  })
  game: GameDto;
}
