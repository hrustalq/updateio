import { ApiProperty } from '@nestjs/swagger';

export class BaseMetadataSchema {
  @ApiProperty({
    description: 'Timestamp of the response',
    format: 'date-time',
    example: new Date().toISOString(),
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: 'http://localhost:3000/api/v1/example',
  })
  path: string;

  @ApiProperty({
    description: 'API version',
    example: '1',
  })
  version: string;
}
