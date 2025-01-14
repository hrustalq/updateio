import { IsString, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GameUpdateDto {
  @ApiProperty({
    description: 'Name of the game',
    example: 'Counter-Strike 2',
  })
  @IsString()
  game: string;

  @ApiProperty({
    description: 'Title of the update',
    example: 'Counter-Strike 2 Update',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Content/description of the update',
    example: 'Fixed various minor visual bugs and gaps in world',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Timestamp of the update',
    example: new Date().toISOString(),
  })
  @IsDate()
  timestamp: Date;

  @ApiProperty({
    description: 'Discord message ID',
    example: '1234567890',
  })
  @IsString()
  messageId: string;

  @ApiProperty({
    description: 'Discord channel ID',
    example: '1234567890',
  })
  @IsString()
  channelId: string;
}

export class FetchUpdatesQueryDto {
  @ApiProperty({
    description: 'Discord channel ID to fetch updates from',
    example: '1234567890',
  })
  @IsString()
  channelId: string;

  @ApiProperty({
    description: 'Maximum number of updates to fetch',
    example: 10,
    required: false,
    default: 10,
  })
  @IsOptional()
  limit?: number;
}
