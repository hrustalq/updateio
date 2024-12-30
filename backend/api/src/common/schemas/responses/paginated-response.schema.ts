import { ApiProperty } from '@nestjs/swagger';
import { PaginatedMetadataSchema } from './paginated-metadata.schema';

export class PaginatedResponseSchema<T> {
  @ApiProperty({
    description: 'Response data',
    isArray: true,
  })
  data: T[];

  @ApiProperty({
    description: 'Response metadata with pagination',
    type: PaginatedMetadataSchema,
  })
  metadata: PaginatedMetadataSchema;
}
