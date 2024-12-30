import { ApiProperty } from '@nestjs/swagger';
import { BaseMetadataSchema } from './base-metadata.schema';

export class BaseResponseSchema<T> {
  @ApiProperty({ description: 'Response data' })
  data: T;

  @ApiProperty({
    description: 'Response metadata',
    type: BaseMetadataSchema,
  })
  metadata: BaseMetadataSchema;
}
