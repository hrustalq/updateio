import { ApiProperty } from '@nestjs/swagger';
import { GameDto } from '../../../games/v1/dto/game.dto';

export class SubscriptionDto {
  @ApiProperty({
    description: 'The unique identifier of the subscription',
    example: 'clrk2345600000123jk5678',
  })
  id: string;

  @ApiProperty({
    description: 'The user ID who owns the subscription',
    example: 'clrk2345600000123jk5679',
  })
  userId: string;

  @ApiProperty({
    description: 'The game associated with the subscription',
    type: GameDto,
  })
  game: GameDto;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}
