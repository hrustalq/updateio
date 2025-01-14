import { ApiProperty } from '@nestjs/swagger';

export class ApiKeyResponseDto {
  @ApiProperty({
    description: 'Generated API key',
    example: 'tg_1a2b3c4d...',
  })
  apiKey: string;
}

export class ApiKeyMessageDto {
  @ApiProperty({
    description: 'Operation result message',
    example: 'API key revoked successfully',
  })
  message: string;
}
