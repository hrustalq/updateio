import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@repo/database';

export class UserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The Telegram ID of the user',
    example: '123456789',
    required: false,
  })
  telegramId?: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    example: UserRole.USER,
  })
  role: UserRole;
}
