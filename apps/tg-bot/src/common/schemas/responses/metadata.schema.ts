import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetadataSchema } from './pagination-metadata.schema';

export class MetadataSchema {
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

  @ApiProperty({
    description: 'Pagination information',
    required: false,
    type: PaginationMetadataSchema,
  })
  pagination?: PaginationMetadataSchema;
}
