import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseSchema {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    oneOf: [
      { type: 'string', example: 'Error message' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['Error 1', 'Error 2'],
      },
    ],
  })
  message: string | string[];

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    description: 'Timestamp of the error',
    format: 'date-time',
    example: new Date().toISOString(),
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: 'http://localhost:3000/api/v1/example',
  })
  path: string;
}
