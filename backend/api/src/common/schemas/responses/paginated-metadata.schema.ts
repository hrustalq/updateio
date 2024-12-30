import { ApiProperty } from '@nestjs/swagger';
import { BaseMetadataSchema } from './base-metadata.schema';
import { PaginationMetadataSchema } from './pagination-metadata.schema';

export class PaginatedMetadataSchema extends BaseMetadataSchema {
  @ApiProperty({
    description: 'Pagination information',
    type: PaginationMetadataSchema,
  })
  pagination: PaginationMetadataSchema;
}
