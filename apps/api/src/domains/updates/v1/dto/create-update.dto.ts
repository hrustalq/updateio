import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUpdateDto {
  @ApiProperty({
    description: 'The version of the update',
    example: '1.0.0',
    required: false,
  })
  @IsString()
  @IsOptional()
  version?: string;

  @ApiProperty({
    description: 'The content of the update',
    example: 'Added new features and fixed bugs',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: 'ID of the game this update belongs to',
    example: 'clrk2345600000123jk5679',
  })
  @IsString()
  @IsNotEmpty()
  gameId: string;
}
