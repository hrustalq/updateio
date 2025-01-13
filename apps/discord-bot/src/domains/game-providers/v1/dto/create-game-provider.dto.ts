import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, MinLength } from 'class-validator';
import { GameProvider as GameProviderDb } from '@repo/database';

export class CreateGameProviderDto implements Partial<GameProviderDb> {
  @ApiProperty({
    description: 'The name of the game provider',
    example: 'Steam',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the game provider',
    example: 'Digital distribution platform for video games',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'URL to the provider logo/image',
    example: 'https://example.com/steam-logo.png',
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}
