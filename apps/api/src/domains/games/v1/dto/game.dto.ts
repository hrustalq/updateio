import { ApiProperty } from '@nestjs/swagger';

export class GameDto {
  @ApiProperty({
    description: 'The unique identifier of the game',
    example: 'clrk2345600000123jk5678',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the game',
    example: 'Counter-Strike 2',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the game',
    example: 'Popular competitive first-person shooter game',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'URL to the game image',
    example: 'https://example.com/cs2.jpg',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'External ID of the game (e.g. Steam App ID)',
    example: '730',
    required: false,
  })
  externalId?: string;

  @ApiProperty({
    description: 'ID of the game provider',
    example: 'clrk2345600000123jk5679',
  })
  providerId: string;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}
