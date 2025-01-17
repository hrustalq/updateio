import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'Array of game IDs to subscribe to',
    example: ['clrk2345600000123jk5678'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  gameIds: string[];

  @ApiProperty({
    description: 'Enable notifications for this subscription',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  notificationsEnabled?: boolean;
}
