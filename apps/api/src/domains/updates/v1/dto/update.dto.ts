import { ApiProperty } from '@nestjs/swagger';

export class UpdateDto {
  @ApiProperty({
    description: 'The unique identifier of the update',
    example: 'clrk2345600000123jk5678',
  })
  id: string;

  @ApiProperty({
    description: 'The version of the update',
    example: '1.0.0',
    required: false,
  })
  version?: string;

  @ApiProperty({
    description: 'The content of the update',
    example: 'Added new features and fixed bugs',
    required: false,
  })
  content?: string;

  @ApiProperty({
    description: 'ID of the game this update belongs to',
    example: 'clrk2345600000123jk5679',
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
