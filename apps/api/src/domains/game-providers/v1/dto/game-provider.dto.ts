import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GameProviderDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'cl1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Game provider name',
    example: 'Steam',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Game provider description',
    example: 'Digital distribution platform for video games',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'URL to provider logo/image',
    example: 'https://example.com/steam-logo.png',
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Related games count',
    example: { games: 100 },
  })
  _count?: {
    games: number;
  };
}
