import { DocumentBuilder } from '@nestjs/swagger';
import {
  ErrorResponseSchema,
  BaseResponseSchema,
  BaseMetadataSchema,
  PaginatedResponseSchema,
  PaginationMetadataSchema,
  PaginatedMetadataSchema,
} from '../common/schemas/responses';

import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { FindOneParamsDto } from '../common/dto/find-one-params.dto';
import { SortingQueryDto } from '../common/dto/sorting-query.dto';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('API Documentation')
  .setDescription(
    [
      'API documentation for the application.',
      '',
      'Download [swagger.json](/swagger.json)',
    ].join('\n'),
  )
  .setVersion('1.0')
  .addServer('http://localhost:3000', 'Local environment')
  .addServer('https://api.production.com', 'Production environment')
  .addBearerAuth()
  .build();

export const swaggerOptions = {
  include: [],
  extraModels: [
    ErrorResponseSchema,
    BaseResponseSchema,
    PaginatedResponseSchema,
    PaginatedMetadataSchema,
    PaginationMetadataSchema,
    BaseMetadataSchema,
    PaginationQueryDto,
    FindOneParamsDto,
    SortingQueryDto,
  ],
};
