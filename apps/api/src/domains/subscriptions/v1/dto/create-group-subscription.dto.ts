import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateGroupSubscriptionDto {
  @ApiProperty({
    description: 'Array of game IDs to subscribe to',
    example: ['clrk2345600000123jk5678'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  gameIds: string[];
}
