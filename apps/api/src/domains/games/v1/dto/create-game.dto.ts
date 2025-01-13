import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGameDto {
  @ApiProperty({
    description: 'The name of the game',
    example: 'Counter-Strike 2',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the game',
    example: 'Popular competitive first-person shooter game',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'URL to the game image',
    example: 'https://example.com/cs2.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'External ID of the game (e.g. Steam App ID)',
    example: '730',
    required: false,
  })
  @IsString()
  @IsOptional()
  externalId?: string;

  @ApiProperty({
    description: 'ID of the game provider',
    example: 'clrk2345600000123jk5679',
  })
  @IsString()
  @IsNotEmpty()
  providerId: string;
}
