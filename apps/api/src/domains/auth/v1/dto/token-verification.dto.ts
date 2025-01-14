import { ApiProperty } from '@nestjs/swagger';

export class TokenVerificationDto {
  @ApiProperty({
    description: 'Token issued at timestamp (in seconds)',
    example: 1678901234,
  })
  issued_at: number;

  @ApiProperty({
    description: 'Token expiration timestamp (in seconds)',
    example: 1678904834,
  })
  expires_in: number;

  @ApiProperty({
    description: 'User ID associated with the token',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user_id: string;
}
