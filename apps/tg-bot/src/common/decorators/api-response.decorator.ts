import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiResponse as SwaggerResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { PATH_METADATA, VERSION_METADATA } from '@nestjs/common/constants';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { defaultErrorExamples } from '../constants/error-examples.constant';

export interface IApiResponseOptions {
  type?: Type<any>;
  isArray?: boolean;
  description?: string;
  status?: number;
  includeErrors?: boolean;
  includePagination?: boolean;
}

export const ApiResponse = (options: IApiResponseOptions = {}) => {
  const {
    type,
    isArray = false,
    description,
    status = 200,
    includeErrors = true,
    includePagination = isArray,
  } = options;

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // Get controller metadata
    const controllerPath =
      Reflect.getMetadata(PATH_METADATA, target.constructor) || '';
    const controllerVersion =
      Reflect.getMetadata(VERSION_METADATA, target.constructor) || '1';
    const methodPath =
      Reflect.getMetadata(PATH_METADATA, descriptor.value) || '';

    // Get existing response decorators
    const existingResponses =
      Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value) || [];
    const existingResponseCodes = existingResponses.map(
      (response: any) => response.status,
    );

    // Construct path with proper structure
    const basePath = 'api';
    const versionPath = `v${controllerVersion}`;
    const fullPath =
      `/${basePath}/${versionPath}/${controllerPath}${methodPath}`.replace(
        /\/+/g,
        '/',
      );
    const examplePath = `http://localhost:3000${fullPath}`;

    const paginationSchema = includePagination
      ? {
          pagination: {
            type: 'object',
            properties: {
              total: {
                type: 'number',
                description: 'Total number of items',
                example: 100,
              },
              page: {
                type: 'number',
                description: 'Current page number',
                example: 1,
              },
              limit: {
                type: 'number',
                description: 'Items per page',
                example: 10,
              },
              totalPages: {
                type: 'number',
                description: 'Total number of pages',
                example: 10,
              },
              hasPreviousPage: {
                type: 'boolean',
                description: 'Whether there is a previous page',
                example: false,
              },
              hasNextPage: {
                type: 'boolean',
                description: 'Whether there is a next page',
                example: true,
              },
            },
          },
        }
      : {};

    const successResponseSchema = {
      description: description || 'Successful response with metadata',
      schema: {
        allOf: [
          {
            properties: {
              data: type
                ? {
                    ...(isArray
                      ? {
                          type: 'array',
                          items: { $ref: getSchemaPath(type) },
                        }
                      : {
                          $ref: getSchemaPath(type),
                        }),
                  }
                : {},
              metadata: {
                type: 'object',
                properties: {
                  timestamp: {
                    type: 'string',
                    format: 'date-time',
                    example: new Date().toISOString(),
                  },
                  path: {
                    type: 'string',
                    example: examplePath,
                  },
                  version: {
                    type: 'string',
                    example: controllerVersion,
                  },
                  ...paginationSchema,
                },
              },
            },
          },
        ],
      },
    };

    const errorSchema = {
      schema: {
        properties: {
          statusCode: { type: 'number' },
          message: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } },
            ],
          },
          error: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          path: { type: 'string' },
        },
      },
    };

    const decorators = [ApiExtraModels(type)];

    // Success response
    switch (status) {
      case 201:
        decorators.push(ApiCreatedResponse(successResponseSchema));
        break;
      case 200:
        decorators.push(ApiOkResponse(successResponseSchema));
        break;
      default:
        decorators.push(SwaggerResponse({ status, ...successResponseSchema }));
    }

    // Error responses - only add if not already defined and includeErrors is true
    if (includeErrors) {
      const defaultErrorDecorators = [
        {
          code: 400,
          decorator: ApiBadRequestResponse,
          description: defaultErrorExamples.badRequest.description,
          example: defaultErrorExamples.badRequest.value,
        },
        {
          code: 401,
          decorator: ApiUnauthorizedResponse,
          description: defaultErrorExamples.unauthorized.description,
          example: defaultErrorExamples.unauthorized.value,
        },
        {
          code: 403,
          decorator: ApiForbiddenResponse,
          description: defaultErrorExamples.forbidden.description,
          example: defaultErrorExamples.forbidden.value,
        },
        {
          code: 404,
          decorator: ApiNotFoundResponse,
          description: defaultErrorExamples.notFound.description,
          example: defaultErrorExamples.notFound.value,
        },
        {
          code: 500,
          decorator: ApiInternalServerErrorResponse,
          description: defaultErrorExamples.internalError.description,
          example: defaultErrorExamples.internalError.value,
        },
      ];

      defaultErrorDecorators.forEach(
        ({ code, decorator, description, example }) => {
          if (!existingResponseCodes.includes(code)) {
            decorators.push(
              decorator({
                description,
                schema: {
                  ...errorSchema.schema,
                  example,
                },
              }),
            );
          }
        },
      );
    }

    return applyDecorators(...decorators)(target, propertyKey, descriptor);
  };
};
