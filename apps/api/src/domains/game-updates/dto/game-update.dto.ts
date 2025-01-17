import { ApiProperty } from '@nestjs/swagger';

import { GameUpdate } from '@repo/database';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { GameDto } from 'src/domains/games/v1/dto/game.dto';

export class GameUpdateDto
  implements Omit<GameUpdate, 'createdAt' | 'updatedAt'>
{
  @ApiProperty()
  id: string;

  @ApiProperty()
  gameId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  version: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    type: GameDto,
  })
  game: GameDto;
}
