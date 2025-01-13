import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@repo/database';

export class UserDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 'clrk2345600000123jk5678',
  })
  id: string;

  @ApiProperty({
    description: 'Telegram ID of the user',
    example: '123456789',
    required: false,
  })
  telegramId?: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}
