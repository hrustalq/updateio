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
}
