import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class TelegramAuthDto {
  @ApiProperty({
    description: 'Telegram user ID',
    example: 12345678,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiProperty({
    description: 'Telegram username',
    example: 'johndoe',
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'URL to user profile photo',
    example: 'https://t.me/i/userpic/123/photo.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  photo_url?: string;

  @ApiProperty({
    description: 'Authentication timestamp',
    example: 1617123456,
  })
  @IsNumber()
  @IsNotEmpty()
  auth_date: number;

  @ApiProperty({
    description: 'Data hash for verification',
    example: 'abc123def456...',
  })
  @IsString()
  @IsNotEmpty()
  hash: string;
}
