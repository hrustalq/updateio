import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'ID of the user who subscribes',
    example: 'clrk2345600000123jk5679',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'ID of the game to subscribe to',
    example: 'clrk2345600000123jk5680',
  })
  @IsString()
  @IsNotEmpty()
  gameId: string;
}
