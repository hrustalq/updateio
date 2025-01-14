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
  .setTitle('Discord Bot API Documentation')
  .setDescription(
    [
      'API documentation for the Discord Bot.',
      '',
      '## Authentication',
      'This API uses API key authentication. Add your API key to the `X-API-KEY` header.',
      'API keys are prefixed with `discord_` and can be generated through the `/api/v1/auth/api-key/generate` endpoint.',
      '',
      'Download [swagger.json](/swagger.json)',
    ].join('\n'),
  )
  .setVersion('1.0')
  .addApiKey(
    {
      type: 'apiKey',
      in: 'header',
      name: 'X-API-KEY',
      description: 'API key for authentication',
    },
    'api-key',
  )
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
