import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionDto {
  @ApiProperty({
    description: 'The unique identifier of the subscription',
    example: 'clrk2345600000123jk5678',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the user who subscribed',
    example: 'clrk2345600000123jk5679',
  })
  userId: string;

  @ApiProperty({
    description: 'ID of the game subscribed to',
    example: 'clrk2345600000123jk5680',
  })
  gameId: string;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}
