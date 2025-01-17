import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { GameUpdate } from '@repo/database';

export class CreateGameUpdateDto
  implements Omit<GameUpdate, 'id' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty({
    description: 'Name of the game',
    example: 'Counter-Strike 2',
  })
  @IsString()
  @IsNotEmpty()
  gameName: string;

  @ApiProperty({
    description: 'Version of the update',
    example: '1.38.2.1',
  })
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiProperty({
    description: 'Content/description of the update',
    example: 'Added new map, fixed bugs...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'URL to the update announcement',
    example: 'https://discord.com/channels/123/456/789',
  })
  @IsString()
  @IsOptional()
  sourceUrl?: string;

  @IsString()
  @IsNotEmpty()
  gameId: string;
}
