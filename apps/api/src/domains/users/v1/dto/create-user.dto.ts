import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { UserRole } from '@repo/database';

export class CreateUserDto {
  @ApiProperty({
    description: 'Telegram ID of the user',
    example: '123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  telegramId?: string;

  @ApiProperty({
    description: 'User password',
    required: false,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
