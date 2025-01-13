import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class JwtDto {
  @ApiProperty({ description: 'Access token', type: 'string' })
  access_token: string;

  @ApiProperty({ description: 'Access token expires in', type: 'number' })
  @IsNumber()
  expires_in: number;

  @ApiProperty({ description: 'Issued at', type: 'number' })
  @IsNumber()
  issued_at: number;
}
